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
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-bg-surface border border-border-default hover:border-border-focus hover:bg-bg-subtle/20 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 shadow-xs"
              >
                {/* Left Info: ID, Title, Source */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="bg-bg-app border border-border-default/80 text-text-muted px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold shrink-0">
                    #{q.id}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-[13px] font-semibold text-text-primary truncate" title={q.title}>
                      {q.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-text-muted">
                      <span>Source:</span>
                      <span className="font-mono text-text-secondary font-medium">{q.source || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Info: Subject/Chapter and Badges */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="text-left md:text-right shrink-0">
                    <span className="block text-[11.5px] font-bold text-text-primary">{q.subject_name}</span>
                    <span className="text-[10px] text-text-muted">{q.chapter_name}</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <DifficultyBadge difficulty={q.difficulty} />
                    <TypeBadge type={q.type} />
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-end gap-2.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border-default/30">
                  <Button
                    variant="secondary"
                    size="compact"
                    onClick={() => navigate(`/admin/questions/${q.id}`)}
                    className="h-8 text-xs px-3 font-semibold border-border-default/60 hover:border-accent hover:text-accent"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="compact"
                    onClick={() => handleDelete(q.id)}
                    className="h-8 text-xs px-3 font-semibold hover:bg-danger-bg hover:text-danger border border-transparent hover:border-danger/25"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border border-border-default bg-bg-surface rounded-xl flex items-center justify-between text-xs text-text-muted shadow-xs">
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
