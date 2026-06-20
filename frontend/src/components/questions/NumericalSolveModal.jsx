import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import MathText from '../MathText';
import api from '../../api';
import useAuthStore from '../../store/authStore';

const NumericalSolveModal = ({ questionId, isOpen, onClose, onStatusChange }) => {
  const [question, setQuestion] = useState(null);
  const [value, setValue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (isOpen && questionId) {
      fetchQuestion();
    }
  }, [isOpen, questionId]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/questions/${questionId}/solve`);
      setQuestion(res.data.data);
      setValue('');
      setHasSubmitted(false);
      setIsCorrect(null);
      setShowExplanation(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;
    
    try {
      const res = await api.post(`/api/questions/${questionId}/verify`, { numerical: value });
      const result = res.data.data;
      setIsCorrect(result.is_correct);
      setHasSubmitted(true);
      
      // Auto-mark progress
      if (token) {
        const status = result.is_correct ? 'done' : 'revisit';
        await api.post('/progress', { questionId, status });
        onStatusChange?.(questionId, status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Solve Numerical Question</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {question?.subject_name} → {question?.chapter_name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {loading ? (
            <div className="h-40 flex items-center justify-center text-[var(--text-muted)]">Loading...</div>
          ) : (
            <>
              {/* Question */}
              <MathText className="text-base leading-relaxed text-[var(--text-primary)]" text={question?.title} />

              {/* Numerical Input with optional Unit */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter numerical value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={hasSubmitted}
                  className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
                {question?.unit && (
                  <span className="text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-3 py-2.5 rounded-lg border border-[var(--border)]">
                    {question.unit}
                  </span>
                )}
              </div>

              {/* Submit */}
              {!hasSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  className="w-full py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium text-sm
                           hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all active:scale-[0.98]"
                >
                  Submit Answer
                </button>
              )}

              {/* Result */}
              {hasSubmitted && (
                <div className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? 'bg-[var(--success-bg)] border-[var(--success)]' 
                    : 'bg-[var(--danger-bg)] border-[var(--danger)]'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? <Check size={18} className="text-[var(--success)]" /> 
                               : <AlertCircle size={18} className="text-[var(--danger)]" />}
                    <span className={`font-semibold ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {isCorrect ? 'Correct!' : 'Wrong'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                      Correct answer: <span className="font-medium text-[var(--success)]">{question?.correct_answer} {question?.unit || ''}</span> (within ±{(question?.tolerance ? question.tolerance * 100 : 5)}% tolerance)
                    </p>
                  )}
                </div>
              )}

              {/* Explanation */}
              {hasSubmitted && (
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full flex items-center justify-between p-3 text-sm font-medium
                             text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <span>Explanation</span>
                    {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {showExplanation && (
                    <div className="p-4 border-t border-[var(--border)] space-y-3">
                      <MathText className="text-sm text-[var(--text-secondary)] whitespace-pre-line" text={question?.solution_text} />
                      {question?.common_mistake && (
                        <div className="p-3 bg-[var(--warning-bg)] border border-[var(--warning)] rounded-md">
                          <p className="text-xs font-medium text-[var(--warning)] mb-1">Common Mistake</p>
                          <p className="text-sm text-[var(--text-secondary)]">{question?.common_mistake}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default NumericalSolveModal;
