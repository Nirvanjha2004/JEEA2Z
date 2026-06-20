import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PatternGroupCard({ pattern, questions = [], onPractice }) {
  const navigate = useNavigate();
  
  // Categorize questions by type
  const pyqs = questions.filter((q) => q.type === 'pyq');
  const concepts = questions.filter((q) => q.type === 'concept');
  const practice = questions.filter((q) => q.type === 'practice');
  const advanced = questions.filter((q) => q.type === 'advanced');

  const total = questions.length;
  const doneCount = questions.filter((q) => q.status === 'done').length;
  const revisitCount = questions.filter((q) => q.status === 'revisit').length;

  const donePercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const typeRows = [
    { label: 'PYQs', questions: pyqs },
    { label: 'Concepts', questions: concepts },
    { label: 'Practice', questions: practice },
    { label: 'Advanced', questions: advanced },
  ];

  return (
    <div className="p-5 rounded-2xl border border-border-default bg-bg-surface/70 hover:bg-bg-surface transition-all flex flex-col justify-between gap-4 shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-bold text-[14.5px] text-text-primary tracking-tight">
            {pattern.name}
          </h4>
          <span className="text-[11px] font-mono font-semibold text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-md border border-border-default">
            {total} Qs
          </span>
        </div>
        
        <p className="text-[11px] text-text-muted mb-3.5 leading-relaxed">
          {pattern.description}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
            <span>Progress</span>
            <span>{doneCount}/{total} Done</span>
          </div>
          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${donePercent}%` }}
            />
          </div>
        </div>

        {/* Matrix grid */}
        <div className="flex flex-col gap-2.5 bg-bg-app/40 p-3 rounded-xl border border-border-default/60">
          {typeRows.map(({ label, questions: typeQ }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {typeQ.map((q, idx) => {
                  let statusColor = 'bg-bg-subtle border border-border-default/80';
                  if (q.status === 'done') {
                    statusColor = 'bg-success/80 border border-success/30';
                  } else if (q.status === 'revisit') {
                    statusColor = 'bg-warning/80 border border-warning/30';
                  }
                  
                  const cId = q.concepts?.[0]?.id || 1;

                  return (
                    <div
                      key={q.id}
                      onClick={() => navigate(`/concept/${cId}`)}
                      className={`w-3.5 h-3.5 rounded-[3px] cursor-pointer hover:scale-110 active:scale-95 transition-all ${statusColor}`}
                      title={`${idx + 1}. ${q.title} (${q.difficulty})`}
                    />
                  );
                })}
                {typeQ.length === 0 && (
                  <span className="text-[10px] text-text-muted italic select-none">None</span>
                )}
              </div>
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider shrink-0 select-none">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border-default/40 flex items-center gap-2">
        <button
          onClick={() => onPractice && onPractice(pattern.key)}
          disabled={doneCount === total}
          className="w-full h-[30px] text-[11px] rounded-lg bg-text-primary text-bg-app hover:opacity-90 disabled:opacity-50 font-bold transition-all cursor-pointer active:scale-98"
        >
          Practice Weak Patterns
        </button>
      </div>
    </div>
  );
}
