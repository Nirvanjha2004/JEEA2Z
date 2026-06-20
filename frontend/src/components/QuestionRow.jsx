import React, { useEffect, useState } from 'react';
import DifficultyBadge from './DifficultyBadge';
import TypeBadge from './TypeBadge';
import useBookmarkStore from '../store/bookmarkStore';
import api from '../api';

export default function QuestionRow({ question, index, onStatusChange, onOpenNote }) {
  const { id, title, difficulty, type, source, solution_url, status = 'todo' } = question;
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const [hasNote, setHasNote] = useState(false);

  // Synchronize note existence on mount/id change
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

  // Toggle status cycle on checkbox click: todo -> done -> revisit -> todo
  const handleCheckboxClick = () => {
    let nextStatus = 'todo';
    if (status === 'todo') nextStatus = 'done';
    else if (status === 'done') nextStatus = 'revisit';
    
    if (nextStatus === 'revisit') {
      // Silently POST to /api/spaced/review with quality=1
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
    <tr className="border-b border-navy-800 hover:bg-navy-850/30 transition-colors">
      {/* Status Checkbox / Icon Column */}
      <td className="px-4 py-4 text-center align-middle w-12">
        <button
          onClick={handleCheckboxClick}
          className="focus:outline-none transition-transform active:scale-95"
          title="Toggle status"
        >
          {status === 'done' ? (
            <div className="w-5 h-5 rounded border border-green-500 bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          ) : status === 'revisit' ? (
            <div className="w-5 h-5 rounded border border-amber-500 bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              ↻
            </div>
          ) : (
            <div className="w-5 h-5 rounded border border-navy-600 hover:border-brand-red flex items-center justify-center font-bold text-xs" />
          )}
        </button>
      </td>

      {/* Index Number */}
      <td className="px-4 py-4 font-mono text-sm text-navy-500 text-center w-12">
        {index}
      </td>

      {/* Question Title & Source */}
      <td className="px-4 py-4 min-w-[200px] max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">
            <div className="text-sm font-medium text-white break-words mb-1">
              {title}
            </div>
            {source && (
              <span className="inline-block px-1.5 py-0.5 bg-navy-900 border border-navy-800 text-[10px] text-navy-400 rounded font-medium">
                {source}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {/* Bookmark Toggle */}
            <button
              onClick={handleBookmarkToggle}
              className="text-navy-400 hover:text-amber-400 transition p-1"
              title="Bookmark Question"
            >
              {isBookmarked ? (
                <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>

            {/* Note Action */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenNote(id, title);
              }}
              className="text-navy-400 hover:text-brand-red transition p-1"
              title="Question Notes"
            >
              {hasNote ? (
                <svg className="w-4 h-4 text-brand-red fill-current" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </td>

      {/* Difficulty Badge */}
      <td className="px-4 py-4 text-center whitespace-nowrap">
        <DifficultyBadge difficulty={difficulty} />
      </td>

      {/* Type Badge */}
      <td className="px-4 py-4 text-center whitespace-nowrap">
        <TypeBadge type={type} />
      </td>

      {/* Solution Link */}
      <td className="px-4 py-4 text-center align-middle w-16">
        {solution_url ? (
          <a
            href={solution_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-400 hover:text-brand-red transition inline-flex p-1"
            title="Watch Solution"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : (
          <span className="text-navy-600 text-xs">-</span>
        )}
      </td>

      {/* Quick Mark Actions */}
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div className="inline-flex rounded-lg border border-navy-700 p-0.5 bg-navy-900">
          <button
            onClick={() => handleStatusClick('todo')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              status === 'todo'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-navy-400 hover:text-white'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => handleStatusClick('revisit')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              status === 'revisit'
                ? 'bg-amber-600/20 text-amber-400 shadow-sm border border-amber-500/20'
                : 'text-navy-400 hover:text-amber-400'
            }`}
          >
            Revisit
          </button>
          <button
            onClick={() => handleStatusClick('done')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              status === 'done'
                ? 'bg-green-600/20 text-green-400 shadow-sm border border-green-500/20'
                : 'text-navy-400 hover:text-green-400'
            }`}
          >
            Done
          </button>
        </div>
      </td>
    </tr>
  );
}
