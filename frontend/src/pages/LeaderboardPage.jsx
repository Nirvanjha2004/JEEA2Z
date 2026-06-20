import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api';
import { Trophy, Flame, AlertCircle } from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState('weekly'); // 'weekly' | 'alltime'
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/api/leaderboard/${tab}`);
      setList(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load leaderboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  // Find current user row in the list (if exists)
  const currentUserRow = list.find((row) => row.id === user?.id);

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-text-primary select-none animate-slide-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
        <Link to="/dashboard" className="hover:text-text-primary transition-colors">
          JEE Sheet
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Leaderboard</span>
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning shrink-0" />
            <span>Leaderboard</span>
          </h1>
          <p className="text-[12px] text-text-muted mt-1">See how you rank against other JEE solvers.</p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex bg-bg-subtle border border-border-default p-0.5 rounded-md self-start sm:self-auto">
          <button
            onClick={() => setTab('weekly')}
            className={`px-3 py-1 text-xs font-medium rounded transition cursor-pointer ${
              tab === 'weekly'
                ? 'bg-bg-elevated text-text-primary border border-border-default/60 shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Weekly Solves
          </button>
          <button
            onClick={() => setTab('alltime')}
            className={`px-3 py-1 text-xs font-medium rounded transition cursor-pointer ${
              tab === 'alltime'
                ? 'bg-bg-elevated text-text-primary border border-border-default/60 shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All-Time Solves
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-danger-bg border border-danger/20 text-danger text-xs rounded-md mb-6 flex items-start gap-2 animate-slide-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="relative bg-bg-surface border border-border-default rounded-lg overflow-hidden shadow-xs pb-14 min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-bg-subtle/30 border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">Rank</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3 text-center w-28">Solved</th>
                  <th className="px-4 py-3 text-center w-32">Solve Streak</th>
                  <th className="px-4 py-3 w-40 text-center">Solved Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-xs">
                {list.map((row) => {
                  const isSelf = row.id === user?.id;
                  const ratio = Math.min(100, Math.round((row.solved / 150) * 100)); // normalized to 150 solves for progress length

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isSelf
                          ? 'bg-accent/5 hover:bg-accent/10 border-l-2 border-l-accent font-medium'
                          : 'hover:bg-bg-subtle/30'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center font-mono text-[11px] text-text-muted">
                        {getRankIcon(row.rank)}
                      </td>
                      
                      <td className="px-4 py-3.5">
                        <Link to={`/profile/${row.id}`} className="flex items-center gap-2.5 group">
                          {row.avatar_url ? (
                            <img
                              src={row.avatar_url}
                              alt={row.name}
                              className="w-5 h-5 rounded-full object-cover border border-border-default"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-[9px] font-bold text-accent">
                              {row.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-[12.5px] text-text-primary group-hover:text-accent transition-colors truncate max-w-[120px] md:max-w-xs">
                            {row.name}
                          </span>
                        </Link>
                      </td>
                      
                      <td className="px-4 py-3.5 text-center font-mono text-[12px] font-semibold text-text-primary">
                        {row.solved}
                      </td>
                      
                      <td className="px-4 py-3.5 text-center font-mono font-medium">
                        <div className="inline-flex items-center gap-1 bg-accent-subtle/50 px-2 py-0.5 rounded text-[11px] text-accent border border-accent/10">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>{row.streak} d</span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3.5">
                        {/* Progress Bar Visualizer */}
                        <div className="w-24 mx-auto h-1.5 bg-bg-subtle border border-border-default rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${ratio}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sticky Bottom Row for Current User (if not in top results) */}
          {currentUserRow && (
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-bg-surface border-t border-accent/20 px-5 flex items-center justify-between text-xs text-text-primary z-10 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-secondary">Your Standing:</span>
                <span className="font-mono bg-accent/10 px-2 py-0.5 rounded border border-accent/25 text-accent font-bold">
                  Rank {currentUserRow.rank}
                </span>
              </div>

              <div className="flex gap-5">
                <span>
                  Solved: <strong className="text-text-primary font-mono font-semibold">{currentUserRow.solved}</strong>
                </span>
                <span className="flex items-center gap-1">
                  Streak: <strong className="text-accent font-mono font-semibold">🔥 {currentUserRow.streak} days</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
