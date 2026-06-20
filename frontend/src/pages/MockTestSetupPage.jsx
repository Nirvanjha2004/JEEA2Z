import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import { Sliders, Trophy, BookOpen, Clock, AlertCircle } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto text-text-primary select-none animate-slide-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
        <Link to="/dashboard" className="hover:text-text-primary transition-colors">
          JEE Sheet
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Mock Tests</span>
        <span>›</span>
        <span className="text-text-secondary">Setup</span>
      </div>

      <div className="bg-bg-surface border border-border-default rounded-lg p-6 md:p-8 shadow-xs">
        <div className="mb-6">
          <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-text-primary">
            Create timed Mock Test
          </h1>
          <p className="text-[12px] text-text-secondary mt-1">
            Select your syllabus, duration, and question settings to begin.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12px] rounded-md mb-6 flex items-start gap-2 animate-slide-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Title */}
          <div>
            <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Test Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted transition"
              required
              placeholder="e.g. JEE Practice Test"
            />
          </div>

          {/* Scope Selector */}
          <div>
            <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Test Scope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
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
                  className={`py-2 px-3 text-[11.5px] font-medium rounded-md border cursor-pointer transition-all ${
                    scope === s.id
                      ? 'bg-accent text-white border-accent shadow-xs font-semibold'
                      : 'bg-bg-elevated border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Subject Dropdown */}
            {(scope === 'subject' || scope === 'chapter') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 animate-slide-in">
                <div>
                  <label className="text-[10px] font-medium text-text-muted uppercase mb-1 block">
                    Select Subject
                  </label>
                  <select
                    value={selectedSubjectSlug}
                    onChange={handleSubjectChange}
                    className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-2 text-xs text-text-primary transition"
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
                    <label className="text-[10px] font-medium text-text-muted uppercase mb-1 block">
                      Select Chapter
                    </label>
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-2 text-xs text-text-primary transition disabled:opacity-50"
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
              <div className="text-[11px] text-text-secondary mt-2.5 bg-bg-elevated p-3 rounded-md border border-border-default flex items-start gap-2 animate-slide-in">
                <span>💡</span>
                <span>
                  <strong>Custom Pick Mode:</strong> Navigate to a Subject or Chapter page to add questions to your solve sheet, or assemble custom tests from your saved bookmarks.
                </span>
              </div>
            )}
          </div>

          {/* Duration & Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                Duration
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[30, 45, 60, 90, 180].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDurationMin(t)}
                    className={`py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-all ${
                      durationMin === t
                        ? 'bg-accent text-white border-accent shadow-xs font-semibold'
                        : 'bg-bg-elevated border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  Total Questions
                </label>
                <span className="text-[11.5px] font-semibold text-text-primary font-mono bg-bg-elevated px-2 py-0.5 rounded border border-border-default">
                  {questionCount} Qs
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full h-1 bg-border-focus rounded-lg appearance-none cursor-pointer accent-accent transition-colors"
              />
              <div className="flex justify-between text-[9px] text-text-muted font-mono mt-1 px-0.5">
                <span>10 Qs</span>
                <span>40 Qs</span>
                <span>75 Qs</span>
              </div>
            </div>
          </div>

          {/* Mix Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border-default/60">
            <div>
              <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                Difficulty Mix
              </label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDifficultyToggle(d)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-all capitalize ${
                      difficulties[d]
                        ? 'bg-bg-elevated text-text-primary border-border-focus font-semibold'
                        : 'bg-bg-app border-border-default text-text-disabled'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                Question Type
              </label>
              <div className="flex gap-2">
                {['pyq', 'concept', 'practice'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeToggle(t)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-all uppercase ${
                      types[t]
                        ? 'bg-bg-elevated text-text-primary border-border-focus font-semibold'
                        : 'bg-bg-app border-border-default text-text-disabled'
                    }`}
                  >
                    {t === 'pyq' ? 'PYQs' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-border-default/40">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-text-primary text-bg-app hover:opacity-90 active:scale-[0.99] disabled:bg-bg-elevated disabled:text-text-muted text-xs font-semibold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-border-default"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-bg-app border-t-transparent rounded-full animate-spin"></div>
                  Generating test...
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5" />
                  Generate & Start Mock Test
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
