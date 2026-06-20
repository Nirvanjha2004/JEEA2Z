import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api';

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
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-navy-900 text-white px-4 md:px-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <span>🏆</span> Leaderboard
          </h1>
          <p className="text-xs text-navy-400 mt-1">See how you rank against other JEE solvers.</p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex bg-navy-950 border border-navy-850 p-0.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTab('weekly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              tab === 'weekly' ? 'bg-navy-800 text-white shadow-sm' : 'text-navy-400 hover:text-white'
            }`}
          >
            Weekly Solves
          </button>
          <button
            onClick={() => setTab('alltime')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              tab === 'alltime' ? 'bg-navy-800 text-white shadow-sm' : 'text-navy-400 hover:text-white'
            }`}
          >
            All-Time Solves
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="relative bg-navy-850 border border-navy-800 rounded-3xl overflow-hidden shadow-lg pb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-navy-900 border-b border-navy-800 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                  <th className="px-5 py-3 w-16 text-center">Rank</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3 text-center w-28">Questions Solved</th>
                  <th className="px-5 py-3 text-center w-28">Solve Streak</th>
                  <th className="px-5 py-3 w-40 text-center">Solved Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/40">
                {list.map((row) => {
                  const isSelf = row.id === user?.id;
                  const ratio = Math.min(100, Math.round((row.solved / 150) * 100)); // normalized to 150 solves for progress length

                  return (
                    <tr
                      key={row.id}
                      className={`text-sm transition-colors ${
                        isSelf ? 'bg-brand-red/10 hover:bg-brand-red/20 font-semibold' : 'hover:bg-navy-800/35'
                      }`}
                    >
                      <td className="px-5 py-4 text-center font-mono text-xs font-bold text-navy-300">
                        {getRankIcon(row.rank)}
                      </td>
                      <td className="px-5 py-4 flex items-center gap-3">
                        {row.avatar_url ? (
                          <img
                            src={row.avatar_url}
                            alt={row.name}
                            className="w-6 h-6 rounded-full object-cover border border-navy-700"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-[10px] font-bold text-brand-red">
                            {row.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-white truncate max-w-[120px] md:max-w-xs">{row.name}</span>
                      </td>
                      <td className="px-5 py-4 text-center font-mono text-xs font-extrabold text-white">
                        {row.solved}
                      </td>
                      <td className="px-5 py-4 text-center text-xs font-bold text-brand-red font-mono">
                        🔥 {row.streak} days
                      </td>
                      <td className="px-5 py-4">
                        {/* Progress Bar Visualizer */}
                        <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-red rounded-full" style={{ width: `${ratio}%` }} />
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
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-navy-950 border-t border-brand-red/30 px-5 flex items-center justify-between text-xs text-white shadow-2xl z-10">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-red">Your Standing:</span>
                <span className="font-mono bg-brand-red/20 px-2 py-0.5 rounded border border-brand-red/30 text-brand-red font-extrabold">
                  Rank {currentUserRow.rank}
                </span>
              </div>

              <div className="flex gap-6">
                <span>
                  Solved: <strong className="text-white font-mono">{currentUserRow.solved}</strong>
                </span>
                <span>
                  Streak: <strong className="text-brand-red font-mono">🔥 {currentUserRow.streak} days</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
