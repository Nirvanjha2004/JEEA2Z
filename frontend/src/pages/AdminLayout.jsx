import React from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminLayout() {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-sm">Verifying privileges...</p>
        </div>
      </div>
    );
  }

  // Admin access guard
  const isAdmin = user?.isAdmin || user?.is_admin;
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    { label: 'Questions', path: '/admin/questions' },
    { label: 'Chapters', path: '/admin/chapters' },
    { label: 'CSV Import', path: '/admin/import' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Feedback', path: '/admin/feedback' },
  ];

  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((part, i) => {
      const isLast = i === parts.length - 1;
      const path = '/' + parts.slice(0, i + 1).join('/');
      return (
        <span key={path} className="flex items-center gap-1">
          {i > 0 && <span className="text-text-muted">/</span>}
          {isLast ? (
            <span className="text-text-primary capitalize font-semibold">{part}</span>
          ) : (
            <Link to={path} className="text-text-secondary hover:text-accent capitalize font-medium transition">
              {part}
            </Link>
          )}
        </span>
      );
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-bg-app text-text-primary flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-bg-surface border-b md:border-b-0 md:border-r border-border-default p-6 flex flex-col gap-4 shrink-0">
        <div>
          <h2 className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Admin Panel</h2>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    active
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-grow p-6 md:p-8 space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs">{getBreadcrumb()}</div>

        {/* Nested Routes Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
