import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import DifficultyBadge from '../components/DifficultyBadge';
import TypeBadge from '../components/TypeBadge';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function AdminQuestionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');

  const [subjects, setSubjects] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [error, setError] = useState('');

  // Fetch initial filters data
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const subRes = await api.get('/api/subjects');
        setSubjects(subRes.data.data);

        const chRes = await api.get('/api/admin/chapters');
        setAllChapters(chRes.data.data);
      } catch (err) {
        console.error('Failed to load filter choices:', err);
      }
    };
    loadFiltersData();
  }, []);

  // Fetch questions when dependencies change
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 50,
        subjectId: subjectId || undefined,
        chapterId: chapterId || undefined,
        difficulty: difficulty || undefined,
        type: type || undefined,
        search: search || undefined,
      };

      const res = await api.get('/api/admin/questions', { params });
      setQuestions(res.data.data.questions);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, subjectId, chapterId, difficulty, type]);

  // Handle search with form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/api/admin/questions/${id}`);
      toast.success('Question deleted successfully.');
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete question.');
    }
  };

  // Filter chapters based on selected subject
  const filteredChapters = useMemo(() => {
    if (!subjectId) return [];
    return allChapters.filter((ch) => ch.subject_id === parseInt(subjectId, 10));
  }, [allChapters, subjectId]);

  const totalPages = Math.ceil(total / 50) || 1;

  return (
    <div className="space-y-6 text-text-primary select-none animate-slide-in">
      <div className="flex items-center justify-between border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-[17px] font-semibold text-text-primary uppercase tracking-wider">Manage Questions</h1>
          <p className="text-[12px] text-text-secondary mt-1">Total Questions: {total}</p>
        </div>
        <Button
          variant="primary"
          size="standard"
          onClick={() => navigate('/admin/questions/new')}
        >
          + Add Question
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12.5px] rounded-md flex items-start gap-2 animate-slide-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Form */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-bg-surface border border-border-default p-5 rounded-lg">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Search</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search title, source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow"
            />
            <Button
              type="submit"
              variant="secondary"
            >
              Go
            </Button>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setChapterId('');
              setPage(1);
            }}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter */}
        <div>
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Chapter</label>
          <select
            value={chapterId}
            onChange={(e) => {
              setChapterId(e.target.value);
              setPage(1);
            }}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition disabled:opacity-50"
            disabled={!subjectId}
          >
            <option value="">All Chapters</option>
            {filteredChapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
          >
            <option value="">All</option>
            <option value="pyq">PYQ</option>
            <option value="concept">Concept</option>
            <option value="practice">Practice</option>
          </select>
        </div>
      </form>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center py-16 bg-bg-surface rounded-lg border border-border-default/60">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-bg-surface border border-border-default/60 p-12 text-center rounded-lg text-text-muted text-xs">
          No questions match search filters.
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-default rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-bg-subtle/30 border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Subject / Chapter</th>
                  <th className="px-4 py-3 text-center w-28">Difficulty</th>
                  <th className="px-4 py-3 text-center w-28">Type</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-4 py-3.5 text-center font-mono text-text-muted">{q.id}</td>
                    <td className="px-4 py-3.5 font-medium text-text-primary max-w-sm truncate">{q.title}</td>
                    <td className="px-4 py-3.5">
                      <span className="block text-text-primary font-semibold">{q.subject_name}</span>
                      <span className="text-[10px] text-text-muted">{q.chapter_name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <TypeBadge type={q.type} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-text-muted">{q.source || '-'}</td>
                    <td className="px-4 py-3.5 text-right space-x-3.5">
                      <Link
                        to={`/admin/questions/${q.id}`}
                        className="text-accent hover:text-accent-hover hover:underline transition font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-text-muted hover:text-text-primary hover:underline transition font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-border-default/60 bg-bg-subtle/20 flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="compact"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="compact"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
