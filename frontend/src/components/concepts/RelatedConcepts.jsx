import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedConcepts({ concepts = [], className = '' }) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl border border-warning/20 bg-warning-bg/40 backdrop-blur-xs flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-warning font-semibold text-[13px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Concept Reinforcement Needed</span>
      </div>
      
      <p className="text-[12px] text-text-secondary leading-relaxed">
        Struggling with this question? You might want to review or practice the underlying concepts:
      </p>

      <div className="flex flex-wrap gap-2 mt-1">
        {concepts.map((concept) => (
          <Link
            key={concept.id}
            to={`/concept/${concept.id}`}
            className="px-2.5 py-1 rounded-lg border border-warning/20 bg-warning-bg/60 text-warning hover:bg-warning/10 text-[11px] font-medium transition-all"
          >
            {concept.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
