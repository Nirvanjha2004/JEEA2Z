import React from 'react';
import Badge from './ui/Badge';

export default function TypeBadge({ type }) {
  const t = type?.toLowerCase() || 'concept';
  const displayLabel = t === 'pyq' ? 'PYQ' : t.charAt(0).toUpperCase() + t.slice(1);
  return <Badge type={t}>{displayLabel}</Badge>;
}
