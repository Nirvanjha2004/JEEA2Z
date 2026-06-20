import React, { useState, useRef, useEffect } from 'react';
import ConceptTag from './ConceptTag';

export default function ConceptTagList({ concepts = [], onTagClick, limit = 2 }) {
  if (!concepts || concepts.length === 0) return null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleTags = concepts.slice(0, limit);
  const hiddenTags = concepts.slice(limit);

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
      {visibleTags.map((concept) => (
        <ConceptTag key={concept.id} concept={concept} onClick={onTagClick} />
      ))}
      
      {hiddenTags.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <span
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border border-border-default bg-bg-elevated/30 text-text-muted hover:text-text-secondary transition-all cursor-pointer select-none active:scale-95"
          >
            +{hiddenTags.length} more
          </span>

          {isOpen && (
            <div className="absolute left-0 bottom-full mb-1.5 z-50 min-w-[160px] max-w-[240px] p-2 rounded-lg border border-border-default bg-bg-surface/95 backdrop-blur-md shadow-lg flex flex-col gap-1.5">
              {hiddenTags.map((concept) => (
                <ConceptTag 
                  key={concept.id} 
                  concept={concept} 
                  onClick={(c) => {
                    setIsOpen(false);
                    if (onTagClick) onTagClick(c);
                  }}
                  className="w-full justify-start"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
