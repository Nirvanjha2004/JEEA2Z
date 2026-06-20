import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function SpacedRevisionPage() {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState(null);

  // Fetch today's spaced queue
  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/spaced/queue');
      setQueue(res.data.data);
      setCurrentIndex(0);
      setReviewedCount(0);
      setRevealed(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load revision queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const currentQuestion = queue[currentIndex];

  // Load notes for current question when index changes
  useEffect(() => {
    const fetchQuestionNotes = async () => {
      if (!currentQuestion) return;
      try {
        const res = await api.get(`/api/notes/${currentQuestion.id}`);
        setNotes(res.data.data?.content || null);
      } catch (err) {
        console.error('Failed to load notes for revision card:', err);
      }
    };
    fetchQuestionNotes();
  }, [currentQuestion]);

  const handleRate = async (quality) => {
    if (!currentQuestion) return;

    try {
      await api.post('/api/spaced/review', {
        questionId: currentQuestion.id,
        quality,
      });

      // Move to next card
      setReviewedCount((prev) => prev + 1);
      setRevealed(false);
      setNotes(null);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to submit revision quality:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-bg-app flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-sm">Loading revision cards...</p>
        </div>
      </div>
    );
  }

  const queueEmpty = currentIndex >= queue.length;
  const totalCount = queue.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-bg-app text-text-primary px-4 md:px-8 max-w-2xl mx-auto flex flex-col justify-start">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <span>🔄</span> Spaced Revision
          </h1>
          <p className="text-sm text-text-secondary mt-1">SM-2 Spaced Repetition Queue</p>
        </div>
        {!queueEmpty && (
          <span className="text-xs font-mono font-semibold bg-bg-surface border border-border-default px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {totalCount} Due
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-danger-bg border border-danger/55 text-danger text-sm rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Queue Progress Bar */}
      {!queueEmpty && (
        <div className="w-full h-1 bg-bg-surface rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(reviewedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {queueEmpty ? (
        <div className="bg-bg-surface border border-border-default p-8 text-center rounded-3xl shadow-sm flex flex-col items-center justify-center py-16">
          <span className="text-4xl mb-4">🎉</span>
          <h2 className="text-lg font-bold text-text-primary mb-2">All caught up for today!</h2>
          <p className="text-sm text-text-secondary mb-6 max-w-sm">
            Your spaced repetition queue is clear. Return tomorrow for your next custom revision queue.
          </p>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition shadow-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-default rounded-3xl p-6 md:p-8 shadow-sm flex flex-col min-h-[380px] justify-between relative overflow-hidden group">
          {/* Card Front */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent uppercase">
                {currentQuestion.subject_name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-bg-subtle text-text-secondary truncate max-w-[200px]">
                {currentQuestion.chapter_name}
              </span>
              {currentQuestion.source && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-app border border-border-default text-text-secondary">
                  {currentQuestion.source}
                </span>
              )}
            </div>

            <h2 className="text-base md:text-lg font-bold text-text-primary leading-relaxed break-words">
              {currentQuestion.title}
            </h2>

            {/* Answer & solution section (revealed) */}
            {revealed && (
              <div className="mt-6 pt-6 border-t border-border-default space-y-4 animate-fade-in">
                {currentQuestion.correct_answer && (
                  <div>
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Correct Answer</h4>
                    <span className="inline-flex px-3 py-1 bg-success-bg border border-success/20 text-success rounded-lg text-sm font-extrabold font-mono">
                      {currentQuestion.correct_answer}
                    </span>
                  </div>
                )}

                {currentQuestion.solution_url && (
                  <div>
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Video Explanation</h4>
                    <a
                      href={currentQuestion.solution_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline inline-flex items-center gap-1"
                    >
                      Watch Solution Link &rarr;
                    </a>
                  </div>
                )}

                {notes && (
                  <div className="bg-bg-app border border-border-default rounded-xl p-3.5">
                    <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">My Personal Notes</h4>
                    <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">{notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-8">
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-3.5 bg-bg-surface hover:bg-bg-subtle border border-border-default hover:border-accent text-text-primary text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Reveal Answer & Rate Card
              </button>
            ) : (
              <div>
                <p className="text-[10px] font-bold text-text-muted text-center uppercase tracking-wider mb-3">How did you do?</p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRate(0)}
                    className="py-3 bg-danger-bg border border-danger/20 hover:border-danger hover:bg-danger/10 text-danger text-xs font-bold rounded-xl flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <span className="text-lg mb-1">😵</span>
                    <span>Forgot</span>
                  </button>
                  <button
                    onClick={() => handleRate(1)}
                    className="py-3 bg-warning-bg border border-warning/20 hover:border-warning hover:bg-warning/10 text-warning text-xs font-bold rounded-xl flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <span className="text-lg mb-1">😓</span>
                    <span>Hard</span>
                  </button>
                  <button
                    onClick={() => handleRate(3)}
                    className="py-3 bg-info-bg border border-info/20 hover:border-info hover:bg-info/10 text-info text-xs font-bold rounded-xl flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <span className="text-lg mb-1">🙂</span>
                    <span>Good</span>
                  </button>
                  <button
                    onClick={() => handleRate(5)}
                    className="py-3 bg-success-bg border border-success/20 hover:border-success hover:bg-success/10 text-success text-xs font-bold rounded-xl flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <span className="text-lg mb-1">😄</span>
                    <span>Easy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
