import React, { useEffect, useState } from 'react';
import api from '../api';
import useAuthStore from '../store/authStore';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/admin/users', {
        params: { page, limit: 50 },
      });
      setUsers(res.data.data.users);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleToggleAdmin = async (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot revoke your own admin permissions!');
      return;
    }
    if (!window.confirm('Are you sure you want to toggle admin privileges for this user?')) return;

    try {
      const res = await api.patch(`/api/admin/users/${userId}/admin`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isAdmin: res.data.data.isAdmin } : u))
        );
      }
    } catch (err) {
      console.error(err);
      alert('Failed to modify user status.');
    }
  };

  const totalPages = Math.ceil(total / 50) || 1;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white uppercase tracking-wider">User Directory</h1>
        <p className="text-xs text-navy-400 mt-0.5">View user progress and manage admin privileges.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 bg-navy-850 rounded-2xl border border-navy-800">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-navy-850 border border-navy-800 p-8 text-center text-navy-400 text-xs rounded-2xl">
          No users registered.
        </div>
      ) : (
        <div className="bg-navy-850 border border-navy-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-navy-900 border-b border-navy-800 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-center w-28">Date Joined</th>
                  <th className="px-5 py-3 text-center w-28">Solved Count</th>
                  <th className="px-5 py-3 text-center w-28">Admin Status</th>
                  <th className="px-5 py-3 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/40 text-navy-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-navy-800/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-[10px] font-extrabold text-brand-red">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-navy-400">{u.email}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-navy-400">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-white font-extrabold">{u.totalSolved}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                          u.isAdmin
                            ? 'bg-red-500/10 border-red-500/20 text-brand-red'
                            : 'bg-navy-900 border-navy-800 text-navy-400'
                        }`}
                      >
                        {u.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleToggleAdmin(u.id)}
                          className="text-brand-red hover:text-red-400 hover:underline transition font-bold cursor-pointer"
                        >
                          {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-navy-800 bg-navy-900/40 flex items-center justify-between text-xs text-navy-400">
            <span>
              Showing Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-navy-800 hover:bg-navy-750 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-navy-800 hover:bg-navy-750 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
