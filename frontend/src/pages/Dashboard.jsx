import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useProgressStore from '../store/progressStore';
import useStreakStore from '../store/streakStore';
import useTheme from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import ProgressBar from '../components/ProgressBar';
import StreakCalendarFull from '../components/StreakCalendarFull';
import DayDetailPanel from '../components/DayDetailPanel';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { SkeletonStats, SkeletonCard } from '../components/SkeletonRow';
import { BookOpen, Trophy, Flame, Atom, FlaskConical, Binary, CheckCircle2, ChevronRight, ChevronDown, Play, Sparkles } from 'lucide-react';

// V3 Concept Imports
import useConceptStore from '../store/conceptStore';
import ConceptMasteryCard from '../components/concepts/ConceptMasteryCard';
import ConceptPracticeModal from '../components/concepts/ConceptPracticeModal';
import PatternPracticeModal from '../components/PatternPracticeModal';
import { KINEMATICS_PATTERNS, PATTERN_SHORT_NAMES, classifyQuestion } from '../utils/patterns';
import QuestionSolveModal from '../components/questions/QuestionSolveModal';
import FillBlankModal from '../components/questions/FillBlankModal';
import NumericalSolveModal from '../components/questions/NumericalSolveModal';
import MathText from '../components/MathText';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const { summary, fetchSummary } = useProgressStore();
  const { streak, fetchStreak } = useStreakStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [revisionCount, setRevisionCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [recentActivity, setRecentActivity] = useState([]);
  
  // V3 Concept selectors and states
  const fetchMastery = useConceptStore((state) => state.fetchMastery);
  const mastery = useConceptStore((state) => state.mastery);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [activePracticeConcept, setActivePracticeConcept] = useState(null);
  const [activePracticePattern, setActivePracticePattern] = useState(null);
  const [kinematicsQuestions, setKinematicsQuestions] = useState([]);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [activeSolveQuestionId, setActiveSolveQuestionId] = useState(null);
  const [activeSolveQuestionFormat, setActiveSolveQuestionFormat] = useState(null);

  // Weekly trend compares (Mock stats)
  const [prevWeekSolved, setPrevWeekSolved] = useState(0);
  
  // Timed Leaderboard teaser
  const [topUsers, setTopUsers] = useState([]);
  const [userRank, setUserRank] = useState(null);

  // Day Detail Drawer States
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDaySolves, setSelectedDaySolves] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Quick Mock States
  const [generatingTest, setGeneratingTest] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSummary(), fetchStreak(), fetchMastery()]);

        // 1. Fetch revision count
        const spacedRes = await api.get('/api/spaced/queue');
        setRevisionCount(spacedRes.data.data?.length || 0);

        // 2. Fetch mock test history to compute average accuracy
        const testsRes = await api.get('/api/tests/history');
        const history = testsRes.data.data || [];
        const completedTests = history.filter(
          (t) => t.status === 'completed' && t.max_score > 0 && t.score !== null
        );
        if (completedTests.length > 0) {
          const totalAccuracy = completedTests.reduce((acc, curr) => {
            const correctWeight = Math.max(0, curr.score);
            return acc + (correctWeight / curr.max_score);
          }, 0);
          setAccuracy(Math.round((totalAccuracy / completedTests.length) * 100));
        } else {
          setAccuracy(100);
        }

        // 3. Fetch recent activity from user profile
        if (user?.id) {
          const profileRes = await api.get(`/api/profile/${user.id}`);
          const profileData = profileRes.data.data;
          setRecentActivity(profileData?.recentActivity || []);
          
          // Generate a mock previous week comparison
          const solvedCount = profileData?.totalSolved || 0;
          setPrevWeekSolved(Math.max(0, solvedCount - 12)); // mock trend baseline
        }

        // 4. Fetch leaderboard teaser (top 3)
        const leadRes = await api.get('/api/leaderboard/weekly');
        const leadList = leadRes.data.data || [];
        setTopUsers(leadList.slice(0, 3));
        const selfRow = leadList.find((r) => r.id === user?.id);
        if (selfRow) {
          setUserRank(selfRow.rank);
        }

        // 5. Fetch Kinematics questions to compute pattern group metrics
        let kinChapterId = 2;
        try {
          const physChaptersRes = await api.get('/api/subjects/physics/chapters');
          const kinChapter = physChaptersRes.data.data?.find(ch => ch.name.toLowerCase() === 'kinematics');
          if (kinChapter) {
            kinChapterId = kinChapter.id;
          }
        } catch (e) {
          console.error('Failed to resolve Kinematics chapter ID, defaulting to 2:', e);
        }
        
        try {
          const qRes = await api.get(`/api/subjects/chapters/${kinChapterId}/questions`);
          setKinematicsQuestions(qRes.data.data || []);
        } catch (e) {
          console.error('Failed to load Kinematics questions:', e);
        }

        // 6. Fetch Today's Practice questions (from weak patterns)
        try {
          const wpRes = await api.get('/api/progress/weak-patterns?limit=5');
          setPracticeQuestions(wpRes.data.data || []);
        } catch (e) {
          console.error('Failed to load weak pattern practice questions:', e);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
        toast.error('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, fetchSummary, fetchStreak]);

  // Dynamic Time Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Streak warning detection
  const isStreakInDanger = useMemo(() => {
    if (!streak) return false;
    const hour = new Date().getHours();
    const remaining = (streak.dailyGoal || 10) - (streak.solvedToday || 0);
    return remaining > 0 && hour >= 18;
  }, [streak]);

  const remainingSolves = useMemo(() => {
    if (!streak) return 0;
    return Math.max(0, (streak.dailyGoal || 10) - (streak.solvedToday || 0));
  }, [streak]);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.max(1, Math.round(diff / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    return `${days}d ago`;
  };

  // Day Selection click handler
  const handleDayClick = (dateStr, solvesCount) => {
    setSelectedDate(dateStr);
    setSelectedDaySolves(solvesCount);
    setIsDetailOpen(true);
  };

  // Get selected day's questions from recent activity solves list
  const selectedDayQuestions = useMemo(() => {
    if (!selectedDate || recentActivity.length === 0) return [];
    return recentActivity.filter(
      (act) => act.updated_at.split('T')[0] === selectedDate
    );
  }, [selectedDate, recentActivity]);

  // Preset Mock Test Generator
  const handleQuickMockStart = async (type) => {
    if (generatingTest) return;
    setGeneratingTest(true);
    toast.info('Generating mock test...');
    
    let payload = {
      title: '15-min Speed Test',
      scope: 'full',
      scopeId: null,
      durationMin: 15,
      questionCount: 10,
    };

    if (type === 'chapter') {
      const lastChapterId = localStorage.getItem('jee-sheet-last-chapter-id');
      const lastChapterName = localStorage.getItem('jee-sheet-last-chapter-name') || 'Chapter Practice';
      if (lastChapterId) {
        payload = {
          title: `Practice: ${lastChapterName}`,
          scope: 'chapter',
          scopeId: parseInt(lastChapterId, 10),
          durationMin: 45,
          questionCount: 15,
        };
      } else {
        toast.warning('No recently viewed chapter found. Launching standard full test.');
      }
    } else if (type === 'subject') {
      payload = {
        title: 'Physics Mock Test',
        scope: 'subject',
        scopeId: 1, // Default Physics subject ID
        durationMin: 60,
        questionCount: 25,
      };
    }

    try {
      const res = await api.post('/api/tests/create', payload);
      if (res.data.success) {
        toast.success('Mock test ready! Beginning test.');
        navigate(`/mock-test/${res.data.data.testId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create mock test.');
    } finally {
      setGeneratingTest(false);
    }
  };

  if (loading || !summary || !streak) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-bg-subtle rounded-md skeleton mb-6"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SkeletonStats />
          <SkeletonStats />
          <SkeletonStats />
          <SkeletonStats />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7"><SkeletonCard /></div>
          <div className="lg:col-span-5"><SkeletonCard /></div>
        </div>
      </div>
    );
  }

  const { total = 0, done = 0 } = summary;

  // Compile subjects mapping
  const subjectsWithProgress = SUBJECTS.map((sub) => {
    const progress = summary.bySubject?.find((s) => s.slug === sub.slug) || {
      total: 0,
      done: 0,
    };
    return {
      ...sub,
      total: progress.total,
      done: progress.done,
    };
  });

  // Calculate stats trends
  const thisWeekSolved = Math.max(0, done - prevWeekSolved);

  return (
    <div className="text-text-primary select-none animate-slide-in space-y-6">
      
      {/* Header Greeting */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-text-primary">
          {greeting}, {user?.name} 👋
        </h1>
        <p className="text-[12.5px] mt-1 font-medium">
          {isStreakInDanger ? (
            <span className="text-warning">
              ⚠️ Your {streak.currentStreak}-day streak is at risk. Solve {remainingSolves} more questions.
            </span>
          ) : revisionCount > 0 ? (
            <span className="text-accent">
              You have <span className="font-semibold">{revisionCount} questions</span> due for revision today.
            </span>
          ) : (
            <span className="text-success">You're all caught up! 🎉</span>
          )}
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Solved */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Total Solved
            </span>
            <span className="text-[26px] font-semibold text-text-primary block leading-none">
              {done}
            </span>
          </div>
          <span className="text-[11.5px] text-text-secondary mt-3 block font-medium">
            out of {total} questions
          </span>
        </div>

        {/* Done Today */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Done Today
            </span>
            <span className="text-[26px] font-semibold text-text-primary block leading-none">
              {streak.solvedToday || 0}
            </span>
          </div>
          <span className="text-[11.5px] text-text-secondary mt-3 block font-medium">
            Daily goal: {streak.dailyGoal || 10} Qs
          </span>
        </div>

        {/* Current Streak */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Current Streak
            </span>
            <span className="text-[26px] font-semibold text-accent block leading-none flex items-center gap-1">
              🔥 {streak.currentStreak || 0}
            </span>
          </div>
          <span className="text-[11.5px] text-text-secondary mt-3 block font-medium">
            Longest: {streak.longestStreak || 0} days
          </span>
        </div>

        {/* Accuracy */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Accuracy
            </span>
            <span className="text-[26px] font-semibold text-text-primary block leading-none">
              {accuracy}%
            </span>
          </div>
          <span className="text-[11.5px] text-text-secondary mt-3 block font-medium">
            Based on mock tests
          </span>
        </div>
      </div>

      {/* Two-Column Section: Subject Progress + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (60%): Subject progress card */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Subject Progress
              </h3>
              <Link to="/sheet/physics" className="text-[12.5px] text-accent font-semibold hover:underline">
                View all &rarr;
              </Link>
            </div>
            
            <div className="flex flex-col">
              {subjectsWithProgress.map((sub, idx) => {
                const iconsMap = {
                  physics: Atom,
                  chemistry: FlaskConical,
                  math: Binary,
                };
                const SubjectIcon = iconsMap[sub.slug] || Atom;

                return (
                  <div key={sub.slug} className={`py-1 ${idx !== subjectsWithProgress.length - 1 ? 'border-b border-border-default/40' : ''}`}>
                    <div
                      onClick={() => {
                        setExpandedSubjects((prev) => ({
                          ...prev,
                          [sub.slug]: !prev[sub.slug],
                        }));
                      }}
                      className="flex items-center gap-3.5 py-3 cursor-pointer group rounded-md hover:bg-bg-subtle hover:px-2 -mx-2 transition-all duration-150"
                    >
                      <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-default/60 flex items-center justify-center text-text-secondary group-hover:text-text-primary shrink-0">
                        <SubjectIcon className="w-4.5 h-4.5" />
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between text-[13px] font-medium text-text-primary mb-1">
                          <span className="group-hover:text-accent transition-colors">
                            {sub.name}
                          </span>
                          <span className="text-[11.5px] font-mono text-text-secondary">
                            {sub.done} / {sub.total} completed
                          </span>
                        </div>
                        <ProgressBar current={sub.done} total={sub.total} color={sub.color} height="h-1" />
                      </div>

                      <div className="flex items-center gap-2 text-[13.5px] font-semibold text-text-primary pl-2.5">
                        <span>{sub.total > 0 ? Math.round((sub.done / sub.total) * 100) : 0}%</span>
                        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${expandedSubjects[sub.slug] ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Accordion concepts list */}
                    {expandedSubjects[sub.slug] && (
                      <div className="pl-9 pr-2 pb-3 flex flex-col gap-3 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                          Concepts Mastery (Weakest First)
                        </div>
                        {mastery.filter(c => c.subject_name.toLowerCase() === sub.name.toLowerCase()).length === 0 ? (
                          <div className="text-xs text-text-muted italic py-1 text-text-muted">
                            No concepts configured for this subject yet.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            {mastery
                              .filter(c => c.subject_name.toLowerCase() === sub.name.toLowerCase())
                              .map((concept) => {
                                const cAccuracy = Math.round(concept.accuracy_percent || 0);
                                const cAttempted = concept.questions_attempted || 0;
                                
                                let textColor = 'text-danger';
                                let barColor = 'bg-danger';
                                if (cAttempted === 0) {
                                  textColor = 'text-text-muted';
                                  barColor = 'bg-text-disabled';
                                } else if (cAccuracy >= 80) {
                                  textColor = 'text-success';
                                  barColor = 'bg-success';
                                } else if (cAccuracy >= 50) {
                                  textColor = 'text-warning';
                                  barColor = 'bg-warning';
                                }

                                const cId = concept.concept_id || concept.id;

                                return (
                                  <div key={cId} className="flex flex-col gap-1 py-0.5">
                                    <div className="flex items-center justify-between text-[12px]">
                                      <Link 
                                        to={`/concept/${cId}`}
                                        className="text-text-secondary hover:text-accent font-medium hover:underline line-clamp-1"
                                      >
                                        {concept.name}
                                      </Link>
                                      <span className={`font-semibold shrink-0 text-[11px] ${textColor}`}>
                                        {cAttempted > 0 ? `${cAccuracy}%` : 'Unattempted'}
                                      </span>
                                    </div>
                                    <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${barColor}`}
                                        style={{ width: cAttempted > 0 ? `${cAccuracy}%` : '0%' }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                        <div className="pt-2">
                          <Link
                            to={`/sheet/${sub.slug}`}
                            className="text-[11px] text-accent font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            Open {sub.name} Study Sheet &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak Areas Panel */}
          {mastery && mastery.length > 0 && (
            <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4">
              <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warning" />
                Weak Areas (Focus Concepts)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {mastery.slice(0, 3).map((concept) => (
                  <ConceptMasteryCard
                    key={concept.concept_id || concept.id}
                    concept={concept}
                    onPracticeClick={(c) => setActivePracticeConcept(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Kinematics Pattern Mastery Card */}
          {kinematicsQuestions.length > 0 && (
            <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  Kinematics Pattern Mastery
                </h3>
                <span className="text-[11px] text-text-muted">12 Core Patterns</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                {KINEMATICS_PATTERNS.map((p) => {
                  const patternQs = kinematicsQuestions.filter((q) => classifyQuestion(q) === p.key);
                  const total = patternQs.length;
                  const doneCount = patternQs.filter((q) => q.status === 'done').length;
                  const revisitCount = patternQs.filter((q) => q.status === 'revisit').length;
                  const attempts = doneCount + revisitCount;
                  const accuracy = attempts > 0 ? (doneCount / attempts) * 100 : 0;

                  let colorClass = 'text-text-disabled';
                  let barClass = 'bg-text-disabled';

                  if (attempts >= 3) {
                    if (accuracy >= 80) {
                      colorClass = 'text-success font-semibold';
                      barClass = 'bg-success';
                    } else if (accuracy >= 50) {
                      colorClass = 'text-warning font-semibold';
                      barClass = 'bg-warning';
                    } else {
                      colorClass = 'text-danger font-semibold';
                      barClass = 'bg-danger';
                    }
                  }

                  return (
                    <div 
                      key={p.key} 
                      onClick={() => setActivePracticePattern({ key: p.key, name: p.name, chapterId: 2 })}
                      className="flex flex-col gap-1 py-1 px-2 -mx-2 hover:bg-bg-subtle rounded-lg cursor-pointer transition-colors duration-150 group"
                    >
                      <div className="flex items-center justify-between text-[11.5px] font-medium text-text-secondary">
                        <span className="truncate group-hover:text-accent font-medium transition-colors">
                          {PATTERN_SHORT_NAMES[p.key] || p.key}
                        </span>
                        <span className={`text-[10px] uppercase font-mono ${colorClass}`}>
                          {attempts < 3 ? 'No Data' : `${Math.round(accuracy)}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${barClass}`}
                          style={{ width: `${total > 0 ? Math.round((doneCount / total) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (40%): Today's Practice & Recent solves feed */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Today's Practice Card */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Today's Practice
              </h3>
              <span className="text-[10px] bg-accent/15 border border-accent/25 text-accent font-semibold px-2 py-0.5 rounded-full select-none">
                Weak Areas
              </span>
            </div>
            <p className="text-[11.5px] text-text-secondary -mt-2">
              Practice 5 recommended questions from your weak pattern groups.
            </p>
            
            {practiceQuestions.length === 0 ? (
              <div className="text-center py-6 text-xs text-text-muted italic border border-dashed border-border-default rounded-md bg-bg-subtle/20">
                You're doing great! No weak areas identified.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {practiceQuestions.map((q) => {
                  return (
                    <div key={q.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border-default bg-bg-app hover:border-border-focus transition duration-150 gap-3">
                      <div className="min-w-0 flex-1">
                        <span 
                          onClick={() => {
                            setActiveSolveQuestionId(q.id);
                            setActiveSolveQuestionFormat(q.question_format || 'mcq');
                          }}
                        >
                          <MathText 
                            className="text-[12.5px] text-text-primary font-medium line-clamp-1 block cursor-pointer hover:text-accent hover:underline" 
                            text={q.title} 
                          />
                        </span>
                        <span className="text-[10px] text-text-muted mt-0.5 block truncate">
                          {q.chapter_name} • {q.pattern_group || 'General'}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveSolveQuestionId(q.id);
                          setActiveSolveQuestionFormat(q.question_format || 'mcq');
                        }}
                        className="px-2.5 py-1 bg-accent hover:bg-accent-hover text-white text-[11px] font-semibold rounded transition shrink-0 cursor-pointer select-none active:scale-95"
                      >
                        Solve
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity Card */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">
              Recent Activity
            </h3>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-10 text-xs text-text-muted italic border border-dashed border-border-default rounded-md bg-bg-subtle/20">
                No recent solve records. Start study!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentActivity.slice(0, 5).map((act) => (
                  <div key={act.question_id} className="flex items-center gap-3 py-2 border-b border-border-default/40 last:border-0 last:pb-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    
                    <div className="min-w-0 flex-grow">
                      <MathText 
                        className="text-[12.5px] text-text-primary truncate block font-medium" 
                        text={act.title} 
                      />
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        {act.chapter_name}
                      </span>
                    </div>
                    
                    <span className="text-[10px] text-text-muted shrink-0 font-mono">
                      {formatTimeAgo(act.updated_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full width navigable Calendar */}
      <div className="w-full">
        <StreakCalendarFull
          calendar={streak.calendar || []}
          dailyGoal={streak.dailyGoal}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Bottom panels layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Revision preview & mock test presets */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Card 1: Revision Preview */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5">
            <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider mb-3">
              Revision Due
            </h4>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-accent leading-none font-mono">
                {revisionCount}
              </span>
              <span className="text-xs text-text-secondary">questions need review</span>
            </div>
            
            {revisionCount > 0 ? (
              <div className="space-y-3.5">
                <Link to="/revision">
                  <Button variant="primary" className="w-full py-2 font-semibold">
                    Start Spaced Revision &rarr;
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-3 px-4 bg-success/5 border border-success/15 rounded-md text-[12px] text-success font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All caught up! No spaced revision items due today.</span>
              </div>
            )}
          </div>

          {/* Card 2: Quick Mock Test presets */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-3">
            <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">
              Quick Mock Test
            </h4>
            <p className="text-[11.5px] text-text-secondary -mt-1 mb-1">
              Select a preset template to quickly generate a timed practice test session.
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleQuickMockStart('speed')}
                disabled={generatingTest}
                className="w-full flex items-center justify-between p-3.5 bg-bg-app border border-border-default hover:border-border-focus rounded-md text-left transition cursor-pointer select-none"
              >
                <div>
                  <span className="text-[12.5px] font-semibold text-text-primary block">
                    ⚡ 15-min Speed Test
                  </span>
                  <span className="text-[10.5px] text-text-muted mt-0.5 block">
                    10 random questions, mixed difficulties.
                  </span>
                </div>
                <Play className="w-3.5 h-3.5 text-text-secondary" />
              </button>

              <button
                onClick={() => handleQuickMockStart('chapter')}
                disabled={generatingTest}
                className="w-full flex items-center justify-between p-3.5 bg-bg-app border border-border-default hover:border-border-focus rounded-md text-left transition cursor-pointer select-none"
              >
                <div>
                  <span className="text-[12.5px] font-semibold text-text-primary block">
                    📋 Recent Chapter Quiz
                  </span>
                  <span className="text-[10.5px] text-text-muted mt-0.5 block">
                    15 questions from your last viewed study topic.
                  </span>
                </div>
                <Play className="w-3.5 h-3.5 text-text-secondary" />
              </button>

              <button
                onClick={() => handleQuickMockStart('subject')}
                disabled={generatingTest}
                className="w-full flex items-center justify-between p-3.5 bg-bg-app border border-border-default hover:border-border-focus rounded-md text-left transition cursor-pointer select-none"
              >
                <div>
                  <span className="text-[12.5px] font-semibold text-text-primary block">
                    🎯 Full Physics Practice
                  </span>
                  <span className="text-[10.5px] text-text-muted mt-0.5 block">
                    25 physics mock test questions, 60 minutes.
                  </span>
                </div>
                <Play className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>
          </div>

        </div>

        {/* Right: Leaderboard Teaser */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">
                This Week's Leaders
              </h4>
              <Link to="/leaderboard" className="text-[12px] text-accent font-semibold hover:underline">
                View all &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {topUsers.map((u, index) => (
                <div key={u.id} className="flex items-center gap-3 py-1">
                  <span className="text-base w-6 text-center select-none">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.name} className="w-8 h-8 rounded-full border border-border-default object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-xs font-bold text-accent">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="text-[12.5px] font-medium text-text-primary truncate max-w-[120px]">
                    {u.name}
                  </span>

                  <span className="text-xs font-mono text-text-secondary ml-auto font-semibold">
                    {u.solved} solved
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky user standing summary */}
          {userRank && (
            <div className="border-t border-border-default/60 pt-4 mt-6">
              <div className="bg-accent/5 border border-accent/20 rounded-md p-3 flex items-center justify-between text-xs text-text-primary">
                <span className="font-semibold text-text-secondary">Your Standing:</span>
                <div className="flex gap-4">
                  <span>Rank <strong className="text-accent font-semibold">#{userRank}</strong></span>
                  <span><strong>{streak.solvedToday || 0}</strong> solved today</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Day Detail drawer panel overlay */}
      <DayDetailPanel
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        date={selectedDate}
        solvesCount={selectedDaySolves}
        questions={selectedDayQuestions}
      />

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

      {activeSolveQuestionId && activeSolveQuestionFormat === 'mcq' && (
        <QuestionSolveModal
          questionId={activeSolveQuestionId}
          isOpen={true}
          onClose={() => {
            setActiveSolveQuestionId(null);
            setActiveSolveQuestionFormat(null);
          }}
          onStatusChange={() => {
            window.location.reload();
          }}
        />
      )}

      {activeSolveQuestionId && activeSolveQuestionFormat === 'fill_blank' && (
        <FillBlankModal
          questionId={activeSolveQuestionId}
          isOpen={true}
          onClose={() => {
            setActiveSolveQuestionId(null);
            setActiveSolveQuestionFormat(null);
          }}
          onStatusChange={() => {
            window.location.reload();
          }}
        />
      )}

      {activeSolveQuestionId && activeSolveQuestionFormat === 'numerical' && (
        <NumericalSolveModal
          questionId={activeSolveQuestionId}
          isOpen={true}
          onClose={() => {
            setActiveSolveQuestionId(null);
            setActiveSolveQuestionFormat(null);
          }}
          onStatusChange={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
