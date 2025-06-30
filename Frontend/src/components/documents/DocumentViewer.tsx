import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Edit, 
  Share2, 
  Globe, 
  Lock, 
  ArrowLeft, 
  Clock, 
  User, 
  MoreVertical,
  History,
  AlertCircle,
  Eye,
  Users
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, auth } = useApp();
  const [showVersions, setShowVersions] = useState(false);

  const document = documents.find(doc => doc.id === id);

  if (!document) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Document not found</h3>
          <p className="text-gray-500 mb-4">The document you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/documents')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  // Check if user has access
  const hasAccess = document.isPublic || 
    document.authorId === auth.user?.id ||
    document.sharedWith.some(p => p.userId === auth.user?.id);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500 mb-4">You don't have permission to view this document.</p>
          <button
            onClick={() => navigate('/documents')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const canEdit = document.authorId === auth.user?.id ||
    document.sharedWith.some(p => p.userId === auth.user?.id && p.permission === 'edit');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/documents')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  {document.isPublic ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                  <span>{document.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{document.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}</span>
                </div>
                {document.sharedWith.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600">Shared with {document.sharedWith.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <History className="w-4 h-4 mr-2" />
              History ({document.versions.length})
            </button>

            <Link
              to={`/documents/${id}/share`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Link>

            {canEdit && (
              <Link
                to={`/documents/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </div>
        </div>

        {/* Version History Sidebar */}
        {showVersions && (
          <div className="w-80 bg-white rounded-lg border border-gray-200 p-6 animate-slide-down">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
            <div className="space-y-4">
              {document.versions.slice().reverse().map((version, index) => (
                <div key={version.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {index === 0 ? 'Current' : `Version ${document.versions.length - index}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    By {version.author.name}
                  </div>
                  {version.changeDescription && (
                    <div className="text-sm text-gray-500 italic">
                      {version.changeDescription}
                    </div>
                  )}
                  {index !== 0 && (
                    <button className="text-xs text-primary-600 hover:text-primary-700 mt-2">
                      View this version
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}