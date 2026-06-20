import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConceptStore from '../../store/conceptStore';
import DifficultyBadge from '../DifficultyBadge';
import TypeBadge from '../TypeBadge';
import { Button } from '../ui/Button';

export default function ConceptPracticeModal({ concept, onClose }) {
  const navigate = useNavigate();
  const fetchConceptPracticeSet = useConceptStore((state) => state.fetchConceptPracticeSet);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const conceptId = concept.concept_id || concept.id;

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      const res = await fetchConceptPracticeSet(conceptId);
      if (active && res) {
        setData(res);
      }
      if (active) {
        setLoading(false);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [conceptId, fetchConceptPracticeSet]);

  const handleStart = () => {
    navigate(`/practice/${conceptId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-black/15 animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-md rounded-2xl border border-border-default bg-bg-surface/95 shadow-xl p-6 relative flex flex-col gap-4 overflow-hidden z-10">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-text-primary">
              Concept Practice
            </h3>
            <button 
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-sm p-1 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
          <h4 className="text-[13.5px] font-semibold text-accent mb-2">
            {concept.name}
          </h4>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Practice mode generates a focused session of 5 questions, prioritized to help you master this concept (Unsolved → Revisit → Done).
          </p>
        </div>

        <div className="border-y border-border-default/40 py-4 flex flex-col gap-3 min-h-[160px] justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs text-text-muted animate-pulse">
                Assembling practice questions...
              </span>
            </div>
          ) : !data || !data.questions || data.questions.length === 0 ? (
            <div className="text-center py-6 text-xs text-text-muted">
              No questions found for this concept.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {data.questions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className="p-2.5 rounded-lg border border-border-default bg-bg-elevated/40 flex items-start justify-between gap-3 text-[12px]"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-text-primary line-clamp-1">
                      {idx + 1}. {q.title}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">
                      Status: {q.status === 'todo' ? 'Unsolved' : q.status === 'revisit' ? 'Revisit' : 'Solved'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <DifficultyBadge difficulty={q.difficulty} />
                    <TypeBadge type={q.type} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStart} 
            disabled={loading || !data || !data.questions || data.questions.length === 0}
            className="flex-1 font-semibold"
          >
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
}
