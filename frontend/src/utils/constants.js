export const SUBJECTS = [
  { name: 'Physics', slug: 'physics', color: '#3b82f6', bgColor: '#1e3a5f' },
  { name: 'Chemistry', slug: 'chemistry', color: '#22c55e', bgColor: '#1a3d2a' },
  { name: 'Math', slug: 'math', color: '#f59e0b', bgColor: '#3d2e0a' },
];

export const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-700' },
  medium: { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-700' },
  hard: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-700' },
};

export const TYPE_COLORS = {
  pyq: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700' },
  concept: { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-700' },
  practice: { bg: 'bg-slate-700/30', text: 'text-slate-400', border: 'border-slate-600' },
};

export const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', icon: '○' },
  { value: 'done', label: 'Done', icon: '✓' },
  { value: 'revisit', label: 'Revisit', icon: '↻' },
];
