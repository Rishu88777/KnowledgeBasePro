export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  isPublic: boolean;
  sharedWith: DocumentPermission[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
  versions: DocumentVersion[];
}

export interface DocumentPermission {
  userId: string;
  user: User;
  permission: 'view' | 'edit';
  grantedAt: Date;
}

export interface DocumentVersion {
  id: string;
  content: string;
  title: string;
  authorId: string;
  author: User;
  createdAt: Date;
  changeDescription?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  documents: Document[];
  users: User[];
  searchQuery: string;
  selectedDocument: Document | null;
}