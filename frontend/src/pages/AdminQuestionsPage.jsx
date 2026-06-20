import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import DifficultyBadge from '../components/DifficultyBadge';
import TypeBadge from '../components/TypeBadge';

export default function AdminQuestionsPage() {
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
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('Failed to delete question.');
    }
  };

  // Filter chapters based on selected subject
  const filteredChapters = useMemo(() => {
    if (!subjectId) return [];
    return allChapters.filter((ch) => ch.subject_id === parseInt(subjectId, 10));
  }, [allChapters, subjectId]);

  const totalPages = Math.ceil(total / 50) || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white uppercase tracking-wider">Manage Questions</h1>
          <p className="text-xs text-navy-400 mt-0.5">Total Questions: {total}</p>
        </div>
        <Link
          to="/admin/questions/new"
          className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg transition"
        >
          + Add Question
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Filters Form */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-navy-850 border border-navy-800 p-4 rounded-2xl">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Search</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search title, source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow bg-navy-900 border border-navy-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-brand-red"
            />
            <button
              type="submit"
              className="px-3 bg-navy-800 hover:bg-navy-750 text-white text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Go
            </button>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setChapterId('');
              setPage(1);
            }}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-red text-white"
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
          <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Chapter</label>
          <select
            value={chapterId}
            onChange={(e) => {
              setChapterId(e.target.value);
              setPage(1);
            }}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-red text-white"
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
          <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-red text-white"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-red text-white"
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
        <div className="flex justify-center py-12 bg-navy-850 rounded-2xl border border-navy-800">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-navy-850 border border-navy-800 p-12 text-center rounded-2xl text-navy-400 text-xs">
          No questions match search filters.
        </div>
      ) : (
        <div className="bg-navy-850 border border-navy-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-navy-900 border-b border-navy-800 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Subject / Chapter</th>
                  <th className="px-4 py-3 text-center w-28">Difficulty</th>
                  <th className="px-4 py-3 text-center w-28">Type</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/40 text-navy-300">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-navy-800/20 transition-colors">
                    <td className="px-4 py-3.5 text-center font-mono text-navy-500">{q.id}</td>
                    <td className="px-4 py-3.5 font-medium text-white max-w-sm truncate">{q.title}</td>
                    <td className="px-4 py-3.5">
                      <span className="block text-white font-bold">{q.subject_name}</span>
                      <span className="text-[10px] text-navy-400">{q.chapter_name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <TypeBadge type={q.type} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-navy-400">{q.source || '-'}</td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <Link
                        to={`/admin/questions/${q.id}`}
                        className="text-blue-400 hover:text-blue-300 hover:underline transition font-bold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-brand-red hover:text-red-400 hover:underline transition font-bold cursor-pointer"
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
          <div className="p-4 border-t border-navy-800 bg-navy-900/40 flex items-center justify-between text-xs text-navy-400">
            <span>
              Showing Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-navy-800 hover:bg-navy-750 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-navy-800 hover:bg-navy-750 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
