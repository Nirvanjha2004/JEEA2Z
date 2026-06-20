import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import useAuthStore from '../store/authStore';
import useProgressStore from '../store/progressStore';
import useStreakStore from '../store/streakStore';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { summary, fetchSummary } = useProgressStore();
  const { streak, fetchStreak } = useStreakStore();
  const [loading, setLoading] = useState(true);
  const [revisionCount, setRevisionCount] = useState(0);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchSummary();
        await fetchStreak();
        
        // Fetch revision count
        const spacedRes = await api.get('/api/spaced/queue');
        setRevisionCount(spacedRes.data.data.length);

        // Fetch top 3 weekly solvers
        const leadRes = await api.get('/api/leaderboard/weekly');
        setTopUsers(leadRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard V2 metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchSummary, fetchStreak]);

  if (loading || !summary) {
    return (
      <div className="min-h-screen pt-16 bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-400 text-sm">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  const { total = 0, done = 0, revisit = 0 } = summary;
  const todo = total - done - revisit;
  const percentComplete = total > 0 ? Math.round((done / total) * 100) : 0;

  // Recharts Pie Chart Data
  const chartData = [
    { name: 'Completed', value: done, color: '#22c55e' },
    { name: 'Revisit', value: revisit, color: '#f59e0b' },
    { name: 'To Do', value: todo > 0 ? todo : 0, color: '#475569' },
  ].filter(item => item.value > 0); // Only show segments with > 0 values

  // Map backend subject progress to the SUBJECTS constants for display
  const subjectListWithProgress = SUBJECTS.map((sub) => {
    const progress = summary.bySubject?.find((s) => s.slug === sub.slug) || {
      total: 0,
      done: 0,
      revisit: 0,
    };
    return {
      ...sub,
      total: progress.total,
      done: progress.done,
      revisit: progress.revisit,
    };
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-20 pb-12 bg-navy-900 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Welcome back, <span className="text-brand-red">{user?.name}</span>
        </h1>
        <p className="text-sm text-navy-400 mt-1">Here is your JEE preparation progress summary.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
            Total Questions
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-white">{total}</span>
        </div>
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
            Completed
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-green-400">{done}</span>
        </div>
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
            Revisit
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-amber-400">{revisit}</span>
        </div>
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
            % Complete
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-brand-red">{percentComplete}%</span>
        </div>
      </div>

      {/* V2 Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Streak card */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-1">
              Daily Solve Streak
            </span>
            <span className="text-3xl font-black text-brand-red">
              🔥 {streak?.currentStreak || 0} <span className="text-xs text-navy-400 font-semibold">days</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-navy-400 font-bold mb-1">
              <span>Today's Progress</span>
              <span>{streak?.solvedToday || 0} / {streak?.dailyGoal || 10} Solved</span>
            </div>
            <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-red rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round(((streak?.solvedToday || 0) / (streak?.dailyGoal || 10)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Revision Due card */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-1">
              Revision Due
            </span>
            <span className="text-3xl font-black text-white">
              {revisionCount} <span className="text-xs text-navy-400 font-semibold">questions</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-navy-400 font-medium">
              {revisionCount > 0 ? 'Review due items now' : 'All caught up!'}
            </span>
            <Link
              to="/revision"
              className="px-3 py-1 bg-brand-red hover:bg-brand-red-hover text-[10px] font-bold text-white rounded-lg transition"
            >
              Start Revision &rarr;
            </Link>
          </div>
        </div>

        {/* Weekly Leaderboard Teaser */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-2">
              Weekly Top Solvers
            </span>
            <div className="space-y-1.5">
              {topUsers.length === 0 ? (
                <div className="text-[10px] text-navy-500 italic">No solves recorded this week.</div>
              ) : (
                topUsers.map((u, idx) => (
                  <div key={u.id} className="flex items-center justify-between text-[11px] font-medium text-navy-300">
                    <span className="truncate max-w-[120px]">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {u.name}
                    </span>
                    <span className="font-mono text-white font-bold">{u.solved} solved</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-2 text-right">
            <Link
              to="/leaderboard"
              className="text-[10px] font-bold text-brand-red hover:underline"
            >
              View Full Standings &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Donut + Subject Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recharts Donut */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 lg:col-span-5 flex flex-col items-center">
          <h2 className="text-base font-bold text-white mb-6 mr-auto">Progress Distribution</h2>
          <div className="w-full h-64 relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-navy-500 text-sm text-center">No progress recorded yet.</p>
            )}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">{percentComplete}%</span>
              <span className="text-xs text-navy-400 uppercase font-bold tracking-wider">Done</span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex gap-6 mt-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-green-400">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
              Done ({done})
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
              Revisit ({revisit})
            </div>
            <div className="flex items-center gap-1.5 text-navy-400">
              <span className="w-2.5 h-2.5 rounded-full bg-navy-600 block"></span>
              To Do ({todo > 0 ? todo : 0})
            </div>
          </div>
        </div>

        {/* Right: Subject Progress Lists */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-lg font-bold text-white">Subject Sheets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {subjectListWithProgress.map((sub) => (
              <Link
                key={sub.slug}
                to={`/sheet/${sub.slug}`}
                className="bg-navy-800 border border-navy-700 hover:border-navy-500 p-5 rounded-2xl flex flex-col transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-1.5 h-4.5 rounded-sm inline-block shrink-0"
                    style={{ backgroundColor: sub.color }}
                  ></span>
                  <h3 className="font-bold text-white group-hover:text-brand-red transition-colors">
                    {sub.name}
                  </h3>
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline justify-between text-xs text-navy-400 font-semibold mb-2">
                    <span>
                      {sub.done} / {sub.total} Done
                    </span>
                    <span className="text-white">
                      {sub.total > 0 ? Math.round((sub.done / sub.total) * 100) : 0}%
                    </span>
                  </div>
                  <ProgressBar current={sub.done} total={sub.total} color={sub.color} height="h-2" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Stats banner */}
          <div className="bg-navy-800/40 border border-navy-850 p-5 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Prepare strategically</h4>
              <p className="text-xs text-navy-400">Filter chapter questions to practice specific formats like PYQs.</p>
            </div>
            <Link
              to="/sheet/physics"
              className="px-4 py-2 bg-navy-800 hover:bg-navy-950 border border-navy-700 hover:border-brand-red text-xs font-semibold text-white rounded-lg transition"
            >
              Start Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
