import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTestStore from '../store/testStore';
import { Trophy, Clock, AlertTriangle, ArrowLeft, ArrowRight, Star } from 'lucide-react';

export default function MockTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const {
    currentTest,
    answers,
    markedForReview,
    fetchTest,
    setAnswer,
    toggleMark,
    submitTest,
    loading,
  } = useTestStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const startTimestamp = useRef(null);

  // Fetch test details on mount
  useEffect(() => {
    fetchTest(testId);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  // Set up timer once currentTest is loaded
  useEffect(() => {
    if (currentTest && currentTest.status === 'completed') {
      navigate(`/mock-test/${currentTest.id}/result`, { replace: true });
      return;
    }

    if (currentTest && currentTest.duration_min) {
      // Calculate initial time left
      const durationSeconds = currentTest.duration_min * 60;
      setTimeLeft(durationSeconds);
      startTimestamp.current = Date.now();

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTest]);

  const handleAutoSubmit = async () => {
    if (!currentTest) return;
    try {
      const elapsedSeconds = Math.round((Date.now() - startTimestamp.current) / 1000);
      await submitTest(elapsedSeconds);
      navigate(`/mock-test/${currentTest.id}/result`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualSubmit = async () => {
    setShowConfirm(false);
    if (!currentTest) return;
    try {
      const elapsedSeconds = Math.round((Date.now() - startTimestamp.current) / 1000);
      await submitTest(elapsedSeconds);
      navigate(`/mock-test/${currentTest.id}/result`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !currentTest) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-sm font-medium">Loading test session...</p>
        </div>
      </div>
    );
  }

  const questions = currentTest.questions || [];
  const currentQuestion = questions[activeIndex];

  // Helper to format time: MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getQuestionStatus = (qId, idx) => {
    let base = 'w-9 h-9 rounded-md flex items-center justify-center font-semibold text-xs transition cursor-pointer ';
    if (activeIndex === idx) {
      base += 'ring-1 ring-accent border-accent text-accent bg-accent/5 font-bold';
    } else if (markedForReview.has(qId)) {
      base += 'bg-warning/10 border border-warning/25 text-warning hover:border-warning';
    } else if (answers[qId] !== undefined && answers[qId] !== null && answers[qId] !== '') {
      base += 'bg-success/10 border border-success/25 text-success hover:border-success';
    } else {
      base += 'bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus';
    }
    return base;
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-primary flex flex-col font-sans antialiased select-none">
      {/* Top Test Header */}
      <header className="h-14 border-b border-border-default bg-bg-surface px-4 md:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-1.5 h-4.5 bg-accent rounded-[2px] shrink-0"></span>
          <h2 className="text-xs font-semibold truncate text-text-primary max-w-[180px] md:max-w-md">
            {currentTest.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div
            className={`font-mono text-xs font-semibold px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-all ${
              timeLeft < 300
                ? 'bg-danger-bg border-danger/30 text-danger animate-pulse font-bold'
                : 'bg-bg-elevated border-border-default text-text-primary'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Grid: Sidebar + Center Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Side: Question Grid Status */}
        <aside className="w-64 border-r border-border-default bg-bg-surface p-4 shrink-0 flex flex-col justify-between hidden md:flex">
          <div>
            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-4">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveIndex(idx)}
                  className={getQuestionStatus(q.id, idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Color Indicator Legend */}
          <div className="border-t border-border-default pt-4 space-y-2 text-[10px] text-text-secondary font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-success/20 border border-success/40 inline-block" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-warning/20 border border-warning/40 inline-block" />
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-bg-elevated border border-border-default inline-block" />
              <span>Not Answered</span>
            </div>
          </div>
        </aside>

        {/* Center Panel: Active Question Display */}
        <main className="flex-grow p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-bg-app">
          {currentQuestion ? (
            <div className="max-w-2xl mx-auto w-full space-y-6">
              {/* Question metadata */}
              <div className="flex items-center justify-between border-b border-border-default/60 pb-3">
                <span className="text-[11px] font-semibold bg-bg-elevated border border-border-default px-2.5 py-1 rounded-md text-text-secondary">
                  Question {activeIndex + 1} of {questions.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-accent/10 border border-accent/25 text-accent">
                    {currentQuestion.type}
                  </span>
                  {currentQuestion.source && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border-default text-text-muted">
                      {currentQuestion.source}
                    </span>
                  )}
                </div>
              </div>

              {/* Title / Description */}
              <div className="text-[14px] md:text-[15px] font-medium text-text-primary leading-relaxed break-words">
                {currentQuestion.title}
              </div>

              {/* Answers Input Area */}
              <div className="pt-4">
                <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Your Answer
                </h4>
                
                {/* 4 Option Buttons (Multiple Choice) or Numeric Input Field */}
                {currentQuestion.type === 'concept' || currentQuestion.difficulty === 'hard' || currentQuestion.type === 'pyq' ? (
                  // Multiple choice selection (A/B/C/D)
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const isSelected = answers[currentQuestion.id] === option;
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (isSelected) setAnswer(currentQuestion.id, null); // deselect
                            else setAnswer(currentQuestion.id, option);
                          }}
                          className={`w-full py-3.5 px-4 text-left text-xs font-medium rounded-md border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-accent/5 border-accent text-text-primary shadow-xs font-semibold'
                              : 'bg-bg-surface border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus'
                          }`}
                        >
                          <span>Option {option}</span>
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-accent border-accent text-white'
                                : 'border-border-default text-text-muted'
                            }`}
                          >
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // Numerical value entry
                  <div className="max-w-xs">
                    <input
                      type="text"
                      placeholder="Enter numeric value..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                      className="w-full bg-bg-surface border border-border-default rounded-md px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus font-mono transition"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-text-muted py-12">Question index error.</div>
          )}

          {/* Navigation Controls */}
          <div className="max-w-2xl mx-auto w-full mt-8 border-t border-border-default/60 pt-5 flex items-center justify-between gap-4">
            <button
              onClick={() => toggleMark(currentQuestion?.id)}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                markedForReview.has(currentQuestion?.id)
                  ? 'bg-warning/10 border-warning/30 text-warning font-semibold'
                  : 'bg-bg-surface border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${markedForReview.has(currentQuestion?.id) ? 'fill-current' : ''}`} />
              <span>{markedForReview.has(currentQuestion?.id) ? 'Marked' : 'Mark for Review'}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
                className="px-3.5 py-1.5 bg-bg-surface border border-border-default hover:border-border-focus text-text-primary text-xs font-semibold rounded-md disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setActiveIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={activeIndex === questions.length - 1}
                className="px-3.5 py-1.5 bg-bg-surface border border-border-default hover:border-border-focus text-text-primary text-xs font-semibold rounded-md disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 transition"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Confirm Submission Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border-default max-w-sm w-full rounded-lg p-5 shadow-lg text-center space-y-4 animate-slide-in">
            <div className="w-10 h-10 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center text-warning mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-text-primary">Submit Mock Test?</h3>
              <p className="text-[12px] text-text-secondary">
                Are you sure you want to end and submit your mock test? You have answered{' '}
                <strong className="text-text-primary">{Object.keys(answers).length}</strong> out of{' '}
                <strong className="text-text-primary">{questions.length}</strong> questions.
              </p>
            </div>
            <div className="flex gap-2 pt-2 border-t border-border-default/60">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-1.5 border border-border-default hover:bg-bg-subtle text-text-primary text-xs font-semibold rounded-md transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleManualSubmit}
                className="flex-1 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md transition cursor-pointer"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
