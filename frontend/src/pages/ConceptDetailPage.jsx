import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import QuestionRow from '../components/QuestionRow';
import FormulaCard from '../components/FormulaCard';
import NoteModal from '../components/NoteModal';
import HintPanel from '../components/HintPanel';
import ConceptPracticeModal from '../components/concepts/ConceptPracticeModal';
import { SkeletonRow, SkeletonCard } from '../components/SkeletonRow';
import { ArrowLeft, Sparkles, Layers, Trophy } from 'lucide-react';
import useConceptStore from '../store/conceptStore';

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
    <div className="min-h-screen text-text-primary select-none animate-slide-in space-y-6">
      {/* Back navigation & breadcrumbs */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        
        <h1 className="text-[20px] md:text-[22px] font-semibold text-text-primary tracking-tight">
          {concept.name}
        </h1>
        <p className="text-[12.5px] text-text-muted mt-1 leading-relaxed max-w-[600px]">
          {concept.description || 'Review equations, linked formulas, and practice questions for this physics concept.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - formulas & questions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Formulas list */}
          {formulas.length > 0 && (
            <div className="space-y-3">
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

          {/* Tagged questions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Tagged Questions ({questions.length})
            </h3>
            
            {questions.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border-default rounded-xl bg-bg-surface/30 text-xs text-text-muted">
                No questions linked to this concept yet.
              </div>
            ) : (
              <div className="overflow-x-auto select-none border border-border-default rounded-xl bg-bg-surface">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-bg-subtle/50 border-b border-border-default text-[10.5px] font-semibold text-text-muted uppercase tracking-wider">
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
                    {questions.map((q, idx) => (
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
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right column - mastery stats card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-bg-surface border border-border-default rounded-2xl p-5 flex flex-col gap-4">
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

            <div className="flex flex-col gap-2 pt-2 text-[12px] text-text-secondary border-t border-border-default/40">
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
            </div>

            <button
              onClick={() => setActivePracticeConcept(concept)}
              disabled={questions.length === 0}
              className="w-full py-2.5 bg-text-primary text-bg-app hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none font-bold text-[13px] rounded-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 shadow-xs mt-2"
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
