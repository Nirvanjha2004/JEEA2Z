import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';
import useAuthStore from '../store/authStore';
import api from '../api';
import { X, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

const HintPanel = ({ questionId, questionTitle, isOpen, onClose }) => {
  const [hintText, setHintText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { user } = useAuthStore();
  const toast = useToast();

  useEffect(() => {
    const abortController = new AbortController();
    let isCancelled = false;

    const fetchHintStream = async () => {
      if (!isOpen || !questionId) return;

      setIsStreaming(true);
      setHintText('');
      setUpgradeRequired(false);
      setError(null);

      const token = localStorage.getItem('jee-sheet-token');
      const apiBase = import.meta.env.VITE_API_URL || '';

      try {
        const response = await fetch(`${apiBase}/api/hints/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: abortController.signal,
        });

        if (isCancelled) return;

        if (response.status === 403) {
          const errData = await response.json();
          if (isCancelled) return;
          if (errData.upgradeRequired) {
            setUpgradeRequired(true);
            setIsStreaming(false);
            return;
          }
        }

        if (!response.ok) {
          throw new Error('Failed to retrieve hint.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (isCancelled) {
            reader.cancel();
            break;
          }
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (isCancelled) break;
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                setIsStreaming(false);
                break;
              }

              try {
                const { text, error: streamErr } = JSON.parse(dataStr);
                if (isCancelled) break;
                if (streamErr) {
                  setError(streamErr);
                  setIsStreaming(false);
                  break;
                }
                if (text) {
                  setHintText((prev) => prev + text);
                }
              } catch (err) {
                // Ignore partial JSON parsing issues across chunks
              }
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError' || isCancelled) {
          return;
        }
        console.error('Hint streaming failed:', err);
        setError(err.message || 'Something went wrong.');
        setIsStreaming(false);
      }
    };

    fetchHintStream();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [isOpen, questionId, reloadKey]);

  const handleFreshHint = async () => {
    try {
      await api.delete(`/api/hints/${questionId}/cache`);
      toast.success('Hint cache cleared! Fetching fresh hint...');
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to clear hint cache:', err);
      toast.error('Failed to clear hint cache.');
    }
  };

  if (!isOpen) return null;

  // Format hint text with bold prefixes for progressive hints
  const renderFormattedHint = () => {
    if (!hintText) return null;
    return hintText.split('\n').map((line, idx) => {
      const match = line.match(/^(💡\s*Hint\s*\d+:)(.*)$/i);
      if (match) {
        return (
          <div key={idx} className="mb-4 leading-relaxed text-[13px]">
            <strong className="text-text-primary block font-medium mb-1">{match[1]}</strong>
            <span className="text-text-secondary">{match[2]}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="mb-3 leading-relaxed text-[13px] text-text-secondary">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose}></div>

      {/* Panel Body */}
      <div className="relative w-full max-w-[380px] bg-bg-surface border-l border-border-default h-full shadow-2xl flex flex-col animate-slide-in text-text-primary z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border-default shrink-0">
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary flex items-center gap-1.5">
              <span>💡</span> Hint System
            </h3>
            <p className="text-[11px] text-text-muted mt-1 max-w-[280px] truncate" title={questionTitle}>
              {questionTitle}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {user?.is_admin && (
              <button
                onClick={handleFreshHint}
                disabled={isStreaming}
                className="p-1.5 rounded-md hover:bg-bg-subtle text-text-muted hover:text-text-primary disabled:opacity-50 cursor-pointer shrink-0 transition-colors"
                title="Admin: Force fresh hint from Groq"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-bg-subtle text-text-muted hover:text-text-primary cursor-pointer shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-5">
          {upgradeRequired ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-accent-subtle border border-accent/20 flex items-center justify-center text-accent text-xl mb-4">
                ✦
              </div>
              <h4 className="text-[14.5px] font-medium text-text-primary mb-1.5">Daily limit reached</h4>
              <p className="text-[12.5px] text-text-secondary leading-relaxed mb-6 max-w-[240px]">
                You've used all 5 free hints today. Upgrade to Pro for unlimited hints.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full max-w-[200px] py-2 bg-white text-black font-semibold text-[13px] rounded-md hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Upgrade to Pro →
              </button>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-danger">
              <p className="text-[13px] font-medium mb-1">Failed to load hint</p>
              <p className="text-[11px] opacity-80">{error}</p>
              <button
                onClick={() => setReloadKey((prev) => prev + 1)}
                className="mt-4 px-3 py-1.5 border border-border-default rounded-md text-[12px] hover:bg-bg-subtle cursor-pointer text-text-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="relative">
              {renderFormattedHint()}
              {isStreaming && (
                <div className="flex items-center gap-1.5 text-text-muted text-[13px] mt-2">
                  <span className="w-1.5 h-3 bg-text-primary animate-pulse shrink-0"></span>
                  <span className="italic text-[11px] select-none">Streaming hint...</span>
                </div>
              )}
              {!isStreaming && !hintText && (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-[12px]">Requesting progressive clues...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-bg-subtle/40 shrink-0 text-center">
          <p className="text-[11px] font-medium text-text-secondary">
            {user?.is_admin ? 'Unlimited Clues — Admin Access' : 'Free tier: 5 hints / day'}
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            Clues nudge you closer to the formula without giving away the final solution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HintPanel;
