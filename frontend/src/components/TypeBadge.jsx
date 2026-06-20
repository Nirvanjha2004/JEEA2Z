import React from 'react';
import { TYPE_COLORS } from '../utils/constants';

export default function TypeBadge({ type }) {
  const t = type?.toLowerCase() || 'concept';
  const colors = TYPE_COLORS[t] || TYPE_COLORS.concept;

  const displayLabel = t === 'pyq' ? 'PYQ' : t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {displayLabel}
    </span>
  );
}
