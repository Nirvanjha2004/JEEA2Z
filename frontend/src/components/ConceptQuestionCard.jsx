import React, { useEffect, useState } from 'react';
import DifficultyBadge from './DifficultyBadge';
import TypeBadge from './TypeBadge';
import useBookmarkStore from '../store/bookmarkStore';
import api from '../api';
import { Bookmark, Link as LinkIcon, FileText } from 'lucide-react';
import MathText from './MathText';
import QuestionSolveModal from './questions/QuestionSolveModal';
import FillBlankModal from './questions/FillBlankModal';
import NumericalSolveModal from './questions/NumericalSolveModal';

export default function ConceptQuestionCard({ question, index, onStatusChange, onOpenNote, onOpenHint, onTagClick }) {
  const { id, title, difficulty, type, source, solution_url, status = 'todo' } = question;
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const [hasNote, setHasNote] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openSolveModal = () => {
    setActiveModal(question.question_format || 'mcq');
  };

  const getFormatBadge = () => {
    const format = question.question_format || 'mcq';
    const formats = {
      mcq: { text: 'MCQ', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
      fill_blank: { text: 'Fill Blank', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
      numerical: { text: 'Numerical', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    };
    const f = formats[format] || formats.mcq;
    return (
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${f.color} select-none whitespace-nowrap`}>
        {f.text}
      </span>
    );
  };

  useEffect(() => {
    const checkNote = async () => {
      try {
        const res = await api.get(`/api/notes/${id}`);
        setHasNote(res.data.success && res.data.data !== null);
      } catch (err) {
        console.error(err);
      }
    };
    checkNote();
  }, [id, question]);

  const isBookmarked = bookmarks.has(id);

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    toggleBookmark(id);
  };

  const handleStatusClick = (targetStatus) => {
    if (targetStatus === 'revisit') {
      api.post('/api/spaced/review', { questionId: id, quality: 1 }).catch(console.error);
    }
    onStatusChange(id, targetStatus);
  };

  // Status indicator dot
  const statusDot = status === 'done'
    ? 'bg-success border-success'
    : status === 'revisit'
    ? 'bg-warning/30 border-warning'
    : 'bg-transparent border-border-muted';

  return (
    <>
      <div className={`group relative border border-border-default/60 rounded-xl bg-bg-surface hover:bg-bg-subtle/50 transition-all duration-150 overflow-hidden ${
        status === 'done' ? 'opacity-60' : ''
      }`}>
        {/* Top section: Index + Title */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start gap-3">
            {/* Status dot + Index */}
            <div className="flex items-center gap-2.5 pt-0.5 shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full border-2 ${statusDot} transition-colors`} />
              <span className="font-mono text-[12px] text-text-muted font-medium w-5 text-right">
                {index}
              </span>
            </div>

            {/* Title - full width, prominent */}
            <button
              onClick={openSolveModal}
              className={`flex-1 text-[13.5px] font-medium leading-relaxed text-left cursor-pointer hover:text-accent transition-colors ${
                status === 'done' ? 'text-text-muted line-through decoration-text-disabled' : 'text-text-primary'
              }`}
            >
              <MathText text={title} />
            </button>
          </div>
        </div>

        {/* Bottom section: Badges + Actions */}
        <div className="px-4 pb-3 flex items-center justify-between gap-3">
          {/* Left: Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={difficulty} />
            <TypeBadge type={type} />
            {getFormatBadge()}
            {source && (
              <span className="inline-block px-1.5 py-0.5 bg-bg-subtle border border-border-default text-[10px] text-text-muted rounded font-mono font-medium">
                {source}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Solution link */}
            {solution_url && (
              <a
                href={solution_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-text-muted hover:text-accent transition-colors rounded-md hover:bg-bg-elevated"
                title="Watch Video Solution"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </a>
            )}

            {/* AI Hint */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenHint(id, title);
              }}
              className="p-1.5 text-text-muted hover:text-amber-500 transition-colors rounded-md hover:bg-bg-elevated cursor-pointer"
              title="Get AI Progressive Hints"
            >
              💡
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-md hover:bg-bg-elevated transition-colors cursor-pointer ${
                isBookmarked ? 'text-accent' : 'text-text-muted hover:text-accent'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Note */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenNote(id, title);
              }}
              className={`p-1.5 rounded-md hover:bg-bg-elevated transition-colors cursor-pointer ${
                hasNote ? 'text-accent' : 'text-text-muted hover:text-accent'
              }`}
              title="Personal notes"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-border-default/50 mx-1" />

            {/* Status Picker */}
            <div className="inline-flex rounded-md border border-border-default p-0.5 bg-bg-app/50">
              <button
                onClick={() => handleStatusClick('todo')}
                className={`px-2 py-0.5 text-[10.5px] font-medium rounded-[4px] cursor-pointer transition ${
                  status === 'todo'
                    ? 'bg-bg-elevated text-text-primary border border-border-default'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusClick('revisit')}
                className={`px-2 py-0.5 text-[10.5px] font-medium rounded-[4px] cursor-pointer transition ${
                  status === 'revisit'
                    ? 'bg-warning-bg text-warning border border-warning/20'
                    : 'text-text-secondary hover:text-warning'
                }`}
              >
                Revisit
              </button>
              <button
                onClick={() => handleStatusClick('done')}
                className={`px-2 py-0.5 text-[10.5px] font-medium rounded-[4px] cursor-pointer transition ${
                  status === 'done'
                    ? 'bg-success-bg text-success border border-success/20'
                    : 'text-text-secondary hover:text-success'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeModal === 'mcq' && (
        <QuestionSolveModal
          questionId={id}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onStatusChange={onStatusChange}
        />
      )}
      {activeModal === 'fill_blank' && (
        <FillBlankModal
          questionId={id}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onStatusChange={onStatusChange}
        />
      )}
      {activeModal === 'numerical' && (
        <NumericalSolveModal
          questionId={id}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
}
