import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Home, 
  Users, 
  Share2, 
  Clock, 
  Star,
  Folder,
  Globe,
  Lock
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Sidebar() {
  const location = useLocation();
  const { getAccessibleDocuments, auth } = useApp();
  
  const documents = getAccessibleDocuments();
  const myDocuments = documents.filter(doc => doc.authorId === auth.user?.id);
  const sharedDocuments = documents.filter(doc => 
    doc.authorId !== auth.user?.id && 
    doc.sharedWith.some(p => p.userId === auth.user?.id)
  );
  const publicDocuments = documents.filter(doc => doc.isPublic);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/', exact: true },
    { icon: FileText, label: 'All Documents', path: '/documents' },
    { icon: Users, label: 'Shared with me', path: '/shared' },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: Star, label: 'Favorites', path: '/favorites' },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-8">
        {/* Main Navigation */}
        <div>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path, item.exact)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Document Categories */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Access
          </h3>
          <ul className="space-y-2">
            <li>
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <Folder className="w-4 h-4 mr-3 text-gray-400" />
                <span>My Documents</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {myDocuments.length}
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <Share2 className="w-4 h-4 mr-3 text-gray-400" />
                <span>Shared</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {sharedDocuments.length}
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-3 text-gray-400" />
                <span>Public</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {publicDocuments.length}
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Recent Documents */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Recent Documents
          </h3>
          <ul className="space-y-1">
            {documents.slice(0, 5).map((doc) => (
              <li key={doc.id}>
                <Link
                  to={`/documents/${doc.id}`}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  {doc.isPublic ? (
                    <Globe className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <Lock className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                  )}
                  <span className="truncate">{doc.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}