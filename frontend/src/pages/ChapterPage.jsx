import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import QuestionRow from '../components/QuestionRow';
import FormulaSheet from '../components/FormulaSheet';
import NoteModal from '../components/NoteModal';
import HintPanel from '../components/HintPanel';
import { SkeletonRow } from '../components/SkeletonRow';
import { BookOpen, Trophy, ArrowLeft, Layers } from 'lucide-react';

// V3 Concept Imports
import useConceptStore from '../store/conceptStore';
import ConceptFilterBar from '../components/concepts/ConceptFilterBar';
import ConceptCard from '../components/concepts/ConceptCard';
import ConceptPracticeModal from '../components/concepts/ConceptPracticeModal';
import PatternGroupCard from '../components/PatternGroupCard';
import PatternPracticeModal from '../components/PatternPracticeModal';
import { KINEMATICS_PATTERNS, PATTERN_SHORT_NAMES, classifyQuestion } from '../utils/patterns';

export default function ChapterPage() {
  const { subject: subjectSlug, chapterId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tab State
  const tabParam = searchParams.get('tab');
  const activeTab = ['formulas', 'concepts', 'patterns'].includes(tabParam) ? tabParam : 'questions';

  // Filters State
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const currentSubject = SUBJECTS.find((sub) => sub.slug === subjectSlug);

  // V3 Concept State & Store bindings
  const fetchChapterConcepts = useConceptStore((state) => state.fetchChapterConcepts);
  const chapterConcepts = useConceptStore((state) => state.chapterConcepts);
  const concepts = chapterConcepts[chapterId] || [];
  const [activePracticeConcept, setActivePracticeConcept] = useState(null);
  const [activePracticePattern, setActivePracticePattern] = useState(null);
  const [hintQuestionConcepts, setHintQuestionConcepts] = useState([]);

  // Notes & Hints Panels State
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeNoteTitle, setActiveNoteTitle] = useState('');
  const [hintQuestionId, setHintQuestionId] = useState(null);
  const [hintQuestionTitle, setHintQuestionTitle] = useState('');
  const [hintPanelOpen, setHintPanelOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch questions in chapter + list of chapters to identify current chapter name
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [questionsRes, chaptersRes] = await Promise.all([
          api.get(`/api/subjects/chapters/${chapterId}/questions`),
          api.get(`/api/subjects/${subjectSlug}/chapters`),
        ]);
        setQuestions(questionsRes.data.data || []);
        setChapters(chaptersRes.data.data || []);
      } catch (err) {
        setError('Failed to load chapter content. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectSlug, chapterId, refreshKey]);

  // Fetch concepts mapped to this chapter
  useEffect(() => {
    fetchChapterConcepts(chapterId);
  }, [chapterId, fetchChapterConcepts, refreshKey]);

  // Find current chapter details
  const currentChapter = useMemo(() => {
    return chapters.find((ch) => ch.id === parseInt(chapterId, 10));
  }, [chapters, chapterId]);

  useEffect(() => {
    if (currentChapter) {
      localStorage.setItem('jee-sheet-last-chapter-id', currentChapter.id);
      localStorage.setItem('jee-sheet-last-chapter-name', currentChapter.name);
    }
  }, [currentChapter]);

  // Optimistic status update handler
  const handleStatusChange = async (questionId, newStatus) => {
    const previousQuestions = [...questions];

    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status: newStatus } : q))
    );

    try {
      const response = await api.post('/api/progress', {
        questionId,
        status: newStatus,
      });

      if (!response.data.success) {
        setQuestions(previousQuestions);
      } else {
        // V3 Hook: trigger mastery refresh on progress update
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to update progress on backend, rolling back state:', err);
      setQuestions(previousQuestions);
    }
  };

  const selectedConceptSlug = searchParams.get('concept');
  const selectedPatternKey = searchParams.get('pattern');

  // Pre-calculate type-based pattern indices and labels for all questions in the chapter
  const questionsWithPatternLabels = useMemo(() => {
    const patternGroups = {};
    questions.forEach((q) => {
      const pKey = classifyQuestion(q);
      if (pKey) {
        if (!patternGroups[pKey]) patternGroups[pKey] = [];
        patternGroups[pKey].push(q);
      }
    });

    return questions.map((q) => {
      const pKey = classifyQuestion(q);
      if (!pKey) return { ...q, patternLabel: null, patternKey: null };

      const groupQs = patternGroups[pKey] || [];
      const typeQs = groupQs.filter((curr) => curr.type === q.type);
      const typeIdx = typeQs.findIndex((curr) => curr.id === q.id) + 1;

      const shortName = PATTERN_SHORT_NAMES[pKey] || pKey;
      let typeStr = 'Q';
      if (q.type === 'pyq') typeStr = 'PYQ';
      else if (q.type === 'concept') typeStr = 'Concept';
      else if (q.type === 'practice') typeStr = 'Practice';
      else if (q.type === 'advanced') typeStr = 'Advanced';

      return {
        ...q,
        patternKey: pKey,
        patternLabel: `${shortName} · ${typeStr} #${typeIdx}`
      };
    });
  }, [questions]);

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    return questionsWithPatternLabels.filter((q) => {
      const matchDifficulty =
        difficultyFilter === 'all' || q.difficulty.toLowerCase() === difficultyFilter;
      const matchType =
        typeFilter === 'all' || q.type.toLowerCase() === typeFilter;
      const matchStatus =
        statusFilter === 'all' || (q.status || 'todo') === statusFilter;
      const matchConcept =
        !selectedConceptSlug ||
        (q.concepts && q.concepts.some((c) => c.slug === selectedConceptSlug));
      const matchPattern =
        !selectedPatternKey || q.patternKey === selectedPatternKey;
      return matchDifficulty && matchType && matchStatus && matchConcept && matchPattern;
    });
  }, [questionsWithPatternLabels, difficultyFilter, typeFilter, statusFilter, selectedConceptSlug, selectedPatternKey]);

  const doneCount = useMemo(() => {
    return questions.filter((q) => q.status === 'done').length;
  }, [questions]);

  const totalQuestionsCount = questions.length;

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="min-h-screen text-text-primary select-none">
      {/* Chapter Page Header */}
      <div className="border-b border-border-default/60 pb-6 mb-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
          <Link to="/dashboard" className="hover:text-text-primary transition-colors">
            JEE Sheet
          </Link>
          <span>›</span>
          <Link to={`/sheet/${subjectSlug}`} className="hover:text-text-primary transition-colors">
            {currentSubject?.name}
          </Link>
          <span>›</span>
          <span className="text-text-secondary truncate">
            {currentChapter?.name || 'Chapter details'}
          </span>
        </div>

        {/* Title and Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] md:text-[22px] font-semibold text-text-primary tracking-tight">
              {currentChapter ? `${currentChapter.order_index}. ${currentChapter.name}` : 'Loading...'}
            </h1>
            <p className="text-[12px] text-text-muted mt-1">
              {totalQuestionsCount} questions total · {doneCount} completed · {totalQuestionsCount - doneCount} remaining
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleTabChange(activeTab === 'formulas' ? 'questions' : 'formulas')}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-default hover:bg-bg-subtle hover:border-border-focus rounded-md text-[12.5px] font-medium transition cursor-pointer"
            >
              <span>📐</span>
              {activeTab === 'formulas' ? 'Show Questions' : 'Formula Sheet'}
            </button>
            <Link
              to={`/mock-test?scope=chapter&scopeId=${chapterId}`}
              className="flex items-center justify-center gap-2 px-4.5 py-1.5 bg-white text-black font-semibold text-[12.5px] rounded-md hover:bg-neutral-200 transition cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              Start Chapter Test
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center border-b border-border-default/60 mb-6 font-medium text-[13px]">
        <button
          onClick={() => handleTabChange('questions')}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'border-accent text-text-primary font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Questions
        </button>
        <button
          onClick={() => handleTabChange('formulas')}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'formulas'
              ? 'border-accent text-text-primary font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Formula Sheet
        </button>
        <button
          onClick={() => handleTabChange('concepts')}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'concepts'
              ? 'border-accent text-text-primary font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Concepts
        </button>
        {String(chapterId) === '2' && (
          <button
            onClick={() => handleTabChange('patterns')}
            className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'patterns'
                ? 'border-accent text-text-primary font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Patterns
          </button>
        )}
      </div>

      {/* Render Active Tab Panel */}
      {activeTab === 'formulas' ? (
        <FormulaSheet chapterId={chapterId} chapterName={currentChapter?.name || ''} />
      ) : activeTab === 'patterns' ? (
        <div className="animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...KINEMATICS_PATTERNS]
              .map((p) => {
                const patternQs = questionsWithPatternLabels.filter((q) => q.patternKey === p.key);
                const doneCount = patternQs.filter((q) => q.status === 'done').length;
                const revisitCount = patternQs.filter((q) => q.status === 'revisit').length;
                const attempts = doneCount + revisitCount;
                const accuracy = attempts > 0 ? (doneCount / attempts) * 100 : 0;
                return {
                  pattern: p,
                  questions: patternQs,
                  accuracy,
                };
              })
              .sort((a, b) => a.accuracy - b.accuracy)
              .map(({ pattern, questions: patternQs }) => (
                <PatternGroupCard
                  key={pattern.key}
                  pattern={pattern}
                  questions={patternQs}
                  onPractice={(patternKey) => {
                    setActivePracticePattern({
                      key: patternKey,
                      name: pattern.name,
                      chapterId: chapterId,
                    });
                  }}
                />
              ))}
          </div>
        </div>
      ) : activeTab === 'concepts' ? (
        <div className="animate-slide-in">
          {concepts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-default rounded-xl bg-bg-surface/30">
              <Layers className="w-6 h-6 text-text-muted mb-3" />
              <p className="text-[13.5px] font-medium text-text-primary">No concepts configured</p>
              <p className="text-[11.5px] text-text-secondary mt-0.5">Concepts layer is currently active for Physics - Kinematics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  onFilterClick={(slug) => {
                    setSearchParams({ tab: 'questions', concept: slug });
                  }}
                  onPracticeClick={(c) => {
                    setActivePracticeConcept(c);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="animate-slide-in">
          {error && (
            <div className="p-3 border border-danger/25 bg-danger-bg text-danger text-[12.5px] rounded-lg mb-6">
              {error}
            </div>
          )}

          {concepts.length > 0 && (
            <ConceptFilterBar
              concepts={concepts}
              selectedConceptSlug={selectedConceptSlug}
              onSelectConcept={(slug) => {
                const params = { tab: 'questions' };
                if (slug) params.concept = slug;
                setSearchParams(params);
              }}
            />
          )}

          {selectedPatternKey && (
            <div className="flex items-center gap-2 p-3 border border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400 text-[12.5px] rounded-lg mb-6 font-medium">
              <span>Filtering by pattern: <strong>{PATTERN_SHORT_NAMES[selectedPatternKey] || selectedPatternKey}</strong></span>
              <button
                onClick={() => {
                  const params = { tab: 'questions' };
                  if (selectedConceptSlug) params.concept = selectedConceptSlug;
                  setSearchParams(params);
                }}
                className="ml-auto font-bold hover:underline cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border-default rounded-lg bg-bg-surface mb-6 text-[12px]">
            <div className="flex flex-wrap items-center gap-5">
              
              {/* Difficulty selector */}
              <div>
                <span className="block text-[9.5px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Difficulty
                </span>
                <div className="flex items-center gap-1 border border-border-default rounded-[4px] p-0.5 bg-bg-subtle/50">
                  {['all', 'easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-2 py-0.5 font-medium rounded-[3px] capitalize cursor-pointer transition ${
                        difficultyFilter === diff
                          ? 'bg-bg-elevated text-text-primary shadow-xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type selector */}
              <div>
                <span className="block text-[9.5px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Type
                </span>
                <div className="flex items-center gap-1 border border-border-default rounded-[4px] p-0.5 bg-bg-subtle/50">
                  {['all', 'pyq', 'concept', 'practice'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-2 py-0.5 font-medium rounded-[3px] uppercase cursor-pointer transition ${
                        typeFilter === type
                          ? 'bg-bg-elevated text-text-primary shadow-xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {type === 'pyq' ? 'PYQ' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status selector */}
              <div>
                <span className="block text-[9.5px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Status
                </span>
                <div className="flex items-center gap-1 border border-border-default rounded-[4px] p-0.5 bg-bg-subtle/50">
                  {['all', 'todo', 'revisit', 'done'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-2 py-0.5 font-medium rounded-[3px] capitalize cursor-pointer transition ${
                        statusFilter === status
                          ? 'bg-bg-elevated text-text-primary shadow-xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {status === 'todo' ? 'To Do' : status}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="text-[12.5px] text-text-secondary font-medium self-end py-1">
              Showing <span className="text-text-primary font-semibold">{filteredQuestions.length}</span> questions
            </div>
          </div>

          {/* Table list section */}
          {loading ? (
            <div className="border border-border-default rounded-lg overflow-hidden bg-bg-surface">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-border-default/50">
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </tbody>
              </table>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-default rounded-xl bg-bg-surface/30">
              <Layers className="w-6 h-6 text-text-muted mb-3" />
              <p className="text-[13.5px] font-medium text-text-primary">No questions matching filters</p>
              <p className="text-[11.5px] text-text-secondary mt-0.5">Try toggling different options or clearing the current selection.</p>
            </div>
          ) : (
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-bg-surface border-b border-border-default text-[10.5px] font-semibold text-text-muted uppercase tracking-wider">
                    <th className="px-3 py-2.5 text-center w-12">Status</th>
                    <th className="px-3 py-2.5 text-center w-10">#</th>
                    <th className="px-3 py-2.5">Title</th>
                    <th className="px-3 py-2.5 text-center w-24">Difficulty</th>
                    <th className="px-3 py-2.5 text-center w-24">Type</th>
                    <th className="px-3 py-2.5 text-center w-20">Solution</th>
                    <th className="px-3 py-2.5 text-right w-[260px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/50">
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
                      onOpenHint={(id, title) => {
                        const targetQuestion = questions.find((qn) => qn.id === id);
                        setHintQuestionConcepts(targetQuestion?.concepts || []);
                        setHintQuestionId(id);
                        setHintQuestionTitle(title);
                        setHintPanelOpen(true);
                      }}
                      onTagClick={(concept) => {
                        setSearchParams({ tab: 'questions', concept: concept.slug });
                      }}
                      onPatternClick={(patternKey) => {
                        setSearchParams({ tab: 'questions', pattern: patternKey });
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Note modal overlay */}
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

      {/* Hint drawer overlay */}
      {hintPanelOpen && (
        <HintPanel
          questionId={hintQuestionId}
          questionTitle={hintQuestionTitle}
          isOpen={hintPanelOpen}
          concepts={hintQuestionConcepts}
          onClose={() => {
            setHintPanelOpen(false);
            setHintQuestionId(null);
            setHintQuestionTitle('');
            setHintQuestionConcepts([]);
          }}
        />
      )}

      {/* Concept Practice Modal overlay */}
      {activePracticeConcept && (
        <ConceptPracticeModal
          concept={activePracticeConcept}
          onClose={() => setActivePracticeConcept(null)}
        />
      )}

      {/* Pattern Practice Modal overlay */}
      {activePracticePattern && (
        <PatternPracticeModal
          pattern={activePracticePattern}
          onClose={() => setActivePracticePattern(null)}
        />
      )}
    </div>
  );
}
