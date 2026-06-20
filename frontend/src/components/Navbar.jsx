import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { SUBJECTS } from '../utils/constants';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Hide Navbar during active timed mock tests (but keep visible on results)
  const isTakingTest = location.pathname.startsWith('/mock-test/') && !location.pathname.includes('/result');
  if (isTakingTest) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-bg-surface border-b border-border-default z-50 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold text-text-primary tracking-wide flex items-center gap-1.5">
          <span className="w-2.5 h-6 bg-accent rounded-sm inline-block"></span>
          JEE <span className="text-accent">Sheet</span>
        </Link>
      </div>

      {/* Center: Tabs (Only if logged in) */}
      {user && (
        <div className="hidden lg:flex items-center gap-1 h-full">
          {SUBJECTS.map((sub) => {
            const path = `/sheet/${sub.slug}`;
            const active = isActive(path);
            return (
              <Link
                key={sub.slug}
                to={path}
                className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
                  active
                    ? 'border-accent text-text-primary bg-bg-subtle'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50'
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
          
          <span className="w-px h-6 bg-border-default mx-2 shrink-0"></span>

          <Link
            to="/bookmarks"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/bookmarks')
                ? 'border-accent text-text-primary bg-bg-subtle'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50'
            }`}
          >
            Bookmarks
          </Link>
          <Link
            to="/revision"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/revision')
                ? 'border-accent text-text-primary bg-bg-subtle'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50'
            }`}
          >
            Revision
          </Link>
          <Link
            to="/mock-test"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/mock-test')
                ? 'border-accent text-text-primary bg-bg-subtle'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50'
            }`}
          >
            Mock Test
          </Link>
          <Link
            to="/leaderboard"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/leaderboard')
                ? 'border-accent text-text-primary bg-bg-subtle'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50'
            }`}
          >
            Leaderboard
          </Link>
          {(user.isAdmin || user.is_admin) && (
            <Link
              to="/admin/questions"
              className={`px-3 h-full flex items-center text-xs font-bold text-accent border-b-2 transition-all duration-200 ${
                isActive('/admin')
                  ? 'border-accent bg-bg-subtle'
                  : 'border-transparent hover:text-accent-hover hover:bg-bg-subtle/50'
              }`}
            >
              Admin
            </Link>
          )}
        </div>
      )}

      {/* Right: Auth info */}
      <div className="hidden lg:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-xs text-text-secondary">
              Welcome, <span className="font-semibold text-text-primary">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-border-default text-xs font-semibold text-text-secondary hover:border-accent hover:text-text-primary transition-all cursor-pointer bg-transparent"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-text-secondary hover:text-text-primary transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition"
            >
              Start Free
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-bg-surface border-b border-border-default py-4 px-6 flex flex-col gap-4 lg:hidden">
          {user && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Navigation</span>
              
              {SUBJECTS.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/sheet/${sub.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                    isActive(`/sheet/${sub.slug}`)
                      ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                  }`}
                >
                  {sub.name}
                </Link>
              ))}

              <span className="h-px bg-border-default my-1"></span>

              <Link
                to="/bookmarks"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/bookmarks')
                    ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                }`}
              >
                Bookmarks
              </Link>
              <Link
                to="/revision"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/revision')
                    ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                }`}
              >
                Revision Queue
              </Link>
              <Link
                to="/mock-test"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/mock-test')
                    ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                }`}
              >
                Mock Tests
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/leaderboard')
                    ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                }`}
              >
                Leaderboard
              </Link>

              {(user.isAdmin || user.is_admin) && (
                <Link
                  to="/admin/questions"
                  onClick={() => setIsOpen(false)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold text-accent transition ${
                    isActive('/admin')
                      ? 'bg-bg-elevated border-l-2 border-l-accent'
                      : 'hover:bg-bg-subtle'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          )}

          <div className="border-t border-border-default pt-3 flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-xs text-text-secondary">
                  Signed in as <span className="font-semibold text-text-primary">{user.name}</span>
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 rounded-lg border border-border-default text-xs font-semibold text-text-secondary hover:border-accent hover:text-text-primary transition cursor-pointer bg-transparent"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
