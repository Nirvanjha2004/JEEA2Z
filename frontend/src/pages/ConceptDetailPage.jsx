import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import ConceptQuestionCard from '../components/ConceptQuestionCard';
import FormulaCard from '../components/FormulaCard';
import NoteModal from '../components/NoteModal';
import HintPanel from '../components/HintPanel';
import ConceptPracticeModal from '../components/concepts/ConceptPracticeModal';
import { SkeletonCard } from '../components/SkeletonRow';
import { ArrowLeft, Sparkles, Layers, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import useConceptStore from '../store/conceptStore';

const ITEMS_PER_PAGE = 20;

export default function ConceptDetailPage() {
  const { conceptId } = useParams();
  const navigate = useNavigate();

  const [concept, setConcept] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Concept mastery details
  const fetchMastery = useConceptStore((state) => state.fetchMastery);
  const mastery = useConceptStore((state) => state.mastery);
  const [activePracticeConcept, setActivePracticeConcept] = useState(null);

  // Notes & Hints State
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeNoteTitle, setActiveNoteTitle] = useState('');
  const [hintQuestionId, setHintQuestionId] = useState(null);
  const [hintQuestionTitle, setHintQuestionTitle] = useState('');
  const [hintQuestionConcepts, setHintQuestionConcepts] = useState([]);
  const [hintPanelOpen, setHintPanelOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 1. Fetch concept and questions
        const res = await api.get(`/api/concepts/${conceptId}/questions`);
        const { concept: conceptData, questions: questionsData } = res.data.data;
        setConcept(conceptData);
        setQuestions(questionsData || []);

        // 2. Fetch formulas and mastery in parallel
        const [formulasRes] = await Promise.all([
          api.get(`/api/formulas/chapter/${conceptData.chapter_id}`),
          fetchMastery()
        ]);

        const allFormulas = formulasRes.data.data?.formulas || [];
        // Filter formulas that are linked to this concept
        const linkedFormulaIds = conceptData.formula_ids || [];
        const linkedFormulas = allFormulas.filter(f => linkedFormulaIds.includes(f.id));
        setFormulas(linkedFormulas);
      } catch (err) {
        console.error('Failed to load concept details:', err);
        setError('Failed to load concept details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [conceptId, refreshKey, fetchMastery]);

  const conceptMastery = useMemo(() => {
    if (!mastery || !concept) return null;
    return mastery.find(m => m.concept_id === concept.id) || {
      questions_attempted: 0,
      questions_correct: 0,
      accuracy_percent: 0
    };
  }, [mastery, concept]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchDifficulty =
        difficultyFilter === 'all' || q.difficulty.toLowerCase() === difficultyFilter;
      const matchStatus =
        statusFilter === 'all' || (q.status || 'todo') === statusFilter;
      return matchDifficulty && matchStatus;
    });
  }, [questions, difficultyFilter, statusFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [difficultyFilter, statusFilter]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const showingFrom = filteredQuestions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filteredQuestions.length);

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
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to update progress, rolling back:', err);
      setQuestions(previousQuestions);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-bg-subtle rounded" />
        <div className="h-10 w-96 bg-bg-subtle rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-48 bg-bg-subtle rounded-xl" />
          <div className="h-48 bg-bg-subtle rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !concept) {
    return (
      <div className="text-center py-12">
        <p className="text-danger text-sm font-semibold">{error || 'Concept not found'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 border border-border-default hover:bg-bg-subtle rounded-md text-xs font-semibold cursor-pointer text-text-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  const accuracy = conceptMastery ? Math.round(conceptMastery.accuracy_percent) : 0;
  const attempted = conceptMastery ? conceptMastery.questions_attempted : 0;
  const correct = conceptMastery ? conceptMastery.questions_correct : 0;
  const doneCount = questions.filter((q) => q.status === 'done').length;

  let masteryColor = 'text-text-muted';
  let progressColor = 'bg-text-disabled';
  if (attempted > 0) {
    if (accuracy >= 80) {
      masteryColor = 'text-success';
      progressColor = 'bg-success';
    } else if (accuracy >= 50) {
      masteryColor = 'text-warning';
      progressColor = 'bg-warning';
    } else {
      masteryColor = 'text-danger';
      progressColor = 'bg-danger';
    }
  }

  return (
    <div className="min-h-screen text-text-primary select-none animate-slide-in">
      {/* Header section with border separator */}
      <div className="border-b border-border-default/60 pb-6 mb-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[11px] text-text-muted hover:text-text-primary transition-colors mb-4 cursor-pointer font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        
        {/* Title row with action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] md:text-[24px] font-semibold text-text-primary tracking-tight">
              {concept.name}
            </h1>
            <p className="text-[12px] text-text-muted mt-1.5 leading-relaxed max-w-[600px]">
              {concept.description || 'Review equations, linked formulas, and practice questions for this concept.'}
            </p>
            <p className="text-[12px] text-text-muted mt-1">
              {questions.length} questions total · {doneCount} completed · {questions.length - doneCount} remaining
            </p>
          </div>

          <button
            onClick={() => setActivePracticeConcept(concept)}
            disabled={questions.length === 0}
            className="flex items-center justify-center gap-2 px-4.5 py-2 bg-white text-black font-semibold text-[12.5px] rounded-md hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer shrink-0"
          >
            <Trophy className="w-3.5 h-3.5" />
            Launch Practice (5Q)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - formulas & questions */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Formulas list */}
          {formulas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Linked Formulas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formulas.map((f) => (
                  <FormulaCard key={f.id} formula={f} />
                ))}
              </div>
            </div>
          )}

          {/* Tagged questions section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Tagged Questions ({questions.length})
            </h3>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border-default rounded-lg bg-bg-surface text-[12px]">
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

                {/* Status selector */}
                <div>
                  <span className="block text-[9.5px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Status
                  </span>
                  <div className="flex items-center gap-1 border border-border-default rounded-[4px] p-0.5 bg-bg-subtle/50">
                    {['all', 'todo', 'revisit', 'done'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2 py-0.5 font-medium rounded-[3px] capitalize cursor-pointer transition ${
                          statusFilter === st
                            ? 'bg-bg-elevated text-text-primary shadow-xs'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {st === 'todo' ? 'To Do' : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[12.5px] text-text-secondary font-medium self-end py-1">
                Showing <span className="text-text-primary font-semibold">{showingFrom}–{showingTo}</span> of <span className="text-text-primary font-semibold">{filteredQuestions.length}</span> questions
              </div>
            </div>
            
            {filteredQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-default rounded-xl bg-bg-surface/30">
                <Layers className="w-6 h-6 text-text-muted mb-3" />
                <p className="text-[13.5px] font-medium text-text-primary">
                  {questions.length === 0 ? 'No questions linked to this concept yet.' : 'No questions matching filters'}
                </p>
                <p className="text-[11.5px] text-text-secondary mt-0.5">
                  {questions.length > 0 && 'Try toggling different options or clearing the current selection.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 select-none">
                {paginatedQuestions.map((q, idx) => (
                  <ConceptQuestionCard
                    key={q.id}
                    question={q}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    onStatusChange={handleStatusChange}
                    onOpenNote={(id, title) => {
                      setActiveNoteId(id);
                      setActiveNoteTitle(title);
                    }}
                    onOpenHint={(id, title) => {
                      setHintQuestionConcepts(q.concepts || []);
                      setHintQuestionId(id);
                      setHintQuestionTitle(title);
                      setHintPanelOpen(true);
                    }}
                    onTagClick={(c) => {
                      if (parseInt(c.id, 10) !== parseInt(conceptId, 10)) {
                        navigate(`/concept/${c.id}`);
                      }
                    }}
                  />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border-default/60 bg-bg-surface/50">
                    <div className="text-[11.5px] text-text-muted font-medium">
                      Page {currentPage} of {totalPages}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Prev */}
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md border border-border-default bg-bg-surface hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Previous page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-text-secondary" />
                      </button>

                      {/* Page number buttons */}
                      {(() => {
                        const pages = [];
                        const maxVisible = 7;
                        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                        let end = Math.min(totalPages, start + maxVisible - 1);
                        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

                        if (start > 1) {
                          pages.push(
                            <button key={1} onClick={() => setCurrentPage(1)}
                              className="w-7 h-7 rounded-md text-[11px] font-medium border border-border-default bg-bg-surface hover:bg-bg-elevated text-text-secondary transition cursor-pointer">1</button>
                          );
                          if (start > 2) pages.push(<span key="dots-s" className="text-text-muted text-[11px] px-0.5">…</span>);
                        }

                        for (let i = start; i <= end; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`w-7 h-7 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                                i === currentPage
                                  ? 'bg-accent text-white border border-accent'
                                  : 'border border-border-default bg-bg-surface hover:bg-bg-elevated text-text-secondary'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        if (end < totalPages) {
                          if (end < totalPages - 1) pages.push(<span key="dots-e" className="text-text-muted text-[11px] px-0.5">…</span>);
                          pages.push(
                            <button key={totalPages} onClick={() => setCurrentPage(totalPages)}
                              className="w-7 h-7 rounded-md text-[11px] font-medium border border-border-default bg-bg-surface hover:bg-bg-elevated text-text-secondary transition cursor-pointer">{totalPages}</button>
                          );
                        }

                        return pages;
                      })()}

                      {/* Next */}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-md border border-border-default bg-bg-surface hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Next page"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right column - mastery stats card */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 flex flex-col gap-5 sticky top-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warning" />
              Mastery Assessment
            </h3>
            
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black font-mono tracking-tight text-text-primary">
                {attempted > 0 ? `${accuracy}%` : '—'}
              </span>
              <span className="text-xs text-text-secondary font-medium">
                {attempted > 0 ? `${correct} of ${attempted} attempted solved` : 'No attempts logged'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: attempted > 0 ? `${accuracy}%` : '0%' }}
              />
            </div>

            <div className="flex flex-col gap-3 pt-3 text-[12px] text-text-secondary border-t border-border-default/40">
              <div className="flex items-center justify-between">
                <span>Questions Attempted</span>
                <span className="font-semibold text-text-primary">{attempted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Questions Correct</span>
                <span className="font-semibold text-text-primary">{correct}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Concept Questions</span>
                <span className="font-semibold text-text-primary">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completion</span>
                <span className="font-semibold text-text-primary">
                  {questions.length > 0 ? Math.round((doneCount / questions.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setActivePracticeConcept(concept)}
              disabled={questions.length === 0}
              className="w-full py-2.5 bg-text-primary text-bg-app hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none font-bold text-[13px] rounded-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 shadow-xs mt-1"
            >
              <Trophy className="w-3.5 h-3.5 fill-current" />
              Launch Practice Mode (5Q)
            </button>
          </div>
        </div>
      </div>

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

      {/* Practice Launcher overlay */}
      {activePracticeConcept && (
        <ConceptPracticeModal
          concept={activePracticeConcept}
          onClose={() => setActivePracticeConcept(null)}
        />
      )}
    </div>
  );
}
