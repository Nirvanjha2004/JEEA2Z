import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

export default function MockTestSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load initial scope parameters (from chapter page redirect)
  const initialScope = searchParams.get('scope') || 'full';
  const initialScopeId = searchParams.get('scopeId') ? parseInt(searchParams.get('scopeId'), 10) : '';

  const [title, setTitle] = useState('JEE Practice Test');
  const [scope, setScope] = useState(initialScope);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState(initialScopeId);

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [durationMin, setDurationMin] = useState(60);
  const [questionCount, setQuestionCount] = useState(25);

  const [difficulties, setDifficulties] = useState({ easy: true, medium: true, hard: true });
  const [types, setTypes] = useState({ pyq: true, concept: true, practice: true });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/api/subjects');
        setSubjects(res.data.data);

        // If prefilled by chapterId, find which subject it belongs to
        if (scope === 'chapter' && selectedChapterId) {
          // Let's resolve chapter details or subject details later.
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch chapters when subject slug changes
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubjectSlug) {
        setChapters([]);
        return;
      }
      try {
        const res = await api.get(`/api/subjects/${selectedSubjectSlug}/chapters`);
        setChapters(res.data.data);
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
      }
    };
    fetchChapters();
  }, [selectedSubjectSlug]);

  const handleSubjectChange = (e) => {
    const slug = e.target.value;
    setSelectedSubjectSlug(slug);
    const sub = subjects.find((s) => s.slug === slug);
    setSelectedSubjectId(sub ? sub.id : '');
    setSelectedChapterId('');
  };

  const handleDifficultyToggle = (diff) => {
    setDifficulties((prev) => ({ ...prev, [diff]: !prev[diff] }));
  };

  const handleTypeToggle = (t) => {
    setTypes((prev) => ({ ...prev, [t]: !prev[t] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check at least one difficulty is selected
    const activeDiffs = Object.keys(difficulties).filter((k) => difficulties[k]);
    if (activeDiffs.length === 0) {
      setError('Please select at least one difficulty option.');
      setLoading(false);
      return;
    }

    // Check at least one type is selected
    const activeTypes = Object.keys(types).filter((k) => types[k]);
    if (activeTypes.length === 0) {
      setError('Please select at least one question type.');
      setLoading(false);
      return;
    }

    let scopeId = null;
    if (scope === 'chapter') {
      if (!selectedChapterId) {
        setError('Please select a chapter.');
        setLoading(false);
        return;
      }
      scopeId = selectedChapterId;
    } else if (scope === 'subject') {
      if (!selectedSubjectId) {
        setError('Please select a subject.');
        setLoading(false);
        return;
      }
      scopeId = selectedSubjectId;
    }

    try {
      const res = await api.post('/api/tests/create', {
        title,
        scope,
        scopeId: scopeId ? parseInt(scopeId, 10) : null,
        durationMin: parseInt(durationMin, 10),
        questionCount: parseInt(questionCount, 10),
      });

      if (res.data.success) {
        navigate(`/mock-test/${res.data.data.testId}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate mock test. Ensure database has enough matching questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-navy-900 px-4 md:px-8 max-w-3xl mx-auto text-white">
      <div className="bg-navy-850 border border-navy-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h1 className="text-xl md:text-2xl font-extrabold mb-2">Create timed Mock Test</h1>
        <p className="text-sm text-navy-400 mb-6">Select your syllabus, duration, and question settings to begin.</p>

        {error && (
          <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Title */}
          <div>
            <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Test Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red text-white"
              required
            />
          </div>

          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Test Scope</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[
                { id: 'full', label: 'Full Syllabus' },
                { id: 'subject', label: 'Subject Wise' },
                { id: 'chapter', label: 'Chapter Wise' },
                { id: 'custom', label: 'Custom Picker' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setScope(s.id);
                    setError('');
                  }}
                  className={`py-3 px-2 text-xs font-bold rounded-xl border transition ${
                    scope === s.id
                      ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/10'
                      : 'bg-navy-900 border-navy-850 text-navy-400 hover:text-white hover:border-navy-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Subject Dropdown */}
            {(scope === 'subject' || scope === 'chapter') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-[10px] font-bold text-navy-500 uppercase mb-1">Select Subject</label>
                  <select
                    value={selectedSubjectSlug}
                    onChange={handleSubjectChange}
                    className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Dropdown */}
                {scope === 'chapter' && (
                  <div>
                    <label className="block text-[10px] font-bold text-navy-500 uppercase mb-1">Select Chapter</label>
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red text-white"
                      disabled={!selectedSubjectSlug}
                    >
                      <option value="">-- Choose Chapter --</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.order_index}. {ch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {scope === 'custom' && (
              <p className="text-xs text-navy-400 mt-2 bg-navy-900 p-3 rounded-lg border border-navy-800">
                💡 **Custom Pick Mode**: Navigate to a Chapter page and complete questions, or build tests from custom bookmarks list.
              </p>
            )}
          </div>

          {/* Duration & Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Duration</label>
              <div className="grid grid-cols-5 gap-1">
                {[30, 45, 60, 90, 180].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDurationMin(t)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      durationMin === t
                        ? 'bg-navy-700 border-navy-600 text-white shadow-sm'
                        : 'bg-navy-900 border-navy-800 text-navy-400 hover:text-white'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider">Total Questions</label>
                <span className="text-sm font-mono font-bold text-white">{questionCount} Qs</span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <div className="flex justify-between text-[10px] text-navy-500 font-mono mt-1">
                <span>10 Qs</span>
                <span>40 Qs</span>
                <span>75 Qs</span>
              </div>
            </div>
          </div>

          {/* Mix Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-navy-800">
            <div>
              <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Difficulty Mix</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDifficultyToggle(d)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition capitalize ${
                      difficulties[d]
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-navy-900 border-navy-800 text-navy-500'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Question Type</label>
              <div className="flex gap-2">
                {['pyq', 'concept', 'practice'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeToggle(t)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition uppercase ${
                      types[t]
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-navy-900 border-navy-800 text-navy-500'
                    }`}
                  >
                    {t === 'pyq' ? 'PYQs' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-red hover:bg-brand-red-hover active:scale-95 disabled:bg-navy-800 text-white text-sm font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating test...
                </>
              ) : (
                'Generate & Start Mock Test'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
