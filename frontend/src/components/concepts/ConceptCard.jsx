import React from 'react';
import { Link } from 'react-router-dom';

export default function ConceptCard({ concept, onPracticeClick, onFilterClick }) {
  const accuracy = Math.round(concept.accuracy_percent || 0);
  const attempted = concept.questions_attempted || 0;
  const correct = concept.questions_correct || 0;
  const total = concept.question_count || 0;

  // Progress colors
  let barColor = 'bg-danger';
  let textColor = 'text-danger';
  if (attempted === 0) {
    barColor = 'bg-text-disabled';
    textColor = 'text-text-muted';
  } else if (accuracy >= 80) {
    barColor = 'bg-success';
    textColor = 'text-success';
  } else if (accuracy >= 50) {
    barColor = 'bg-warning';
    textColor = 'text-warning';
  }

  return (
    <div className="p-5 rounded-2xl border border-border-default bg-bg-surface/60 hover:bg-bg-surface/95 transition-all flex flex-col justify-between gap-4 shadow-xs">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/concept/${concept.id}`}
            className="font-bold text-[15px] text-text-primary hover:text-accent transition-colors"
          >
            {concept.name}
          </Link>
          {attempted > 0 && (
            <span className={`text-[11.5px] font-bold ${textColor}`}>
              {accuracy}% Mastery
            </span>
          )}
        </div>

        {concept.description && (
          <p className="text-[12px] text-text-secondary leading-relaxed">
            {concept.description}
          </p>
        )}

        {/* Mini progress representation */}
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>Solved: {correct}/{total}</span>
            {attempted > 0 && (
              <span>Accuracy: {correct}/{attempted} ({accuracy}%)</span>
            )}
          </div>
          <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${total > 0 ? (correct / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border-default/30">
        <button
          onClick={() => onFilterClick && onFilterClick(concept.slug)}
          className="flex-1 h-[30px] text-[11.5px] rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-subtle font-medium transition-all cursor-pointer active:scale-95"
        >
          View Questions
        </button>
        {onPracticeClick && (
          <button
            onClick={() => onPracticeClick(concept)}
            className="flex-1 h-[30px] text-[11.5px] rounded-lg bg-text-primary text-bg-app hover:opacity-90 font-semibold transition-all cursor-pointer active:scale-95"
          >
            Practice
          </button>
        )}
      </div>
    </div>
  );
}
