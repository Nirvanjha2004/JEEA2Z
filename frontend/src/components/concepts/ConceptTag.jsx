import React from 'react';

export default function ConceptTag({ concept, onClick, className = '' }) {
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(concept);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium border border-border-default bg-bg-elevated/50 text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-all cursor-pointer select-none active:scale-95 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
      {concept.name}
    </span>
  );
}
