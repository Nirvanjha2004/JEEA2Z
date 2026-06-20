import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function NoteModal({ questionId, questionTitle, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const isInitialMount = useRef(true);

  // Load existing note
  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/notes/${questionId}`);
        if (res.data.success && res.data.data) {
          setContent(res.data.data.content);
          if (res.data.data.updated_at) {
            setLastSaved(new Date(res.data.data.updated_at).toLocaleTimeString());
          }
        } else {
          setContent('');
          setLastSaved(null);
        }
      } catch (err) {
        console.error('Failed to load note:', err);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      loadNote();
      isInitialMount.current = true;
    }
  }, [questionId]);

  // Debounced auto-save
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaving(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (content.trim() === '') {
          // If content is empty, delete note
          await api.delete(`/api/notes/${questionId}`);
          setLastSaved(null);
        } else {
          const res = await api.post('/api/notes', { questionId, content });
          if (res.data.success) {
            setLastSaved(new Date().toLocaleTimeString());
          }
        }
      } catch (err) {
        console.error('Failed to save note:', err);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [content, questionId]);

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-navy-950 border-l border-navy-800 shadow-2xl z-50 flex flex-col transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-900">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Notes</h3>
          <p className="text-[10px] text-navy-400 truncate max-w-[200px] md:max-w-[250px]">{questionTitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-navy-400 hover:text-white transition p-1"
          aria-label="Close notes"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Text Area */}
      <div className="flex-grow p-4 flex flex-col gap-2">
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your notes or shortcuts here. Saves automatically..."
            className="flex-grow w-full bg-navy-900 border border-navy-700 rounded-xl p-3 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-brand-red resize-none font-sans"
            maxLength={1000}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-navy-800 bg-navy-900/50 flex items-center justify-between text-xs text-navy-400">
        <div>
          {saving ? (
            <span className="flex items-center gap-1.5 text-brand-red">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-ping"></span>
              Saving...
            </span>
          ) : lastSaved ? (
            <span>Saved at {lastSaved}</span>
          ) : (
            <span>Auto-saves drafts</span>
          )}
        </div>
        <div className="font-mono text-[10px] text-navy-500">
          {content.length}/1000 chars
        </div>
      </div>
    </div>
  );
}
