import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';

export default function AdminQuestionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [subjects, setSubjects] = useState([]);
  const [allChapters, setAllChapters] = useState([]);

  // Form Fields
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [type, setType] = useState('concept');
  const [source, setSource] = useState('');
  const [solutionUrl, setSolutionUrl] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [notes, setNotes] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial subjects and chapters
  useEffect(() => {
    const loadData = async () => {
      try {
        setFetching(true);
        const subRes = await api.get('/api/subjects');
        setSubjects(subRes.data.data);

        const chRes = await api.get('/api/admin/chapters');
        setAllChapters(chRes.data.data);

        if (isEdit) {
          const qRes = await api.get(`/api/admin/questions/${id}`);
          const q = qRes.data.data;
          
          setTitle(q.title);
          setDifficulty(q.difficulty);
          setType(q.type);
          setSource(q.source || '');
          setSolutionUrl(q.solution_url || '');
          setCorrectAnswer(q.correct_answer || '');
          setNotes(q.notes || '');
          setOrderIndex(q.order_index);
          setChapterId(q.chapter_id);
          setSelectedSubjectId(q.subject_id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load form details.');
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const filteredChapters = useMemo(() => {
    if (!selectedSubjectId) return [];
    return allChapters.filter((ch) => ch.subject_id === parseInt(selectedSubjectId, 10));
  }, [allChapters, selectedSubjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!chapterId) {
      setError('Please select a chapter.');
      setLoading(false);
      return;
    }

    const payload = {
      chapter_id: parseInt(chapterId, 10),
      title,
      difficulty,
      type,
      source: source || null,
      solution_url: solutionUrl || null,
      correct_answer: correctAnswer || null,
      notes: notes || null,
      order_index: parseInt(orderIndex, 10),
    };

    try {
      if (isEdit) {
        await api.patch(`/api/admin/questions/${id}`, payload);
      } else {
        await api.post('/api/admin/questions', payload);
      }
      navigate('/admin/questions');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-navy-850 border border-navy-800 rounded-3xl p-6 md:p-8 shadow-xl text-white">
      <h2 className="text-base font-bold text-white uppercase tracking-wider mb-6">
        {isEdit ? 'Edit Question' : 'Create New Question'}
      </h2>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject & Chapter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setChapterId('');
              }}
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
              required
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Chapter</label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
              disabled={!selectedSubjectId}
              required
            >
              <option value="">-- Select Chapter --</option>
              {filteredChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title Textarea */}
        <div>
          <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Question Title / Prompt</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={4}
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white resize-none"
            placeholder="Type question markdown or description..."
            required
          />
        </div>

        {/* Difficulty & Type Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Question Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
            >
              <option value="pyq">PYQ</option>
              <option value="concept">Concept</option>
              <option value="practice">Practice</option>
            </select>
          </div>
        </div>

        {/* Source & Correct Answer Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Source / Exam</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. JEE Main 2023 Jan S1"
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Correct Answer</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="e.g. A, B, C, D or numerical string"
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white font-mono"
            />
          </div>
        </div>

        {/* Solution URL */}
        <div>
          <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Solution URL (Link / Video)</label>
          <input
            type="url"
            value={solutionUrl}
            onChange={(e) => setSolutionUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
          />
        </div>

        {/* Notes (Optional hint) */}
        <div>
          <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Notes / Hint (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white resize-none"
            placeholder="Shortcut tips or hints..."
          />
        </div>

        {/* Order Index */}
        <div className="max-w-xs">
          <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Order Index</label>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
            required
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/admin/questions"
            className="px-4 py-2 border border-navy-700 hover:border-white text-white text-xs font-bold rounded-lg transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg transition disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  );
}
