import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  Plus, 
  Clock, 
  Users, 
  Globe, 
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
  const { getAccessibleDocuments, auth } = useApp();
  
  const documents = getAccessibleDocuments();
  const myDocuments = documents.filter(doc => doc.authorId === auth.user?.id);
  const sharedDocuments = documents.filter(doc => 
    doc.authorId !== auth.user?.id && 
    doc.sharedWith.some(p => p.userId === auth.user?.id)
  );
  const recentDocuments = documents
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      name: 'My Documents',
      value: myDocuments.length,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Shared with me',
      value: sharedDocuments.length,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      name: 'Public Documents',
      value: documents.filter(doc => doc.isPublic).length,
      icon: Globe,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      name: 'Total Views',
      value: documents.length * 12, // Simulated
      icon: Eye,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {auth.user?.name}!</h1>
            <p className="text-primary-100 text-lg">
              Ready to create and collaborate on amazing documents?
            </p>
          </div>
          <Link
            to="/documents/new"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Document
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
                <Link
                  to="/documents"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {recentDocuments.map((document) => (
                    <Link
                      key={document.id}
                      to={`/documents/${document.id}`}
                      className="block p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{document.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            By {document.author.name} • Updated {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            {document.isPublic ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Private
                              </span>
                            )}
                            {document.sharedWith.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Users className="w-3 h-3 mr-1" />
                                Shared
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-500 mb-4">Create your first document to get started</p>
                  <Link
                    to="/documents/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Document
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {documents.slice(0, 3).map((document, index) => (
                  <div key={document.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{document.author.name}</span> updated{' '}
                        <Link
                          to={`/documents/${document.id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {document.title}
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {documents.length === 0 && (
                <div className="text-center py-6">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}