import React, { useEffect, useState, useMemo } from 'react';
import api from '../api';
import useBookmarkStore from '../store/bookmarkStore';
import QuestionRow from '../components/QuestionRow';
import { SUBJECTS } from '../utils/constants';

export default function BookmarksPage() {
  const { fetchBookmarks } = useBookmarkStore();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/bookmarks');
      setBookmarkedQuestions(res.data.data);
      // Synchronize the bookmark store Set
      await fetchBookmarks();
    } catch (err) {
      console.error(err);
      setError('Failed to load bookmarked questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Get unique chapters present in bookmarks
  const availableChapters = useMemo(() => {
    const chaptersMap = {};
    bookmarkedQuestions.forEach((q) => {
      if (q.chapter_id && q.chapter_name) {
        chaptersMap[q.chapter_id] = q.chapter_name;
      }
    });
    return Object.entries(chaptersMap).map(([id, name]) => ({ id: parseInt(id, 10), name }));
  }, [bookmarkedQuestions]);

  const handleStatusChange = async (questionId, newStatus) => {
    const previous = [...bookmarkedQuestions];
    setBookmarkedQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status: newStatus } : q))
    );
    try {
      await api.post('/api/progress', { questionId, status: newStatus });
    } catch (err) {
      console.error(err);
      setBookmarkedQuestions(previous);
    }
  };

  const filteredQuestions = useMemo(() => {
    return bookmarkedQuestions.filter((q) => {
      const matchSubject =
        selectedSubject === 'all' || q.subject_slug === selectedSubject;
      const matchChapter =
        selectedChapter === 'all' || q.chapter_id === parseInt(selectedChapter, 10);
      const matchDifficulty =
        selectedDifficulty === 'all' || q.difficulty.toLowerCase() === selectedDifficulty;
      return matchSubject && matchChapter && matchDifficulty;
    });
  }, [bookmarkedQuestions, selectedSubject, selectedChapter, selectedDifficulty]);

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-navy-900 text-white px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <span>🔖</span> Saved Questions ({filteredQuestions.length})
          </h1>
          <p className="text-sm text-navy-400 mt-1">Review your starred and bookmarked questions later.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-navy-850 border border-navy-800 p-4 rounded-2xl">
        <div>
          <label className="block text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter('all');
            }}
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-red text-white"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">Chapter</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-red text-white"
          >
            <option value="all">All Chapters</option>
            {availableChapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-red text-white"
          >
            <option value="all">All Difficulties</option>
            {['easy', 'medium', 'hard'].map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-navy-800 border border-navy-750 p-12 text-center rounded-2xl text-navy-400 text-sm">
          {bookmarkedQuestions.length === 0
            ? 'No bookmarks yet. Star a question to save it.'
            : 'No questions match the selected filters.'}
        </div>
      ) : (
        <div className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden">
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
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
