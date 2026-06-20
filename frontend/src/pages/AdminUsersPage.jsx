import React, { useEffect, useState } from 'react';
import api from '../api';
import useAuthStore from '../store/authStore';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const toast = useToast();
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
      toast.warning('You cannot revoke your own admin permissions!');
      return;
    }
    if (!window.confirm('Are you sure you want to toggle admin privileges for this user?')) return;

    try {
      const res = await api.patch(`/api/admin/users/${userId}/admin`);
      if (res.data.success) {
        toast.success('User status updated successfully.');
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isAdmin: res.data.data.isAdmin } : u))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to modify user status.');
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
    <div className="space-y-6 text-text-primary select-none animate-slide-in">
      <div>
        <h1 className="text-[17px] font-semibold text-text-primary uppercase tracking-wider">User Directory</h1>
        <p className="text-[12px] text-text-secondary mt-1">View user progress and manage admin privileges.</p>
      </div>

      {error && (
        <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12.5px] rounded-md flex items-start gap-2 animate-slide-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 bg-bg-surface rounded-lg border border-border-default/60">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-bg-surface border border-border-default/60 p-12 text-center text-text-muted text-xs rounded-lg">
          No users registered.
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-default rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-bg-subtle/30 border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-center w-28">Date Joined</th>
                  <th className="px-5 py-3 text-center w-28">Solved Count</th>
                  <th className="px-5 py-3 text-center w-28">Admin Status</th>
                  <th className="px-5 py-3 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-text-primary flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-[10px] font-extrabold text-accent">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-text-muted">{u.email}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-text-muted">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-text-primary font-semibold">{u.totalSolved}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[9.5px] font-bold rounded-full border ${
                          u.isAdmin
                            ? 'bg-accent/10 border-accent/25 text-accent'
                            : 'bg-bg-elevated border-border-default text-text-muted'
                        }`}
                      >
                        {u.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleToggleAdmin(u.id)}
                          className="text-accent hover:text-accent-hover hover:underline transition font-semibold cursor-pointer text-xs"
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
          <div className="p-4 border-t border-border-default/60 bg-bg-subtle/20 flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="compact"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="compact"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
