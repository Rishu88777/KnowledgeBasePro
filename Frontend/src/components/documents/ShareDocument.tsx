import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Lock, 
  Mail, 
  Plus, 
  X, 
  Eye, 
  Edit3,
  Copy,
  CheckCircle,
  Users
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function ShareDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, users, shareDocument, removeDocumentAccess, auth } = useApp();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [isAdding, setIsAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  const document = documents.find(doc => doc.id === id);

  if (!document) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Document not found</h3>
        </div>
      </div>
    );
  }

  const canManageSharing = document.authorId === auth.user?.id;

  if (!canManageSharing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">Only the document owner can manage sharing settings.</p>
        </div>
      </div>
    );
  }

  const handleAddUser = () => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.id !== document.authorId) {
      shareDocument(document.id, user.id, permission);
      setEmail('');
      setIsAdding(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    removeDocumentAccess(document.id, userId);
  };

  const handleCopyLink = () => {
    const url = document.isPublic 
      ? `${window.location.origin}/public/${document.id}`
      : window.location.href.replace('/share', '');
    
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableUsers = users.filter(user => 
    user.id !== document.authorId &&
    !document.sharedWith.some(p => p.userId === user.id) &&
    user.email.toLowerCase().includes(email.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/documents/${id}`)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Share Document</h1>
            <p className="text-gray-600 mt-1">{document.title}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Document Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {document.isPublic ? (
                <Globe className="w-6 h-6 text-green-500" />
              ) : (
                <Lock className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {document.isPublic ? 'Public Document' : 'Private Document'}
                </h3>
                <p className="text-sm text-gray-500">
                  {document.isPublic 
                    ? 'Anyone with the link can view this document'
                    : 'Only people with access can view this document'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Shared Users */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  People with access
                </h3>
              </div>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add people
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Owner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {document.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{document.author.name}</div>
                  <div className="text-sm text-gray-500">{document.author.email}</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Owner
              </span>
            </div>

            {/* Shared Users */}
            {document.sharedWith.map((permission) => (
              <div key={permission.userId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {permission.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{permission.user.name}</div>
                    <div className="text-sm text-gray-500">{permission.user.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    {permission.permission === 'edit' ? (
                      <Edit3 className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span className="capitalize">{permission.permission}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(permission.userId)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add User Form */}
            {isAdding && (
              <div className="border-t border-gray-200 pt-4 mt-4 animate-slide-down">
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* User Suggestions */}
                  {email && availableUsers.length > 0 && (
                    <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                      {availableUsers.slice(0, 5).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => setEmail(user.email)}
                          className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="view"
                          checked={permission === 'view'}
                          onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                          className="mr-2"
                        />
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-sm">View</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="edit"
                          checked={permission === 'edit'}
                          onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                          className="mr-2"
                        />
                        <Edit3 className="w-4 h-4 mr-1" />
                        <span className="text-sm">Edit</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setIsAdding(false);
                          setEmail('');
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddUser}
                        disabled={!email || !users.find(u => u.email.toLowerCase() === email.toLowerCase())}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {document.sharedWith.length === 0 && !isAdding && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No one else has access to this document yet.</p>
                <p className="text-sm">Click "Add people" to start sharing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}