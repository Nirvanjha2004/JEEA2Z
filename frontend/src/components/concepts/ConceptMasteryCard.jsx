import React from 'react';
import { Link } from 'react-router-dom';

export default function ConceptMasteryCard({ concept, onPracticeClick }) {
  const accuracy = Math.round(concept.accuracy_percent || 0);
  const attempted = concept.questions_attempted || 0;
  const correct = concept.questions_correct || 0;

  // Determine progress color
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

  const conceptId = concept.concept_id || concept.id;

  return (
    <div className="p-4 rounded-xl border border-border-default bg-bg-surface/85 hover:bg-bg-surface transition-all flex flex-col justify-between group shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            to={`/concept/${conceptId}`}
            className="font-medium text-[13.5px] text-text-primary hover:text-accent transition-colors line-clamp-1"
          >
            {concept.name}
          </Link>
          <span className={`text-[12px] font-bold ${textColor}`}>
            {attempted > 0 ? `${accuracy}%` : '—'}
          </span>
        </div>

        <p className="text-[11px] text-text-muted mb-3 flex items-center gap-1">
          <span>{concept.subject_name || 'Physics'}</span>
          <span>•</span>
          <span className="line-clamp-1">{concept.chapter_name || 'Kinematics'}</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: attempted > 0 ? `${accuracy}%` : '0%' }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-text-secondary">
          <span>
            {attempted > 0 ? `${correct}/${attempted} Correct` : 'Unattempted'}
          </span>
          <span className="text-text-muted">
            {concept.last_attempted ? `Last: ${new Date(concept.last_attempted).toLocaleDateString()}` : 'Never'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border-default/40">
        <Link
          to={`/concept/${conceptId}`}
          className="flex-1 h-[28px] text-[11px] rounded-md border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-subtle inline-flex items-center justify-center font-medium transition-all"
        >
          Details
        </Link>
        {onPracticeClick && (
          <button
            onClick={() => onPracticeClick(concept)}
            className="flex-1 h-[28px] text-[11px] rounded-md bg-text-primary text-bg-app hover:opacity-90 font-semibold transition-all cursor-pointer active:scale-95"
          >
            Practice
          </button>
        )}
      </div>
    </div>
  );
}
