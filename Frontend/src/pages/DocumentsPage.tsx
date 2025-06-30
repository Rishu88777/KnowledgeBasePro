import React from 'react';
import { useLocation } from 'react-router-dom';
import DocumentList from '../components/documents/DocumentList';
import { useApp } from '../contexts/AppContext';

export default function DocumentsPage() {
  const location = useLocation();
  const { getAccessibleDocuments, auth } = useApp();
  
  const allDocuments = getAccessibleDocuments();
  
  const getDocumentsForPage = () => {
    switch (location.pathname) {
      case '/shared':
        return allDocuments.filter(doc => 
          doc.authorId !== auth.user?.id && 
          doc.sharedWith.some(p => p.userId === auth.user?.id)
        );
      case '/recent':
        return allDocuments
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 10);
      case '/favorites':
        return []; // Placeholder for favorites functionality
      default:
        return allDocuments;
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/shared':
        return 'Shared with me';
      case '/recent':
        return 'Recent documents';
      case '/favorites':
        return 'Favorite documents';
      default:
        return 'All documents';
    }
  };

  const getEmptyMessage = () => {
    switch (location.pathname) {
      case '/shared':
        return 'No documents have been shared with you yet';
      case '/recent':
        return 'No recent documents';
      case '/favorites':
        return 'No favorite documents yet';
      default:
        return 'No documents found';
    }
  };

  const documents = getDocumentsForPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="text-sm text-gray-500">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <DocumentList 
        documents={documents}
        emptyMessage={getEmptyMessage()}
      />
    </div>
  );
}