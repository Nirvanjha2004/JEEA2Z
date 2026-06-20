import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useCommandStore from '../store/commandStore';
import api from '../api';
import { Search, Command, BookOpen, Bookmark, Trophy, Sparkles, AlertCircle } from 'lucide-react';

const CommandPalette = () => {
  const { isOpen, closePalette } = useCommandStore();
  const [queryText, setQueryText] = useState('');
  const [chapters, setChapters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Default jump links
  const defaultItems = [
    { type: 'link', label: 'Dashboard', path: '/dashboard', icon: Sparkles, category: 'Jump to' },
    { type: 'link', label: 'Physics Sheet', path: '/sheet/physics', icon: BookOpen, category: 'Jump to' },
    { type: 'link', label: 'Chemistry Sheet', path: '/sheet/chemistry', icon: BookOpen, category: 'Jump to' },
    { type: 'link', label: 'Math Sheet', path: '/sheet/math', icon: BookOpen, category: 'Jump to' },
    { type: 'link', label: 'Bookmarks', path: '/bookmarks', icon: Bookmark, category: 'Jump to' },
    { type: 'link', label: 'Revision Queue', path: '/revision', icon: Sparkles, category: 'Jump to' },
    { type: 'link', label: 'Start Mock Test', path: '/mock-test', icon: Trophy, category: 'Quick actions' },
    { type: 'link', label: 'View Leaderboard', path: '/leaderboard', icon: Trophy, category: 'Quick actions' },
  ];

  // Fetch chapters on mount or when opened
  useEffect(() => {
    if (!isOpen) return;

    const fetchChapters = async () => {
      try {
        const [phys, chem, math] = await Promise.all([
          api.get('/api/subjects/physics/chapters'),
          api.get('/api/subjects/chemistry/chapters'),
          api.get('/api/subjects/math/chapters'),
        ]);

        const allChapters = [
          ...(phys.data?.data || []).map((c) => ({ ...c, subjectSlug: 'physics', subjectName: 'Physics' })),
          ...(chem.data?.data || []).map((c) => ({ ...c, subjectSlug: 'chemistry', subjectName: 'Chemistry' })),
          ...(math.data?.data || []).map((c) => ({ ...c, subjectSlug: 'math', subjectName: 'Math' })),
        ];
        setChapters(allChapters);
      } catch (err) {
        console.error('Failed to load chapters for command palette:', err);
      }
    };

    fetchChapters();
    setQueryText('');
    setSelectedIndex(0);

    // Autofocus input
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useCommandStore.getState().togglePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter items based on input
  const filteredChapters = queryText.trim() === ''
    ? []
    : chapters.filter((c) =>
        c.name.toLowerCase().includes(queryText.toLowerCase())
      );

  const displayedItems = queryText.trim() === ''
    ? defaultItems
    : filteredChapters.map((c) => ({
        type: 'chapter',
        label: `${c.name} (${c.subjectName})`,
        path: `/sheet/${c.subjectSlug}/${c.id}`,
        icon: BookOpen,
        category: 'Chapters',
      }));

  // Keyboard navigation inside the palette
  useEffect(() => {
    const handleNav = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % displayedItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + displayedItems.length) % displayedItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (displayedItems[selectedIndex]) {
          handleSelect(displayedItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [isOpen, displayedItems, selectedIndex]);

  const handleSelect = (item) => {
    navigate(item.path);
    closePalette();
  };

  if (!isOpen) return null;

  // Group displayed items by category
  const categories = {};
  displayedItems.forEach((item, index) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push({ ...item, globalIndex: index });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closePalette}
      ></div>

      {/* Palette Container */}
      <div className="relative w-full max-w-[550px] bg-bg-surface border border-border-default rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[400px] animate-slide-in text-text-primary">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-border-default h-12 bg-bg-surface">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search questions, chapters..."
            value={queryText}
            onChange={(e) => {
              setQueryText(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-0 outline-none text-[13.5px] text-text-primary placeholder-text-muted h-full"
          />
          <div className="flex items-center gap-0.5 border border-border-muted bg-bg-subtle rounded px-1.5 py-0.5 text-[10px] text-text-muted font-mono shrink-0">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <AlertCircle className="w-5 h-5 text-text-muted mb-2" />
              <p className="text-[13px] font-medium text-text-primary">No results found</p>
              <p className="text-[11px] text-text-secondary mt-0.5">Try searching for a different chapter name.</p>
            </div>
          ) : (
            Object.keys(categories).map((catName) => (
              <div key={catName} className="mb-3 last:mb-0">
                <h4 className="text-[10px] uppercase font-semibold tracking-wider text-text-muted px-3 py-1.5">
                  {catName}
                </h4>
                <div className="flex flex-col gap-0.5">
                  {categories[catName].map((item) => {
                    const isSelected = item.globalIndex === selectedIndex;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.globalIndex}
                        onClick={() => handleSelect(item)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 ${
                          isSelected
                            ? 'bg-bg-elevated text-text-primary border-l-2 border-l-accent'
                            : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-accent' : 'text-text-muted'}`} />
                        <span className="text-[13px] font-medium flex-1 truncate">{item.label}</span>
                        {isSelected && (
                          <span className="text-[10px] text-text-muted font-mono">Enter</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border-default bg-bg-subtle/50 text-[10.5px] text-text-muted flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5">
            <span>Use</span>
            <span className="border border-border-muted bg-bg-elevated rounded px-1 font-mono text-[9px]">↓↑</span>
            <span>to navigate</span>
            <span className="ml-1">and</span>
            <span className="border border-border-muted bg-bg-elevated rounded px-1 font-mono text-[9px]">Enter</span>
            <span>to select</span>
          </div>
          <span className="text-text-muted/70">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
