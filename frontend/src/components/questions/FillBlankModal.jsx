import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import BlankInput from './BlankInput';
import MathText from '../MathText';
import api from '../../api';
import useAuthStore from '../../store/authStore';

const FillBlankModal = ({ questionId, isOpen, onClose, onStatusChange }) => {
  const [question, setQuestion] = useState(null);
  const [blanks, setBlanks] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (isOpen && questionId) fetchQuestion();
  }, [isOpen, questionId]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/questions/${questionId}/solve`);
      setQuestion(res.data.data);
      setBlanks({});
      setHasSubmitted(false);
      setResults([]);
      setShowExplanation(false);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleBlankChange = (id, value) => {
    setBlanks(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const blankPositions = question.blank_positions || [];
    const answers = blankPositions.map((b, idx) => blanks[idx] || '');
    
    try {
      const res = await api.post(`/api/questions/${questionId}/verify`, { blanks: answers });
      const result = res.data.data;
      
      const newResults = answers.map((a, i) => {
        const userAns = a.toLowerCase().trim();
        const correct = blankPositions[i]?.answer || '';
        const alternatives = (blankPositions[i]?.alternatives || []).map(alt => alt.toLowerCase().trim());
        const isCorrect = userAns === correct.toLowerCase().trim() || alternatives.includes(userAns);
        return {
          user: a,
          correct: correct,
          isCorrect: isCorrect
        };
      });

      setResults(newResults);
      setHasSubmitted(true);

      if (token) {
        const status = result.is_correct ? 'done' : 'revisit';
        await api.post('/progress', { questionId, status });
        onStatusChange?.(questionId, status);
      }
    } catch (err) { console.error(err); }
  };

  const allFilled = () => {
    const positions = question?.blank_positions || [];
    return positions.every((_, idx) => blanks[idx]?.trim());
  };

  const renderQuestionWithBlanks = () => {
    if (!question) return null;
    const parts = question.title.split('___');
    return (
      <div className="text-[var(--text-primary)] text-base leading-relaxed inline flex-wrap items-center">
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <MathText text={part} />
            {idx < parts.length - 1 && (
              <BlankInput
                id={idx}
                value={blanks[idx] || ''}
                onChange={handleBlankChange}
                status={hasSubmitted ? (results[idx]?.isCorrect ? 'correct' : 'wrong') : null}
                correctValue={results[idx]?.correct}
                placeholder={`${idx + 1}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  const isAllCorrect = results.length > 0 && results.every(r => r.isCorrect);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Fill in the Blanks</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {question?.subject_name} → {question?.chapter_name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {loading ? (
            <div className="h-40 flex items-center justify-center text-[var(--text-muted)]">Loading...</div>
          ) : (
            <>
              {renderQuestionWithBlanks()}

              {!hasSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!allFilled()}
                  className="w-full py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium text-sm
                           hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all active:scale-[0.98]"
                >
                  Submit Answer
                </button>
              )}

              {hasSubmitted && (
                <div className={`p-4 rounded-lg border ${
                  isAllCorrect
                    ? 'bg-[var(--success-bg)] border-[var(--success)]'
                    : 'bg-[var(--danger-bg)] border-[var(--danger)]'
                }`}>
                  <div className="flex items-center gap-2">
                    {isAllCorrect 
                      ? <Check size={18} className="text-[var(--success)]" />
                      : <AlertCircle size={18} className="text-[var(--danger)]" />}
                    <span className={`font-semibold ${
                      isAllCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                    }`}>
                      {isAllCorrect ? 'All Correct!' : 'Some answers are incorrect'}
                    </span>
                  </div>
                </div>
              )}

              {hasSubmitted && (
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <button onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full flex items-center justify-between p-3 text-sm font-medium
                             text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]">
                    <span>Explanation</span>
                    {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {showExplanation && (
                    <div className="p-4 border-t border-[var(--border)] space-y-3">
                      <MathText className="text-sm text-[var(--text-secondary)] whitespace-pre-line" text={question?.solution_text} />
                      {question?.common_mistake && (
                        <div className="p-3 bg-[var(--warning-bg)] border border-[var(--warning)] rounded-md">
                          <p className="text-xs font-medium text-[var(--warning)] mb-1">Common Mistake</p>
                          <MathText className="text-sm text-[var(--text-secondary)]" text={question?.common_mistake} />
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

export default FillBlankModal;
