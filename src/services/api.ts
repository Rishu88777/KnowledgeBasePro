const API_BASE_URL = 'http://localhost:8080/api';

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

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      let errorText = '';
      if (!response.ok) {
        try {
          const data = await response.json();
          errorText = data.message || JSON.stringify(data);
        } catch (e) {
          errorText = await response.text();
        }
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      if (config.method === 'DELETE' || response.status === 204) {
        return null as T;
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Document API
  async getDocuments(userId?: string): Promise<Document[]> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<Document[]>(`/documents${params}`);
  }

  async getDocumentById(id: string, userId?: string): Promise<Document> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<Document>(`/documents/${id}${params}`);
  }

  async getDocumentsByAuthor(authorId: string): Promise<Document[]> {
    return this.request<Document[]>(`/documents/author/${authorId}`);
  }

  async getPublicDocuments(): Promise<Document[]> {
    return this.request<Document[]>('/documents/public');
  }

  async searchDocuments(query: string, userId?: string): Promise<Document[]> {
    const params = new URLSearchParams({ q: query });
    if (userId) params.append('userId', userId);
    return this.request<Document[]>(`/documents/search?${params}`);
  }

  async createDocument(
    title: string,
    content: string,
    isPublic: boolean
  ): Promise<Document> {
    return this.request<Document>(`/documents`, {
      method: 'POST',
      body: JSON.stringify({ title, content, isPublic }),
    });
  }

  async updateDocument(
    id: string,
    title: string,
    content: string,
    changeDescription?: string
  ): Promise<Document> {
    return this.request<Document>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, changeDescription }),
    });
  }

  async deleteDocument(id: string): Promise<void> {
    return this.request<void>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async shareDocument(
    id: string,
    email: string,
    permission: 'view' | 'edit',
    ownerId: string
  ): Promise<Document> {
    return this.request<Document>(`/documents/${id}/share?ownerId=${ownerId}`, {
      method: 'POST',
      body: JSON.stringify({ email, permission }),
    });
  }

  async removeDocumentAccess(
    documentId: string,
    userId: string,
    ownerId: string
  ): Promise<Document> {
    return this.request<Document>(`/documents/${documentId}/share/${userId}?ownerId=${ownerId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();