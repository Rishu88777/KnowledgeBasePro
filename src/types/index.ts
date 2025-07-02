export interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  content: string;
  title: string;
  createdAt: string;
  changeDescription?: string;
}

export interface AppState {
  documents: Document[];
  searchQuery: string;
  selectedDocument: Document | null;
  currentUser: User;
  loading: boolean;
  error: string | null;
}