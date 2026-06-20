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
    <div className="fixed inset-0 bg-black/45 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop click close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-bg-surface border border-border-default rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-slide-in text-text-primary z-10">
        {/* Header */}
        <div className="p-4 border-b border-border-default flex items-center justify-between bg-bg-elevated select-none">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Personal Notes</h3>
            <p className="text-[11px] text-text-muted truncate mt-0.5" title={questionTitle}>{questionTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition p-1.5 rounded-md hover:bg-bg-subtle cursor-pointer shrink-0"
            aria-label="Close notes"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Text Area */}
        <div className="p-5 flex flex-col gap-2 min-h-[260px] max-h-[50vh]">
          {loading ? (
            <div className="flex-grow flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your notes, shortcuts, or key equations here. Saves automatically..."
              className="flex-grow w-full h-48 bg-bg-subtle border border-border-default rounded-xl p-3.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none font-sans leading-relaxed"
              maxLength={1000}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-border-default bg-bg-subtle/50 flex items-center justify-between text-xs text-text-secondary select-none">
          <div>
            {saving ? (
              <span className="flex items-center gap-1.5 text-accent">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>
                Saving...
              </span>
            ) : lastSaved ? (
              <span>Saved at {lastSaved}</span>
            ) : (
              <span>Auto-saves drafts</span>
            )}
          </div>
          <div className="font-mono text-[10px] text-text-muted">
            {content.length}/1000 chars
          </div>
        </div>
      </div>
    </div>
  );
}
