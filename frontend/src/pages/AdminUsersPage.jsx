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
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-bg-surface border border-border-default hover:border-border-focus hover:bg-bg-subtle/20 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 shadow-xs"
              >
                {/* Left: Avatar, Name, Email */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-xs font-extrabold text-accent shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-text-primary flex items-center gap-2">
                      {u.name}
                      <span
                        className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                          u.isAdmin
                            ? 'bg-accent/10 border-accent/25 text-accent'
                            : 'bg-bg-elevated border-border-default text-text-muted'
                        }`}
                      >
                        {u.isAdmin ? 'Admin' : 'Student'}
                      </span>
                    </h3>
                    <p className="text-[10px] text-text-muted font-mono truncate">{u.email}</p>
                  </div>
                </div>

                {/* Middle: Joined Date and Solved Count */}
                <div className="flex items-center gap-4 shrink-0 flex-wrap text-left md:text-right">
                  <div className="shrink-0">
                    <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Joined Date</span>
                    <span className="text-[11px] font-mono text-text-secondary">{formatDate(u.createdAt)}</span>
                  </div>
                  <div className="shrink-0">
                    <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Solved Count</span>
                    <span className="inline-flex items-center bg-bg-app border border-border-default/60 px-2 py-0.5 rounded-md font-mono text-[11.5px] font-bold text-text-primary">
                      🏆 {u.totalSolved} solved
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-end shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border-default/30">
                  {u.id !== currentUser.id && (
                    <Button
                      variant="secondary"
                      size="compact"
                      onClick={() => handleToggleAdmin(u.id)}
                      className={`h-8 text-xs px-3 font-semibold border-border-default/60 ${
                        u.isAdmin
                          ? 'hover:bg-danger-bg hover:text-danger hover:border-danger/25'
                          : 'hover:border-accent hover:text-accent'
                      }`}
                    >
                      {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border border-border-default bg-bg-surface rounded-xl flex items-center justify-between text-xs text-text-muted shadow-xs">
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
