import React from 'react';
import { DIFFICULTY_COLORS } from '../utils/constants';

export default function DifficultyBadge({ difficulty }) {
  const diff = difficulty?.toLowerCase() || 'easy';
  const colors = DIFFICULTY_COLORS[diff] || DIFFICULTY_COLORS.easy;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {diff.charAt(0).toUpperCase() + diff.slice(1)}
    </span>
  );
}
