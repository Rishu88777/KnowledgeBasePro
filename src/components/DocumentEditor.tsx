import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save, 
  Eye, 
  Globe, 
  ArrowLeft, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    documents, 
    createDocument, 
    updateDocument, 
    loading,
    error
  } = useApp();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autoSaveTimer = useRef<NodeJS.Timeout>();

  const isEditing = !!id;
  const document = isEditing ? documents.find(doc => doc.id === id) : null;

  useEffect(() => {
    if (isEditing && document) {
      setTitle(document.title);
      setContent(document.content);
      setIsPublic(document.isPublic);
    }
  }, [isEditing, document]);

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

  if (isEditing && !document) {
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

  const triggerAutoSave = () => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    
    autoSaveTimer.current = setTimeout(() => {
      if (title.trim() && content.trim()) {
        handleSave(true);
      }
    }, 2000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (isEditing) {
      triggerAutoSave();
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (isEditing) {
      triggerAutoSave();
    }
  };

  const handleSave = async (isAutoSave = false) => {
    if (!title.trim() || !content.trim()) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      if (isEditing) {
        await updateDocument(id!, title, content, isAutoSave ? undefined : 'Manual save');
      } else {
        const newDocument = await createDocument(title, content, isPublic);
        navigate(`/documents/${newDocument.id}`);
        return;
      }
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (isEditing) {
      navigate(`/documents/${id}`);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'blockquote', 'code-block', 'link', 'image'
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Document' : 'New Document'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {saveStatus === 'saving' && (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Error saving</span>
                </>
              )}
              {lastSaved && saveStatus === 'idle' && (
                <span>Last saved {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {isEditing && (
                <button
                  onClick={handlePreview}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
              )}
              
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving || !title.trim() || !content.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Document title..."
            className="w-full text-3xl font-bold border-none outline-none focus:ring-0 p-0 placeholder-gray-400"
          />
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {isPublic ? (
                <Globe className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 bg-gray-400 rounded-full" />
              )}
              <span className="font-medium text-gray-900">
                {isPublic ? 'Public Document' : 'Private Document'}
              </span>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Change to {isPublic ? 'Private' : 'Public'}
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing your document..."
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
}