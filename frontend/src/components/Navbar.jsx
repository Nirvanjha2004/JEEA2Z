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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-navy-950 border-b border-navy-700 z-50 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold text-white tracking-wide flex items-center gap-1.5">
          <span className="w-2.5 h-6 bg-brand-red rounded-sm inline-block"></span>
          JEE <span className="text-brand-red">Sheet</span>
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
                    ? 'border-brand-red text-white bg-navy-900/50'
                    : 'border-transparent text-navy-400 hover:text-white hover:bg-navy-900/20'
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
          
          <span className="w-px h-6 bg-navy-800 mx-2 shrink-0"></span>

          <Link
            to="/bookmarks"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/bookmarks')
                ? 'border-brand-red text-white bg-navy-900/50'
                : 'border-transparent text-navy-400 hover:text-white hover:bg-navy-900/20'
            }`}
          >
            Bookmarks
          </Link>
          <Link
            to="/revision"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/revision')
                ? 'border-brand-red text-white bg-navy-900/50'
                : 'border-transparent text-navy-400 hover:text-white hover:bg-navy-900/20'
            }`}
          >
            Revision
          </Link>
          <Link
            to="/mock-test"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/mock-test')
                ? 'border-brand-red text-white bg-navy-900/50'
                : 'border-transparent text-navy-400 hover:text-white hover:bg-navy-900/20'
            }`}
          >
            Mock Test
          </Link>
          <Link
            to="/leaderboard"
            className={`px-3 h-full flex items-center text-xs font-semibold border-b-2 transition-all duration-200 ${
              isActive('/leaderboard')
                ? 'border-brand-red text-white bg-navy-900/50'
                : 'border-transparent text-navy-400 hover:text-white hover:bg-navy-900/20'
            }`}
          >
            Leaderboard
          </Link>
          {(user.isAdmin || user.is_admin) && (
            <Link
              to="/admin/questions"
              className={`px-3 h-full flex items-center text-xs font-bold text-brand-red border-b-2 transition-all duration-200 ${
                isActive('/admin')
                  ? 'border-brand-red bg-navy-900/50'
                  : 'border-transparent hover:text-red-400 hover:bg-navy-900/20'
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
            <span className="text-xs text-navy-300">
              Welcome, <span className="font-semibold text-white">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-navy-600 text-xs font-semibold text-navy-300 hover:border-brand-red hover:text-white transition-all cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-navy-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg hover:bg-brand-red-hover transition"
            >
              Start Free
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-navy-400 hover:text-white cursor-pointer"
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
        <div className="absolute top-16 left-0 right-0 bg-navy-950 border-b border-navy-700 py-4 px-6 flex flex-col gap-4 lg:hidden">
          {user && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">Navigation</span>
              
              {SUBJECTS.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/sheet/${sub.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                    isActive(`/sheet/${sub.slug}`)
                      ? 'bg-navy-800 text-white border-l-2 border-brand-red'
                      : 'text-navy-400 hover:text-white hover:bg-navy-900'
                  }`}
                >
                  {sub.name}
                </Link>
              ))}

              <span className="h-px bg-navy-800 my-1"></span>

              <Link
                to="/bookmarks"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/bookmarks')
                    ? 'bg-navy-800 text-white border-l-2 border-brand-red'
                    : 'text-navy-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                Bookmarks
              </Link>
              <Link
                to="/revision"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/revision')
                    ? 'bg-navy-800 text-white border-l-2 border-brand-red'
                    : 'text-navy-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                Revision Queue
              </Link>
              <Link
                to="/mock-test"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/mock-test')
                    ? 'bg-navy-800 text-white border-l-2 border-brand-red'
                    : 'text-navy-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                Mock Tests
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive('/leaderboard')
                    ? 'bg-navy-800 text-white border-l-2 border-brand-red'
                    : 'text-navy-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                Leaderboard
              </Link>

              {(user.isAdmin || user.is_admin) && (
                <Link
                  to="/admin/questions"
                  onClick={() => setIsOpen(false)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold text-brand-red transition ${
                    isActive('/admin')
                      ? 'bg-navy-800 border-l-2 border-brand-red'
                      : 'hover:bg-navy-900'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          )}

          <div className="border-t border-navy-800 pt-3 flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-xs text-navy-300">
                  Signed in as <span className="font-semibold text-white">{user.name}</span>
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 rounded-lg border border-navy-600 text-xs font-semibold text-navy-300 hover:border-brand-red hover:text-white transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-navy-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 bg-brand-red text-white text-xs font-bold rounded-lg hover:bg-brand-red-hover transition"
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
