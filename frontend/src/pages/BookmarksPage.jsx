import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import useBookmarkStore from '../store/bookmarkStore';
import QuestionRow from '../components/QuestionRow';
import { SUBJECTS } from '../utils/constants';
import EmptyState from '../components/ui/EmptyState';
import { Bookmark, AlertCircle } from 'lucide-react';

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
      setError('');
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
    <div className="max-w-4xl mx-auto space-y-6 text-text-primary select-none animate-slide-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
        <Link to="/dashboard" className="hover:text-text-primary transition-colors">
          JEE Sheet
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Bookmarks</span>
      </div>

      {/* Header */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-[20px] md:text-[22px] font-semibold text-text-primary flex items-center gap-2">
          <span>🔖</span> Saved Questions ({filteredQuestions.length})
        </h1>
        <p className="text-[12px] text-text-secondary mt-1">Review your starred and bookmarked questions later.</p>
      </div>

      {error && (
        <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12.5px] rounded-md flex items-start gap-2 animate-slide-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-surface border border-border-default p-4 rounded-lg">
        <div>
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter('all');
            }}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
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
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Chapter</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
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
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
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
        <div className="flex items-center justify-center py-16 bg-bg-surface border border-border-default/60 rounded-lg">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={bookmarkedQuestions.length === 0 ? 'No Saved Questions' : 'No matches found'}
          description={
            bookmarkedQuestions.length === 0
              ? 'Star questions on your study sheets to collect bookmarks here.'
              : 'No bookmarks matched the selected filters.'
          }
        />
      ) : (
        <div className="bg-bg-surface border border-border-default rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-bg-subtle/30 border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-4 py-3 text-center w-12">Status</th>
                  <th className="px-4 py-3 text-center w-12">#</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 text-center w-28">Difficulty</th>
                  <th className="px-4 py-3 text-center w-28">Type</th>
                  <th className="px-4 py-3 text-center w-16">Solution</th>
                  <th className="px-4 py-3 text-right w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary">
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
