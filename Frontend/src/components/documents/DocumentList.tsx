import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  Globe, 
  Lock, 
  Users, 
  MoreVertical, 
  Edit, 
  Share2, 
  Trash2,
  Eye,
  User
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Document } from '../../types';

interface DocumentListProps {
  documents?: Document[];
  showAuthor?: boolean;
  emptyMessage?: string;
}

export default function DocumentList({ 
  documents: propDocuments, 
  showAuthor = true,
  emptyMessage = "No documents found"
}: DocumentListProps) {
  const { getAccessibleDocuments, searchQuery, deleteDocument, auth } = useApp();
  
  const allDocuments = propDocuments || getAccessibleDocuments();
  
  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return allDocuments;
    
    const query = searchQuery.toLowerCase();
    return allDocuments.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query) ||
      doc.author.name.toLowerCase().includes(query)
    );
  }, [allDocuments, searchQuery]);

  const handleDelete = (docId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(docId);
    }
  };

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery ? 'No matching documents' : emptyMessage}
        </h3>
        <p className="text-gray-500 mb-6">
          {searchQuery 
            ? `No documents match "${searchQuery}"`
            : "Get started by creating your first document"
          }
        </p>
        {!searchQuery && (
          <Link
            to="/documents/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Document
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDocuments.map((document) => (
        <div
          key={document.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    {document.isPublic ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {document.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  {document.sharedWith.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">
                        Shared with {document.sharedWith.length}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/documents/${document.id}`}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {document.title}
                  </h3>
                  <div 
                    className="text-gray-600 text-sm line-clamp-2 mb-3"
                    dangerouslySetInnerHTML={{ 
                      __html: document.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    }}
                  />
                </Link>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {showAuthor && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{document.author.name}</span>
                      </div>
                    )}
                    <span>
                      Updated {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span>{document.versions.length} version{document.versions.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to={`/documents/${document.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View document"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                
                {(document.authorId === auth.user?.id || 
                  document.sharedWith.some(p => p.userId === auth.user?.id && p.permission === 'edit')) && (
                  <Link
                    to={`/documents/${document.id}/edit`}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit document"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                )}

                <Link
                  to={`/documents/${document.id}/share`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share document"
                >
                  <Share2 className="w-4 h-4" />
                </Link>

                {document.authorId === auth.user?.id && (
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}