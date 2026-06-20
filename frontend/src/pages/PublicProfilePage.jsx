import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import StreakCalendar from '../components/StreakCalendar';
import ProgressBar from '../components/ProgressBar';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/api/profile/${userId}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const formatJoinedDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const diffTime = Math.abs(new Date() - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths === 0) {
      return 'Joined this month';
    } else if (diffMonths === 1) {
      return 'Joined 1 month ago';
    } else {
      return `Joined ${diffMonths} months ago`;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-navy-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-400 text-sm">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-24 bg-navy-900 text-white px-4 max-w-md mx-auto text-center">
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl mb-6">
          {error || 'Profile not found.'}
        </div>
        <Link to="/dashboard" className="px-6 py-2 bg-brand-red text-xs font-bold rounded-lg text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Activity calendar fallback
  const mockCalendar = profile.recentActivity ? Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const activityToday = profile.recentActivity.some(act => act.updated_at.split('T')[0] === dStr);
    return {
      date: dStr,
      solved: activityToday ? 1 : 0
    };
  }).reverse() : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-navy-900 text-white px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      {/* Upper Profile Box */}
      <div className="bg-navy-850 border border-navy-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-red shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-navy-900 border-2 border-brand-red flex items-center justify-center text-xl font-bold text-brand-red shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-black">{profile.name}</h1>
            <p className="text-xs text-navy-400 mt-1 font-semibold">{formatJoinedDate(profile.joinedAt)}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 md:min-w-[320px]">
          <div className="bg-navy-900/60 border border-navy-800 p-3 rounded-2xl text-center">
            <span className="block text-[9px] font-bold text-navy-500 uppercase">Solved</span>
            <span className="text-base font-extrabold text-white">{profile.totalSolved}</span>
          </div>
          <div className="bg-navy-900/60 border border-navy-800 p-3 rounded-2xl text-center">
            <span className="block text-[9px] font-bold text-navy-500 uppercase">Streak</span>
            <span className="text-base font-extrabold text-brand-red">🔥 {profile.currentStreak}</span>
          </div>
          <div className="bg-navy-900/60 border border-navy-800 p-3 rounded-2xl text-center">
            <span className="block text-[9px] font-bold text-navy-500 uppercase">Longest</span>
            <span className="text-base font-extrabold text-white">🔥 {profile.longestStreak}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Progress + Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Progress bars */}
        <div className="md:col-span-5 bg-navy-850 border border-navy-800 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Syllabus Breakdown</h3>
          
          <div className="space-y-4">
            {profile.subjectBreakdown?.map((sub) => {
              const colorsMap = {
                physics: '#3b82f6',
                chemistry: '#22c55e',
                math: '#f59e0b',
              };
              const color = colorsMap[sub.slug] || '#ef4444';
              const percent = sub.total > 0 ? Math.round((sub.solved / sub.total) * 100) : 0;

              return (
                <div key={sub.id}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-navy-300">{sub.name}</span>
                    <span className="text-white">
                      {sub.solved} / {sub.total} ({percent}%)
                    </span>
                  </div>
                  <ProgressBar current={sub.solved} total={sub.total} color={color} height="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Solves Calendar */}
        <div className="md:col-span-7">
          <StreakCalendar calendar={mockCalendar} />
        </div>
      </div>

      {/* Recent Activity solves Feed */}
      <div className="bg-navy-850 border border-navy-800 rounded-3xl p-6 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Recent Solves</h3>

        {profile.recentActivity?.length === 0 ? (
          <p className="text-xs text-navy-500 italic">No recent solve history.</p>
        ) : (
          <div className="space-y-3">
            {profile.recentActivity?.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3 bg-navy-900/50 border border-navy-800 rounded-2xl"
              >
                <div>
                  <h4 className="text-xs font-bold text-white leading-relaxed truncate max-w-[200px] sm:max-w-md">
                    {act.title}
                  </h4>
                  <div className="flex gap-2 text-[9px] text-navy-400 font-semibold mt-0.5">
                    <span>{act.subject_name}</span>
                    <span>•</span>
                    <span>{act.chapter_name}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-navy-500 whitespace-nowrap">{formatDate(act.updated_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
