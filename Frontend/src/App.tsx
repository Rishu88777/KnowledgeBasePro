import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import AuthGuard from './components/auth/AuthGuard';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/DocumentsPage';
import DocumentEditor from './components/documents/DocumentEditor';
import DocumentViewer from './components/documents/DocumentViewer';
import ShareDocument from './components/documents/ShareDocument';
import AuthPage from './pages/AuthPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function AppContent() {
  const { auth } = useApp();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            auth.isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
          }
        />
        <Route
          path="/register"
          element={
            auth.isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
          }
        />
        <Route
          path="/forgot-password"
          element={
            auth.isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex h-[calc(100vh-4rem)]">
                  <div className="hidden md:block">
                    <Sidebar />
                  </div>
                  <main className="flex-1 overflow-auto">
                    <div className="p-6">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/shared" element={<DocumentsPage />} />
                        <Route path="/recent" element={<DocumentsPage />} />
                        <Route path="/favorites" element={<DocumentsPage />} />
                        <Route path="/documents/new" element={<DocumentEditor />} />
                        <Route path="/documents/:id" element={<DocumentViewer />} />
                        <Route path="/documents/:id/edit" element={<DocumentEditor />} />
                        <Route path="/documents/:id/share" element={<ShareDocument />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;