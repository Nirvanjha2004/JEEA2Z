import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { ChevronRight } from 'lucide-react';

export default function ChapterCard({ chapter, subjectSlug, color }) {
  const {
    id,
    name,
    order_index,
    question_count = 0,
    done_count = 0,
    easy_count = 0,
    medium_count = 0,
    hard_count = 0,
    has_formulas = false,
  } = chapter;

  const navigate = useNavigate();

  const percentage = question_count > 0 ? Math.round((done_count / question_count) * 100) : 0;
  const formattedOrder = String(order_index).padStart(2, '0');

  const handleCardClick = () => {
    navigate(`/sheet/${subjectSlug}/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-bg-surface border border-border-default rounded-lg p-5 hover:border-border-focus transition-all duration-200 cursor-pointer select-none flex flex-col gap-4"
    >
      {/* Top row: Order, Name and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-text-muted">
            #{formattedOrder}
          </span>
          <h4 className="text-[14.5px] font-semibold text-text-primary hover:text-accent transition-colors">
            {name}
          </h4>
        </div>
        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          {has_formulas && (
            <button
              onClick={() => navigate(`/sheet/${subjectSlug}/${id}?tab=formulas`)}
              className="text-[13px] hover:scale-105 transition-transform"
              title="Formula Sheet Available"
            >
              📐
            </button>
          )}
          <button
            onClick={handleCardClick}
            className="flex items-center gap-1.5 px-3 py-1 bg-bg-elevated border border-border-default hover:border-border-focus text-[11.5px] font-medium text-text-primary rounded-md transition cursor-pointer"
          >
            Open <ChevronRight className="w-3 h-3 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Middle row: Progress bar & metadata */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1.5 font-medium">
          <span>{done_count} / {question_count} done</span>
          <span>{percentage}%</span>
        </div>
        <ProgressBar current={done_count} total={question_count} color={color} height="h-1" />
      </div>

      {/* Bottom row: Difficulty count pills */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-success/15 bg-success-bg text-success font-medium">
          Easy: {easy_count}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-warning/15 bg-warning-bg text-warning font-medium">
          Medium: {medium_count}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-danger/15 bg-danger-bg text-danger font-medium">
          Hard: {hard_count}
        </span>
      </div>
    </div>
  );
}
