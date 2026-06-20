import React from 'react';

export default function ConceptFilterBar({ 
  concepts = [], 
  selectedConceptSlug = null, 
  onSelectConcept 
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-border-default/40">
      <button
        onClick={() => onSelectConcept(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap cursor-pointer ${
          !selectedConceptSlug
            ? 'bg-text-primary text-bg-app border-text-primary'
            : 'bg-bg-elevated/40 border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
        }`}
      >
        All Questions
      </button>

      {concepts.map((c) => {
        const isActive = selectedConceptSlug === c.slug;
        const total = c.question_count || 0;
        const solved = c.questions_correct || 0;

        return (
          <button
            key={c.id}
            onClick={() => onSelectConcept(isActive ? null : c.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-text-primary text-bg-app border-text-primary font-semibold shadow-xs'
                : 'bg-bg-elevated/40 border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
            }`}
          >
            <span>{c.name}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-colors ${
              isActive 
                ? 'bg-bg-app/20 text-bg-app' 
                : 'bg-bg-subtle text-text-muted'
            }`}>
              {solved}/{total}
            </span>
          </button>
        );
      })}
    </div>
  );
}
