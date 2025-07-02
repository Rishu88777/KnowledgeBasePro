import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Edit, 
  Share2, 
  Globe, 
  ArrowLeft, 
  Clock, 
  History,
  AlertCircle,
  Users
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, loading, error } = useApp();
  const [showVersions, setShowVersions] = useState(false);

  const document = documents.find(doc => doc.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
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

  return (
    <div className="max-w-4xl mx-auto">
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
                    <div className="w-4 h-4 bg-gray-400 rounded-full" />
                  )}
                  <span>{document.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </div>
        </div>

        {showVersions && (
          <div className="w-80 bg-white rounded-lg border border-gray-200 p-6">
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
                  {version.changeDescription && (
                    <div className="text-sm text-gray-500 italic">
                      {version.changeDescription}
                    </div>
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