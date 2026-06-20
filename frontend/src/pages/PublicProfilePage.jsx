import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import StreakCalendar from '../components/StreakCalendar';
import ProgressBar from '../components/ProgressBar';
import { Trophy, Flame, AlertCircle, ArrowLeft, Calendar, BookOpen, Layers } from 'lucide-react';

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
      <div className="min-h-[70vh] flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-sm font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto text-center py-12 text-text-primary animate-slide-in">
        <div className="p-4 bg-danger-bg border border-danger/25 text-danger text-xs rounded-md mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error || 'Profile not found.'}</span>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-text-primary text-bg-app hover:opacity-90 text-xs font-semibold rounded-md transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Activity calendar fallback
  const mockCalendar = profile.recentActivity
    ? Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const activityToday = profile.recentActivity.some(
          (act) => act.updated_at.split('T')[0] === dStr
        );
        return {
          date: dStr,
          solved: activityToday ? 1 : 0,
        };
      }).reverse()
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-text-primary select-none animate-slide-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
        <Link to="/dashboard" className="hover:text-text-primary transition-colors">
          JEE Sheet
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Profiles</span>
        <span>›</span>
        <span className="text-text-secondary">{profile.name}</span>
      </div>

      {/* Upper Profile Box */}
      <div className="bg-bg-surface border border-border-default rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-14 h-14 rounded-full object-cover border border-border-default shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-lg font-bold text-accent shadow-xs">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">{profile.name}</h1>
            <p className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-disabled" />
              {formatJoinedDate(profile.joinedAt)}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 min-w-[280px]">
          <div className="bg-bg-subtle/50 border border-border-default p-2.5 rounded-lg text-center">
            <span className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
              Solved
            </span>
            <span className="text-[15px] font-semibold text-text-primary leading-none">
              {profile.totalSolved}
            </span>
          </div>
          <div className="bg-bg-subtle/50 border border-border-default p-2.5 rounded-lg text-center">
            <span className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
              Streak
            </span>
            <span className="text-[15px] font-semibold text-accent leading-none flex items-center justify-center gap-0.5">
              🔥 {profile.currentStreak}
            </span>
          </div>
          <div className="bg-bg-subtle/50 border border-border-default p-2.5 rounded-lg text-center">
            <span className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
              Longest
            </span>
            <span className="text-[15px] font-semibold text-text-primary leading-none">
              🔥 {profile.longestStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Progress + Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column (5/12): Progress breakdown */}
        <div className="md:col-span-5 bg-bg-surface border border-border-default rounded-lg p-5 shadow-xs flex flex-col gap-4">
          <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-text-secondary" />
            Syllabus Breakdown
          </h3>
          
          <div className="flex flex-col gap-4">
            {profile.subjectBreakdown?.map((sub) => {
              const colorsMap = {
                physics: '#38bdf8', // sky-400
                chemistry: '#34d399', // emerald-400
                math: '#fbbf24', // amber-400
              };
              const color = colorsMap[sub.slug] || '#e11d48';
              const percent = sub.total > 0 ? Math.round((sub.solved / sub.total) * 100) : 0;

              return (
                <div key={sub.id} className="select-none">
                  <div className="flex justify-between text-[12px] font-medium mb-1.5">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-3.5 rounded-[2px] inline-block"
                        style={{ backgroundColor: color }}
                      ></span>
                      {sub.name}
                    </span>
                    <span className="text-text-primary font-mono text-[11px]">
                      {sub.solved} / {sub.total} ({percent}%)
                    </span>
                  </div>
                  <ProgressBar current={sub.solved} total={sub.total} color={color} height="h-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7/12): Solves Calendar heatmap */}
        <div className="md:col-span-7">
          <StreakCalendar calendar={mockCalendar} />
        </div>
      </div>

      {/* Recent Activity solves Feed */}
      <div className="bg-bg-surface border border-border-default rounded-lg p-5 shadow-xs flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-text-secondary" />
          Recent Solves
        </h3>

        {profile.recentActivity?.length === 0 ? (
          <div className="text-center py-6 text-xs text-text-muted italic border border-dashed border-border-default rounded-md bg-bg-subtle/20">
            No recent solve history.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {profile.recentActivity?.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3 bg-bg-app border border-border-default hover:border-border-focus rounded-md transition-colors duration-150"
              >
                <div className="min-w-0">
                  <h4 className="text-[12.5px] font-medium text-text-primary truncate max-w-[200px] sm:max-w-md">
                    {act.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium mt-0.5">
                    <span>{act.subject_name}</span>
                    <span>·</span>
                    <span>{act.chapter_name}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-text-muted shrink-0">
                  {formatDate(act.updated_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
