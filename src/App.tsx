import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/DocumentsPage';
import DocumentEditor from './components/DocumentEditor';
import DocumentViewer from './components/DocumentViewer';

function App() {
  return (
    <AppProvider>
      <Router>
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
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;