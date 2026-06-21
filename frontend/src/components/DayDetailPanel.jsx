import React from 'react';
import { X, Calendar, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import MathText from './MathText';

export default function DayDetailPanel({
  isOpen,
  onClose,
  date,
  solvesCount = 0,
  questions = [],
}) {
  if (!isOpen) return null;

  const formatDateHeader = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer Container */}
      <div
        className={`fixed z-50 bg-bg-surface border-border-default transition-transform duration-300 ease-out flex flex-col shadow-xl md:top-0 md:left-auto md:right-0 md:bottom-0 md:h-full md:w-96 md:border-l bottom-0 left-0 right-0 max-h-[80vh] md:max-h-full border-t rounded-t-xl md:rounded-t-none ${
          isOpen
            ? 'translate-x-0 translate-y-0'
            : 'translate-x-full md:translate-x-full translate-y-full md:translate-y-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border-default/60 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2 text-text-primary">
            <Calendar className="w-4.5 h-4.5 text-accent" />
            <span className="text-[14px] font-semibold">Activity Details</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-subtle cursor-pointer transition-colors"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-5 space-y-5">
          <div>
            <h3 className="text-[15px] font-semibold text-text-primary">
              {formatDateHeader(date)}
            </h3>
            <p className="text-[12px] text-text-secondary mt-1">
              {solvesCount} {solvesCount === 1 ? 'question' : 'questions'} solved on this day.
            </p>
          </div>

          {solvesCount > 0 ? (
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Solved Questions
              </h4>

              {questions.length === 0 ? (
                <div className="p-4 rounded-md border border-border-default bg-bg-subtle/20 flex flex-col gap-2 text-left">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />
                    <span className="text-[12px] text-text-secondary leading-relaxed">
                      Questions are logged, but details are only stored for the most recent 10 solve records.
                    </span>
                  </div>
                  <Link to="/dashboard">
                    <Button variant="secondary" size="compact" className="w-full text-xs mt-1" onClick={onClose}>
                      Go to study sheet
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {questions.map((q) => (
                    <div
                      key={q.question_id}
                      className="p-3 bg-bg-app border border-border-default/80 hover:border-border-focus rounded-md transition-colors flex items-center justify-between gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <MathText
                          className="text-[12.5px] font-medium text-text-primary block truncate max-w-[200px]"
                          text={q.title}
                        />
                        <span className="text-[10px] text-text-muted mt-0.5 block truncate">
                          {q.subject_name} · {q.chapter_name}
                        </span>
                      </div>
                      <span className="w-4 h-4 rounded-[3px] bg-success border border-success flex items-center justify-center text-white text-[9px] font-bold shrink-0 select-none">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-10 h-10 text-text-muted mb-3 stroke-[1.5]" />
              <h5 className="text-[13.5px] font-semibold text-text-primary">No Questions Solved</h5>
              <p className="text-[12px] text-text-secondary max-w-[200px] mt-1 leading-relaxed">
                Take this opportunity to jump back into your sheet and complete a topic.
              </p>
              <Button variant="primary" className="mt-4 px-4 py-1.5" onClick={onClose}>
                Start Solving
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
