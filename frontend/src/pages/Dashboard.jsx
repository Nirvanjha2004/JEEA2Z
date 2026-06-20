import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useProgressStore from '../store/progressStore';
import useStreakStore from '../store/streakStore';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import ProgressBar from '../components/ProgressBar';
import StreakCalendar from '../components/StreakCalendar';
import { SkeletonStats, SkeletonCard } from '../components/SkeletonRow';
import { BookOpen, Trophy, Sparkles, HelpCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { summary, fetchSummary } = useProgressStore();
  const { streak, fetchStreak } = useStreakStore();
  
  const [loading, setLoading] = useState(true);
  const [revisionCount, setRevisionCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSummary(), fetchStreak()]);

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
          setAccuracy(100); // Default to 100 if no tests completed
        }

        // 3. Fetch recent activity from user profile
        if (user?.id) {
          const profileRes = await api.get(`/api/profile/${user.id}`);
          setRecentActivity(profileRes.data.data?.recentActivity || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, fetchSummary, fetchStreak]);

  // Compute greeting message based on local time hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

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

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
      </div>
    );
  }

  const { total = 0, done = 0 } = summary;

  // Map progress to SUBJECTS
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

  return (
    <div className="min-h-screen text-text-primary select-none animate-slide-in">
      {/* Header */}
      <div className="mb-6 border-b border-border-default/60 pb-5">
        <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-text-primary">
          {greeting}, {user?.name} 👋
        </h1>
        <p className="text-[12px] text-text-secondary mt-1">
          {revisionCount > 0 ? (
            <span>You have <span className="text-accent font-semibold">{revisionCount} questions</span> due for revision today.</span>
          ) : (
            <span>You are all caught up! No spaced revision cards due.</span>
          )}
        </p>
      </div>

      {/* Top Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Solved */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Total Solved
          </span>
          <span className="text-[26px] font-semibold text-text-primary block leading-none">
            {done}
          </span>
          <span className="text-[10px] text-text-muted mt-1 block">
            out of {total} questions
          </span>
        </div>

        {/* Card 2: Done Today */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Done Today
          </span>
          <span className="text-[26px] font-semibold text-text-primary block leading-none">
            {streak?.solvedToday || 0}
          </span>
          <span className="text-[10px] text-text-muted mt-1 block">
            daily goal: {streak?.dailyGoal || 10}
          </span>
        </div>

        {/* Card 3: Current Streak */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Current Streak
          </span>
          <span className="text-[26px] font-semibold text-accent block leading-none flex items-center gap-1">
            🔥 {streak?.currentStreak || 0}
          </span>
          <span className="text-[10px] text-text-muted mt-1 block">
            longest: {streak?.longestStreak || 0} days
          </span>
        </div>

        {/* Card 4: Accuracy */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Accuracy
          </span>
          <span className="text-[26px] font-semibold text-text-primary block leading-none">
            {accuracy}%
          </span>
          <span className="text-[10px] text-text-muted mt-1 block">
            based on mock tests
          </span>
        </div>
      </div>

      {/* Two Column Layout: Subject sheets vs Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Column (60%): Subject progress list */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">
              Subject Progress
            </h3>
            <div className="flex flex-col gap-4.5">
              {subjectsWithProgress.map((sub) => (
                <div
                  key={sub.slug}
                  onClick={() => navigate(`/sheet/${sub.slug}`)}
                  className="cursor-pointer group select-none"
                >
                  <div className="flex items-center justify-between text-[12.5px] font-medium text-text-secondary mb-1.5">
                    <span className="group-hover:text-accent transition-colors flex items-center gap-2">
                      <span
                        className="w-1.5 h-3.5 rounded-[2px] inline-block"
                        style={{ backgroundColor: sub.color }}
                      ></span>
                      {sub.name}
                    </span>
                    <span className="text-text-primary font-mono text-[11px]">
                      {sub.done} / {sub.total}
                    </span>
                  </div>
                  <ProgressBar current={sub.done} total={sub.total} color={sub.color} height="h-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick links to actions */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[12.5px] font-semibold text-text-primary">Need a quick test?</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">Generate a timed JEE-pattern mock test.</p>
            </div>
            <Link
              to="/mock-test"
              className="px-3.5 py-1.5 bg-white text-black font-semibold text-[11.5px] rounded-md hover:bg-neutral-200 transition cursor-pointer shrink-0"
            >
              Start Mock Test
            </Link>
          </div>
        </div>

        {/* Right Column (40%): Recent activity feed */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <div className="text-[11.5px] text-text-muted italic py-6 text-center">
                No recent activity records. Start solving!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentActivity.slice(0, 8).map((act) => (
                  <div key={act.question_id} className="flex items-start gap-2.5 text-[12px] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0 mt-1.5"></span>
                    <div className="min-w-0 flex-1">
                      <span className="text-text-primary truncate block font-medium" title={act.title}>
                        {act.title}
                      </span>
                      <span className="text-text-muted text-[10.5px]">
                        {act.chapter_name} · <span className="font-mono text-[9.5px]">{formatTimeAgo(act.updated_at)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {recentActivity.length > 0 && (
            <div className="border-t border-border-default/50 pt-2.5 text-right mt-4">
              <Link to={`/profile/${user.id}`} className="text-[11px] font-semibold text-accent hover:underline">
                View My Profile →
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Full width Streak Heatmap */}
      <div className="w-full">
        <StreakCalendar calendar={streak?.calendar || []} />
      </div>
    </div>
  );
}
