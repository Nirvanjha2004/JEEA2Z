import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCommandStore from '../store/commandStore';
import useTheme from '../hooks/useTheme';
import api from '../api';
import {
  Sparkles,
  BookOpen,
  Bookmark,
  Trophy,
  Settings,
  LogOut,
  Atom,
  FlaskConical,
  Binary,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { togglePalette } = useCommandStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile drawer collapse state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Subject sub-menus states
  const [expanded, setExpanded] = useState({
    physics: false,
    chemistry: false,
    math: false,
  });
  const [chapters, setChapters] = useState({
    physics: [],
    chemistry: [],
    math: [],
  });

  // Dark/Light theme state
  const { theme, toggleTheme } = useTheme();

  const toggleSubject = async (slug) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
    if (chapters[slug].length === 0) {
      try {
        const res = await api.get(`/api/subjects/${slug}/chapters`);
        setChapters((prev) => ({ ...prev, [slug]: res.data.data || [] }));
      } catch (err) {
        console.error(`Failed to load chapters for ${slug}:`, err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItemClass = (path) =>
    `flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-md transition-all-150 ${
      isActive(path)
        ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
        : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
    }`;

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-bg-surface border-r border-border-default select-none">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border-default shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2 text-[14px] font-semibold text-text-primary tracking-tight">
          <span className="w-2 h-4.5 bg-accent rounded-[3px]"></span>
          JEE Sheet
        </Link>
        <button
          onClick={togglePalette}
          className="flex items-center justify-center p-1.5 rounded-md hover:bg-bg-subtle text-text-muted hover:text-text-primary cursor-pointer transition-colors"
          title="Open search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default shrink-0">
        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-[13px] font-semibold shrink-0">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.name?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[12.5px] font-medium text-text-primary truncate">{user?.name}</h4>
          <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
        </div>
      </div>

      {/* Main Nav Items Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-5">
        {/* Overview Category */}
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[10px] uppercase font-semibold text-text-muted px-3 mb-1.5 tracking-wider">
            Overview
          </h4>
          <Link to="/dashboard" className={navItemClass('/dashboard')}>
            <span className="text-[15px]">🏠</span>
            Dashboard
          </Link>
          <Link to="/revision" className={navItemClass('/revision')}>
            <span className="text-[15px]">🔁</span>
            Revision Queue
          </Link>
        </div>

        {/* Subjects Category */}
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[10px] uppercase font-semibold text-text-muted px-3 mb-1.5 tracking-wider">
            Subjects
          </h4>

          {/* Physics */}
          <div>
            <button
              onClick={() => toggleSubject('physics')}
              className={`w-full flex items-center justify-between text-left px-3 py-2 text-[13px] font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary cursor-pointer`}
            >
              <span className="flex items-center gap-3">
                <Atom className="w-4 h-4 text-sky-400" />
                Physics
              </span>
              {expanded.physics ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expanded.physics && (
              <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5 border-l border-border-default/50 ml-5 mt-0.5 animate-slide-in">
                <Link to="/sheet/physics" className="text-[12px] py-1 text-text-secondary hover:text-text-primary truncate">
                  • View All Questions
                </Link>
                {chapters.physics.map((c) => (
                  <Link
                    key={c.id}
                    to={`/sheet/physics/${c.id}`}
                    className={`text-[12px] py-1 text-text-secondary hover:text-text-primary truncate ${
                      isActive(`/sheet/physics/${c.id}`) ? 'text-accent font-semibold' : ''
                    }`}
                  >
                    • {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Chemistry */}
          <div>
            <button
              onClick={() => toggleSubject('chemistry')}
              className={`w-full flex items-center justify-between text-left px-3 py-2 text-[13px] font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary cursor-pointer`}
            >
              <span className="flex items-center gap-3">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Chemistry
              </span>
              {expanded.chemistry ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expanded.chemistry && (
              <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5 border-l border-border-default/50 ml-5 mt-0.5 animate-slide-in">
                <Link to="/sheet/chemistry" className="text-[12px] py-1 text-text-secondary hover:text-text-primary truncate">
                  • View All Questions
                </Link>
                {chapters.chemistry.map((c) => (
                  <Link
                    key={c.id}
                    to={`/sheet/chemistry/${c.id}`}
                    className={`text-[12px] py-1 text-text-secondary hover:text-text-primary truncate ${
                      isActive(`/sheet/chemistry/${c.id}`) ? 'text-accent font-semibold' : ''
                    }`}
                  >
                    • {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Math */}
          <div>
            <button
              onClick={() => toggleSubject('math')}
              className={`w-full flex items-center justify-between text-left px-3 py-2 text-[13px] font-medium rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary cursor-pointer`}
            >
              <span className="flex items-center gap-3">
                <Binary className="w-4 h-4 text-amber-400" />
                Mathematics
              </span>
              {expanded.math ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expanded.math && (
              <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5 border-l border-border-default/50 ml-5 mt-0.5 animate-slide-in">
                <Link to="/sheet/math" className="text-[12px] py-1 text-text-secondary hover:text-text-primary truncate">
                  • View All Questions
                </Link>
                {chapters.math.map((c) => (
                  <Link
                    key={c.id}
                    to={`/sheet/math/${c.id}`}
                    className={`text-[12px] py-1 text-text-secondary hover:text-text-primary truncate ${
                      isActive(`/sheet/math/${c.id}`) ? 'text-accent font-semibold' : ''
                    }`}
                  >
                    • {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tools Category */}
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[10px] uppercase font-semibold text-text-muted px-3 mb-1.5 tracking-wider">
            Tools
          </h4>
          <Link to="/bookmarks" className={navItemClass('/bookmarks')}>
            <span className="text-[15px]">🔖</span>
            Bookmarks
          </Link>
          <Link to="/mock-test" className={navItemClass('/mock-test')}>
            <span className="text-[15px]">🧪</span>
            Mock Tests
          </Link>
          <Link to="/leaderboard" className={navItemClass('/leaderboard')}>
            <span className="text-[15px]">🏆</span>
            Leaderboard
          </Link>
          <Link to="/feedback" className={navItemClass('/feedback')}>
            <span className="text-[15px]">💬</span>
            Feedback
          </Link>
          {user?.is_admin && (
            <Link to="/admin" className={navItemClass('/admin')}>
              <span className="text-[15px]">⚙️</span>
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-3 border-t border-border-default shrink-0 flex flex-col gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2 text-[12.5px] text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-md cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="text-[10px] text-text-muted">Toggle</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-[12.5px] text-danger hover:bg-danger-bg rounded-md cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-border-default bg-bg-surface z-40 flex items-center justify-between px-4 select-none">
        <Link to="/dashboard" className="text-[14px] font-semibold text-text-primary flex items-center gap-1.5">
          <span className="w-2 h-4 bg-accent rounded-[2px] inline-block"></span>
          JEE Sheet
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePalette}
            className="p-1.5 text-text-muted hover:text-text-primary"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 text-text-muted hover:text-text-primary"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Left side, fixed width) */}
      <aside className="hidden md:block w-[220px] h-screen sticky top-0 shrink-0 select-none">
        {renderNavContent()}
      </aside>

      {/* Mobile Sidebar overlay drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-45 flex animate-slide-in">
          <div className="w-[240px] h-full" onClick={() => setIsMobileOpen(false)}>
            {renderNavContent()}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setIsMobileOpen(false)}></div>
        </div>
      )}

      {/* Spacer to push main content below mobile top bar */}
      <div className="md:hidden h-14 w-full"></div>
    </>
  );
};

export default Sidebar;
