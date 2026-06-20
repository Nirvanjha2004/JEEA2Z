import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import useConceptStore from '../store/conceptStore';
import { Button } from '../components/ui/Button';
import DifficultyBadge from '../components/DifficultyBadge';
import TypeBadge from '../components/TypeBadge';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function PracticeModePage() {
  const { conceptId } = useParams();
  const navigate = useNavigate();

  const fetchConceptPracticeSet = useConceptStore((state) => state.fetchConceptPracticeSet);

  const [concept, setConcept] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Practice state
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [history, setHistory] = useState([]); // Array of boolean results for the progress track

  useEffect(() => {
    let active = true;
    const loadSet = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchConceptPracticeSet(conceptId);
        if (active) {
          if (res) {
            setConcept(res.concept);
            setQuestions(res.questions || []);
          } else {
            setError('Failed to load practice questions.');
          }
        }
      } catch (err) {
        console.error(err);
        if (active) setError('Something went wrong.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadSet();
    return () => {
      active = false;
    };
  }, [conceptId, fetchConceptPracticeSet]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-bg-app">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-xs font-semibold">Generating practice session...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-bg-app">
        <p className="text-danger text-sm font-semibold mb-4">{error || 'No practice questions found for this concept.'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-border-default hover:bg-bg-subtle rounded-md text-xs font-semibold cursor-pointer text-text-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (!selectedAnswer.trim()) return;
    const correctAns = (currentQuestion.correct_answer || '').trim().toLowerCase();
    const userAns = selectedAnswer.trim().toLowerCase();
    const correct = userAns === correctAns;
    
    setIsCorrect(correct);
    setSubmitted(true);
    setHistory((prev) => [...prev, correct]);
  };

  const handleNext = async (status) => {
    // 1. Save progress to backend
    try {
      await api.post('/api/progress', {
        questionId: currentQuestion.id,
        status: status // 'done' or 'revisit'
      });
      // Spaced repetition review hook for revisit
      if (status === 'revisit') {
        api.post('/api/spaced/review', { questionId: currentQuestion.id, quality: 1 }).catch(console.error);
      }
    } catch (err) {
      console.error('Failed to update practice question progress:', err);
    }

    // 2. Move to next or complete
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setSubmitted(false);
    } else {
      // Practice session completed! Navigate back to concept detail page
      navigate(`/concept/${conceptId}`);
    }
  };

  const isMultipleChoice = currentQuestion.type === 'concept' || currentQuestion.difficulty === 'hard' || currentQuestion.type === 'pyq';

  return (
    <div className="min-h-screen bg-bg-app text-text-primary flex flex-col font-sans select-none items-center justify-center p-4">
      <div className="w-full max-w-xl bg-bg-surface border border-border-default rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border-default/50 pb-4 shrink-0">
          <div className="min-w-0">
            <span className="text-[9.5px] uppercase font-bold text-accent tracking-wider block mb-1">
              Interactive Practice Mode
            </span>
            <h2 className="text-[14px] font-bold text-text-primary truncate max-w-xs md:max-w-md">
              {concept?.name}
            </h2>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-text-muted hover:text-text-primary text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            Leave
          </button>
        </div>

        {/* Progress Tracker (Timeline nodes) */}
        <div className="flex items-center justify-between gap-2 bg-bg-subtle/40 border border-border-default/50 p-2.5 rounded-xl">
          <span className="text-[11px] font-medium text-text-secondary shrink-0">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => {
              const isActive = currentIndex === idx;
              const hasStatus = history[idx] !== undefined;
              const isStatusCorrect = history[idx] === true;

              return (
                <div 
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                    isActive 
                      ? 'ring-2 ring-accent bg-accent/20' 
                      : hasStatus
                        ? isStatusCorrect
                          ? 'bg-success'
                          : 'bg-danger'
                        : 'bg-bg-elevated border border-border-default'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Question Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={currentQuestion.difficulty} />
            <TypeBadge type={currentQuestion.type} />
            {currentQuestion.source && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-elevated border border-border-default text-text-muted">
                {currentQuestion.source}
              </span>
            )}
          </div>
          
          <h3 className="text-[14.5px] font-semibold text-text-primary leading-relaxed break-words">
            {currentQuestion.title}
          </h3>
        </div>

        {/* Answer Selector */}
        <div className="pt-2">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">
            Select Your Answer
          </h4>

          {submitted ? (
            // Immediate feedback card
            <div className={`p-4 rounded-xl border flex flex-col gap-3 animate-fade-in ${
              isCorrect 
                ? 'bg-success/5 border-success/20 text-success' 
                : 'bg-danger/5 border-danger/20 text-danger'
            }`}>
              <div className="flex items-center gap-2 font-bold text-[13.5px]">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Correct Answer! Excellent job.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>Incorrect. Review this question.</span>
                  </>
                )}
              </div>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                The correct answer is <strong className="text-text-primary font-bold">{(currentQuestion.correct_answer || '').toUpperCase()}</strong>.
                {currentQuestion.notes && (
                  <span className="block mt-2 italic text-text-muted">
                    Refresher note: {currentQuestion.notes}
                  </span>
                )}
              </p>

              {currentQuestion.solution_url && (
                <a
                  href={currentQuestion.solution_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit mt-1 px-3 py-1.5 bg-bg-surface border border-border-default text-text-secondary hover:text-text-primary font-semibold text-[11px] rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Watch Video Solution
                </a>
              )}
            </div>
          ) : isMultipleChoice ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {['A', 'B', 'C', 'D'].map((option) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`h-[42px] px-4 rounded-xl border text-left font-medium text-[13px] transition-all flex items-center justify-between cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-accent/5 border-accent text-accent shadow-xs font-semibold'
                        : 'bg-bg-elevated/40 border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                    }`}
                  >
                    <span>Option {option}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Enter numerical answer value (e.g. 5.2)"
                className="flex-1 h-[42px] px-4 rounded-xl border border-border-default bg-bg-elevated/20 text-[13px] focus:outline-none focus:border-border-focus text-text-primary"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border-default/40 pt-4 flex items-center justify-end gap-2 shrink-0">
          {!submitted ? (
            <Button
              variant="primary"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer.trim()}
              className="w-full sm:w-auto px-6 font-semibold"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="flex gap-2 w-full justify-between">
              <Button
                variant="secondary"
                onClick={() => handleNext('revisit')}
                className="flex-1 sm:flex-initial px-4 font-medium hover:border-warning hover:text-warning"
              >
                Mark Revisit & Next
              </Button>
              <Button
                variant="primary"
                onClick={() => handleNext('done')}
                className="flex-1 sm:flex-initial px-6 font-semibold"
              >
                Mark Done & Next
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
