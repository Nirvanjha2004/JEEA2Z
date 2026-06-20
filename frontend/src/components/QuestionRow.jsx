import React, { useEffect, useState } from 'react';
import DifficultyBadge from './DifficultyBadge';
import TypeBadge from './TypeBadge';
import ConceptTagList from './concepts/ConceptTagList';
import useBookmarkStore from '../store/bookmarkStore';
import api from '../api';
import { Bookmark, Sparkles, Link as LinkIcon, FileText } from 'lucide-react';

export default function QuestionRow({ question, index, onStatusChange, onOpenNote, onOpenHint, onTagClick }) {
  const { id, title, difficulty, type, source, solution_url, status = 'todo' } = question;
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const [hasNote, setHasNote] = useState(false);

  // Synchronize note existence
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

  const handleCheckboxClick = () => {
    let nextStatus = 'todo';
    if (status === 'todo') nextStatus = 'done';
    else if (status === 'done') nextStatus = 'revisit';
    
    if (nextStatus === 'revisit') {
      api.post('/api/spaced/review', { questionId: id, quality: 1 }).catch(console.error);
    }
    onStatusChange(id, nextStatus);
  };

  const handleStatusClick = (targetStatus) => {
    if (targetStatus === 'revisit') {
      api.post('/api/spaced/review', { questionId: id, quality: 1 }).catch(console.error);
    }
    onStatusChange(id, targetStatus);
  };

  return (
    <tr className="border-b border-border-default/60 hover:bg-bg-subtle transition-colors group select-none">
      {/* Checkbox column */}
      <td className="px-3 py-3 w-12 text-center align-middle">
        <button
          onClick={handleCheckboxClick}
          className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
          title="Toggle status"
        >
          {status === 'done' ? (
            <div className="w-[15px] h-[15px] rounded-[3px] bg-accent border border-accent flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
          ) : status === 'revisit' ? (
            <div className="w-[15px] h-[15px] rounded-[3px] bg-warning/20 border border-warning flex items-center justify-center text-warning text-[10px] font-bold">
              ↻
            </div>
          ) : (
            <div className="w-[15px] h-[15px] rounded-[3px] border border-border-muted hover:border-accent flex items-center justify-center text-[10px] font-bold" />
          )}
        </button>
      </td>

      {/* Index Number */}
      <td className="px-3 py-3 w-10 font-mono text-[12px] text-text-muted text-center">
        {index}
      </td>

      {/* Question Details */}
      <td className="px-3 py-3 min-w-[240px]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className={`text-[13px] font-medium leading-relaxed break-words block mb-1 ${
              status === 'done' ? 'text-text-muted line-through decoration-text-disabled' : 'text-text-primary'
            }`}>
              {title}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {source && (
                <span className="inline-block px-1.5 py-0.5 bg-bg-subtle border border-border-default text-[10px] text-text-muted rounded font-mono font-medium">
                  {source}
                </span>
              )}
              {question.concepts && question.concepts.length > 0 && (
                <ConceptTagList concepts={question.concepts} onTagClick={onTagClick} />
              )}
            </div>
          </div>

          {/* Action links showing on row hover only */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-1 cursor-pointer transition-colors ${
                isBookmarked ? 'text-accent' : 'text-text-muted hover:text-accent'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Note button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenNote(id, title);
              }}
              className={`p-1 cursor-pointer transition-colors ${
                hasNote ? 'text-accent' : 'text-text-muted hover:text-accent'
              }`}
              title="Personal notes"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </td>

      {/* Difficulty */}
      <td className="px-3 py-3 w-24 text-center whitespace-nowrap align-middle">
        <DifficultyBadge difficulty={difficulty} />
      </td>

      {/* Type */}
      <td className="px-3 py-3 w-24 text-center whitespace-nowrap align-middle">
        <TypeBadge type={type} />
      </td>

      {/* Solution & Hint */}
      <td className="px-3 py-3 w-20 text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          {solution_url ? (
            <a
              href={solution_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors p-1"
              title="Watch Video Solution"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-text-disabled text-xs">-</span>
          )}

          {/* AI Hint Trigger */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onOpenHint(id, title);
            }}
            className="text-text-muted hover:text-amber-500 transition-colors p-1 cursor-pointer"
            title="Get AI Progressive Hints"
          >
            💡
          </button>
        </div>
      </td>

      {/* Status Picker */}
      <td className="px-3 py-3 w-[260px] text-right whitespace-nowrap align-middle">
        <div className="inline-flex rounded-md border border-border-default p-0.5 bg-bg-surface">
          <button
            onClick={() => handleStatusClick('todo')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded-[4px] cursor-pointer transition ${
              status === 'todo'
                ? 'bg-bg-elevated text-text-primary border border-border-default'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => handleStatusClick('revisit')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded-[4px] cursor-pointer transition ${
              status === 'revisit'
                ? 'bg-warning-bg text-warning border border-warning/20'
                : 'text-text-secondary hover:text-warning'
            }`}
          >
            Revisit
          </button>
          <button
            onClick={() => handleStatusClick('done')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded-[4px] cursor-pointer transition ${
              status === 'done'
                ? 'bg-success-bg text-success border border-success/20'
                : 'text-text-secondary hover:text-success'
            }`}
          >
            Done
          </button>
        </div>
      </td>
    </tr>
  );
}
