import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTestStore from '../store/testStore';

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
      // Calculate initial time left. If ongoing, check elapsed since creation or set base
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
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-400 text-sm">Loading test session...</p>
        </div>
      </div>
    );
  }

  const questions = currentTest.questions || [];
  const currentQuestion = questions[activeIndex];

  // Helper to format time: MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getQuestionStatus = (qId, idx) => {
    if (activeIndex === idx) return 'ring-2 ring-brand-red';
    if (markedForReview.has(qId)) return 'bg-amber-500 border border-amber-400';
    if (answers[qId] !== undefined) return 'bg-green-500 border border-green-400';
    return 'bg-navy-800 border border-navy-700';
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col font-sans antialiased select-none">
      {/* Top Test Header */}
      <div className="h-16 border-b border-navy-850 px-4 md:px-8 flex items-center justify-between bg-navy-900 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-6 bg-brand-red rounded-sm inline-block"></span>
          <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-sm">{currentTest.title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div
            className={`font-mono text-sm font-extrabold px-3 py-1.5 rounded-lg border transition ${
              timeLeft < 300
                ? 'bg-red-950/40 border-red-500/30 text-brand-red animate-pulse'
                : 'bg-navy-850 border-navy-700 text-white'
            }`}
          >
            ⏱️ {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-1.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg transition-all"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Center Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Side: Question Grid Status */}
        <div className="w-64 border-r border-navy-850 bg-navy-900/60 p-4 shrink-0 flex flex-col justify-between hidden md:flex">
          <div>
            <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-4">Question Navigator</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition cursor-pointer ${getQuestionStatus(
                    q.id,
                    idx
                  )}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Color Indicator Legend */}
          <div className="border-t border-navy-850 pt-4 space-y-2 text-[10px] text-navy-400 font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-green-500 inline-block" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-navy-800 border border-navy-700 inline-block" />
              <span>Not Answered</span>
            </div>
          </div>
        </div>

        {/* Center Panel: Active Question Display */}
        <div className="flex-grow p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {currentQuestion ? (
            <div className="max-w-2xl mx-auto w-full space-y-6">
              {/* Question metadata */}
              <div className="flex items-center justify-between border-b border-navy-850 pb-4">
                <span className="text-xs font-bold bg-navy-800 border border-navy-700 px-3 py-1 rounded-lg">
                  Question {activeIndex + 1} of {questions.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-red/10 border border-brand-red/20 text-brand-red">
                    {currentQuestion.type}
                  </span>
                  {currentQuestion.source && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 border border-navy-800 text-navy-400">
                      {currentQuestion.source}
                    </span>
                  )}
                </div>
              </div>

              {/* Title / Description */}
              <div className="text-base md:text-lg font-medium text-white leading-relaxed break-words">
                {currentQuestion.title}
              </div>

              {/* Answers Input Area */}
              <div className="pt-6">
                <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Your Answer</h4>
                
                {/* 4 Option Buttons (Multiple Choice) or Numeric Input Field */}
                {currentQuestion.type === 'concept' || currentQuestion.difficulty === 'hard' || currentQuestion.type === 'pyq' ? (
                  // Multiple choice selection (A/B/C/D)
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const isSelected = answers[currentQuestion.id] === option;
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (isSelected) setAnswer(currentQuestion.id, null); // deselect
                            else setAnswer(currentQuestion.id, option);
                          }}
                          className={`w-full py-4 px-5 text-left text-sm font-semibold rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/10'
                              : 'bg-navy-900 border-navy-800 text-navy-300 hover:text-white hover:border-navy-600'
                          }`}
                        >
                          <span>Option {option}</span>
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                              isSelected ? 'bg-white text-brand-red border-white' : 'border-navy-700'
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
                      placeholder="Enter numeric value"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                      className="w-full bg-navy-900 border border-navy-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red text-white font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-navy-400">Question index error.</div>
          )}

          {/* Navigation Controls */}
          <div className="max-w-2xl mx-auto w-full mt-8 border-t border-navy-850 pt-6 flex items-center justify-between gap-4">
            <button
              onClick={() => toggleMark(currentQuestion?.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                markedForReview.has(currentQuestion?.id)
                  ? 'bg-amber-600/10 border-amber-500/40 text-amber-400'
                  : 'bg-navy-900 border-navy-800 text-navy-400 hover:text-white'
              }`}
            >
              ⭐ {markedForReview.has(currentQuestion?.id) ? 'Marked for Review' : 'Mark for Review'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
                className="px-4 py-2.5 bg-navy-900 border border-navy-800 hover:border-navy-600 text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={activeIndex === questions.length - 1}
                className="px-4 py-2.5 bg-navy-900 border border-navy-800 hover:border-navy-600 text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submission Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-800 max-w-sm w-full rounded-2xl p-6 shadow-xl text-center space-y-4">
            <h3 className="text-base font-bold text-white">Submit Mock Test?</h3>
            <p className="text-xs text-navy-400">
              Are you sure you want to submit your mock test? You have answered{' '}
              <strong className="text-white">{Object.keys(answers).length}</strong> out of{' '}
              <strong className="text-white">{questions.length}</strong> questions.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 border border-navy-700 hover:border-white text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleManualSubmit}
                className="flex-1 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl transition cursor-pointer"
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
