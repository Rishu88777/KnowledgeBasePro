import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, User, Document, DocumentVersion, DocumentPermission } from '../types';

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean | string>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  createDocument: (title: string, content: string, isPublic: boolean) => Promise<Document | null>;
  updateDocument: (id: string, title: string, content: string, changeDescription?: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  shareDocument: (documentId: string, userId: string, permission: 'view' | 'edit') => Promise<void>;
  removeDocumentAccess: (documentId: string, userId: string) => Promise<void>;
  searchDocuments: (query: string) => void;
  selectDocument: (document: Document | null) => void;
  getUserById: (id: string) => User | undefined;
  getAccessibleDocuments: () => Document[];
  mentionUser: (documentId: string, userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_AUTH'; payload: { user: User | null; isAuthenticated: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SELECT_DOCUMENT'; payload: Document | null };

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  },
  documents: [],
  users: [],
  searchQuery: '',
  selectedDocument: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload.user,
          isAuthenticated: action.payload.isAuthenticated,
          isLoading: false,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        auth: { ...state.auth, isLoading: action.payload },
      };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        ),
        selectedDocument: state.selectedDocument?.id === action.payload.id ? action.payload : state.selectedDocument,
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        selectedDocument: state.selectedDocument?.id === action.payload ? null : state.selectedDocument,
      };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SELECT_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch initial data from backend
  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Fetch current user (if session/cookie exists)
        const userRes = await fetch('/api/auth/me', { credentials: 'include' });
        let user: User | null = null;
        if (userRes.ok) {
          user = await userRes.json();
        }
        dispatch({ type: 'SET_AUTH', payload: { user, isAuthenticated: !!user } });

        // Fetch users
        const usersRes = await fetch('/api/users', { credentials: 'include' });
        if (usersRes.ok) {
          const users = await usersRes.json();
          dispatch({ type: 'SET_USERS', payload: users });
        }

        // Fetch documents
        const docsRes = await fetch('/api/documents', { credentials: 'include' });
        if (docsRes.ok) {
          const documents = await docsRes.json();
          dispatch({ type: 'SET_DOCUMENTS', payload: documents });
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchInitialData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const user = await res.json();
        dispatch({ type: 'SET_AUTH', payload: { user, isAuthenticated: true } });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: { name: string; email: string; password: string }): Promise<boolean | string> => {
    try {
      console.log('Registering user:', data);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        // Optionally auto-login after register
        return await login(data.email, data.password);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Registration failed:', errorData);
        return errorData.message || 'Registration failed.';
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return error?.message || 'Registration error.';
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    dispatch({ type: 'SET_AUTH', payload: { user: null, isAuthenticated: false } });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return res.ok;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const createDocument = async (title: string, content: string, isPublic: boolean): Promise<Document | null> => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, isPublic }),
      });
      if (res.ok) {
        const doc = await res.json();
        dispatch({ type: 'ADD_DOCUMENT', payload: doc });
        return doc;
      }
      return null;
    } catch (error) {
      console.error('Create document error:', error);
      return null;
    }
  };

  const updateDocument = async (id: string, title: string, content: string, changeDescription?: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, changeDescription }),
      });
      if (res.ok) {
        const doc = await res.json();
        dispatch({ type: 'UPDATE_DOCUMENT', payload: doc });
      }
    } catch (error) {
      console.error('Update document error:', error);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch({ type: 'DELETE_DOCUMENT', payload: id });
      }
    } catch (error) {
      console.error('Delete document error:', error);
    }
  };

  const shareDocument = async (documentId: string, userId: string, permission: 'view' | 'edit') => {
    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, permission }),
      });
      if (res.ok) {
        const doc = await res.json();
        dispatch({ type: 'UPDATE_DOCUMENT', payload: doc });
      }
    } catch (error) {
      console.error('Share document error:', error);
    }
  };

  const removeDocumentAccess = async (documentId: string, userId: string) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/share/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const doc = await res.json();
        dispatch({ type: 'UPDATE_DOCUMENT', payload: doc });
      }
    } catch (error) {
      console.error('Remove document access error:', error);
    }
  };

  const mentionUser = async (documentId: string, userId: string) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/mention`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const doc = await res.json();
        dispatch({ type: 'UPDATE_DOCUMENT', payload: doc });
      }
    } catch (error) {
      console.error('Mention user error:', error);
    }
  };

  const searchDocuments = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const selectDocument = (document: Document | null) => {
    dispatch({ type: 'SELECT_DOCUMENT', payload: document });
  };

  const getUserById = (id: string): User | undefined => {
    return state.users.find(user => user.id === id);
  };

  const getAccessibleDocuments = (): Document[] => {
    if (!state.auth.user) return state.documents.filter(doc => doc.isPublic);
    return state.documents.filter(doc =>
      doc.isPublic ||
      doc.authorId === state.auth.user!.id ||
      doc.sharedWith.some(p => p.userId === state.auth.user!.id)
    );
  };

  const contextValue: AppContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    createDocument,
    updateDocument,
    deleteDocument,
    shareDocument,
    removeDocumentAccess,
    searchDocuments,
    selectDocument,
    getUserById,
    getAccessibleDocuments,
    mentionUser,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}