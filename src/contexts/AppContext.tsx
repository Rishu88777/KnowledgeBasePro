import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiService, User, Document } from '../services/api';

interface AppState {
  documents: Document[];
  searchQuery: string;
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  createDocument: (title: string, content: string, isPublic: boolean) => Promise<Document>;
  updateDocument: (id: string, title: string, content: string, changeDescription?: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  searchDocuments: (query: string) => void;
  selectDocument: (document: Document | null) => void;
  refreshDocuments: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  documents: [],
  searchQuery: '',
  selectedDocument: null,
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
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
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SELECT_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  React.useEffect(() => {
    const initializeData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const documents = await apiService.getDocuments();
        dispatch({ type: 'SET_DOCUMENTS', payload: documents });
      } catch (error) {
        console.error('Failed to initialize data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data from server' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    initializeData();
  }, []);

  const refreshDocuments = async () => {
    try {
      const documents = await apiService.getDocuments();
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      console.error('Failed to refresh documents:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh documents' });
    }
  };

  const createDocument = async (title: string, content: string, isPublic: boolean): Promise<Document> => {
    try {
      const newDocument = await apiService.createDocument(title, content, isPublic);
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
      return newDocument;
    } catch (error: any) {
      console.error('Failed to create document:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create document' });
      throw error;
    }
  };

  const updateDocument = async (id: string, title: string, content: string, changeDescription?: string) => {
    try {
      const updatedDocument = await apiService.updateDocument(id, title, content, changeDescription);
      dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument });
    } catch (error: any) {
      console.error('Failed to update document:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update document' });
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await apiService.deleteDocument(id);
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    } catch (error) {
      console.error('Failed to delete document:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete document' });
      throw error;
    }
  };

  const searchDocuments = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const selectDocument = (document: Document | null) => {
    dispatch({ type: 'SELECT_DOCUMENT', payload: document });
  };

  const contextValue: AppContextType = {
    ...state,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    selectDocument,
    refreshDocuments,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}