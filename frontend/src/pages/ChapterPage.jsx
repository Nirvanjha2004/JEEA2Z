

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import QuestionRow from '../components/QuestionRow';
import ProgressBar from '../components/ProgressBar';
import NoteModal from '../components/NoteModal';

export default function ChapterPage() {
  const { subject: subjectSlug, chapterId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active filters
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const currentSubject = SUBJECTS.find((sub) => sub.slug === subjectSlug);

  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeNoteTitle, setActiveNoteTitle] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch questions in chapter + list of chapters to identify current chapter name
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch questions
        const questionsRes = await api.get(`/api/subjects/chapters/${chapterId}/questions`);
        setQuestions(questionsRes.data.data);

        // Fetch chapters to find the title of the current chapter
        const chaptersRes = await api.get(`/api/subjects/${subjectSlug}/chapters`);
        setChapters(chaptersRes.data.data);
      } catch (err) {
        setError('Failed to load chapter content. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectSlug, chapterId, refreshKey]);

  // Find current chapter details
  const currentChapter = useMemo(() => {
    return chapters.find((ch) => ch.id === parseInt(chapterId, 10));
  }, [chapters, chapterId]);

  // Optimistic status update handler
  const handleStatusChange = async (questionId, newStatus) => {
    // 1. Store previous state in case we need to roll back
    const previousQuestions = [...questions];

    // 2. Perform optimistic update on local state
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status: newStatus } : q))
    );

    try {
      // 3. Make API request
      const response = await api.post('/api/progress', {
        questionId,
        status: newStatus,
      });

      if (!response.data.success) {
        // Rollback if success flag is false
        setQuestions(previousQuestions);
      }
    } catch (err) {
      console.error('Failed to update progress on backend, rolling back state:', err);
      // Rollback on network/server error
      setQuestions(previousQuestions);
    }
  };

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchDifficulty =
        difficultyFilter === 'all' || q.difficulty.toLowerCase() === difficultyFilter;
      const matchType =
        typeFilter === 'all' || q.type.toLowerCase() === typeFilter;
      return matchDifficulty && matchType;
    });
  }, [questions, difficultyFilter, typeFilter]);

  // Compute stats for current questions set
  const doneCount = useMemo(() => {
    return questions.filter((q) => q.status === 'done').length;
  }, [questions]);

  const totalQuestionsCount = questions.length;

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-400 text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-navy-900 text-white">
      {/* Header Banner */}
      <div className="border-b border-navy-800 bg-navy-950/40 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Breadcrumb / Back button */}
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/sheet/${subjectSlug}`}
                className="text-xs text-navy-400 hover:text-brand-red font-medium transition flex items-center gap-1"
              >
                &larr; Back to {currentSubject?.name}
              </Link>
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <h1 className="text-xl md:text-2xl font-extrabold text-white truncate">
                {currentChapter ? `${currentChapter.order_index}. ${currentChapter.name}` : 'Chapter Details'}
              </h1>
              <Link
                to={`/mock-test?scope=chapter&scopeId=${chapterId}`}
                className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg transition shrink-0 shadow-lg shadow-brand-red/10"
              >
                ⏱️ Start Mock Test
              </Link>
            </div>
          </div>

          {/* Chapter Progress Stats */}
          <div className="bg-navy-800 border border-navy-700 p-4 rounded-xl md:min-w-[280px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Chapter Progress</span>
              <span className="text-xs font-mono text-white font-semibold">
                {doneCount}/{totalQuestionsCount} Completed
              </span>
            </div>
            <ProgressBar
              current={doneCount}
              total={totalQuestionsCount}
              color={currentSubject?.color || '#ef4444'}
              height="h-2"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {error && (
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/50 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-navy-850 border border-navy-800 p-4 rounded-xl">
          {/* Difficulty Filters */}
          <div>
            <span className="block text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">
              Filter by Difficulty
            </span>
            <div className="flex flex-wrap gap-2">
              {['all', 'easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                    difficultyFilter === diff
                      ? 'bg-navy-700 text-white border-navy-600'
                      : 'bg-navy-900/40 text-navy-400 border-navy-800 hover:text-white hover:border-navy-600'
                  }`}
                >
                  {diff.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div>
            <span className="block text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">
              Filter by Type
            </span>
            <div className="flex flex-wrap gap-2">
              {['all', 'pyq', 'concept', 'practice'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                    typeFilter === type
                      ? 'bg-navy-700 text-white border-navy-600'
                      : 'bg-navy-900/40 text-navy-400 border-navy-800 hover:text-white hover:border-navy-600'
                  }`}
                >
                  {type === 'pyq' ? 'PYQs' : type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List Section */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-navy-800 border border-navy-750 p-12 text-center rounded-xl text-navy-400 text-sm">
            No questions match the selected filters in this chapter.
          </div>
        ) : (
          <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-navy-900 border-b border-navy-700 text-xs font-bold text-navy-400 uppercase tracking-wider">
                    <th className="px-4 py-3 text-center w-12">Status</th>
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3 text-center w-28">Difficulty</th>
                    <th className="px-4 py-3 text-center w-28">Type</th>
                    <th className="px-4 py-3 text-center w-16">Solution</th>
                    <th className="px-4 py-3 text-right w-44">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/40">
                  {filteredQuestions.map((q, idx) => (
                    <QuestionRow
                      key={q.id}
                      question={q}
                      index={idx + 1}
                      onStatusChange={handleStatusChange}
                      onOpenNote={(id, title) => {
                        setActiveNoteId(id);
                        setActiveNoteTitle(title);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {activeNoteId && (
        <NoteModal
          questionId={activeNoteId}
          questionTitle={activeNoteTitle}
          onClose={() => {
            setActiveNoteId(null);
            setActiveNoteTitle('');
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
