import React from 'react';

export default function Badge({
  children,
  difficulty,
  type,
  className = '',
  ...props
}) {
  let badgeStyle = 'bg-bg-elevated border-border-default text-text-secondary';

  if (difficulty) {
    const diff = difficulty.toLowerCase();
    if (diff === 'easy') {
      badgeStyle = 'bg-diff-easy-bg text-diff-easy-text border-diff-easy-border';
    } else if (diff === 'medium') {
      badgeStyle = 'bg-diff-medium-bg text-diff-medium-text border-diff-medium-border';
    } else if (diff === 'hard') {
      badgeStyle = 'bg-diff-hard-bg text-diff-hard-text border-diff-hard-border';
    }
  } else if (type) {
    const t = type.toLowerCase();
    if (t === 'pyq') {
      badgeStyle = 'bg-type-pyq-bg text-type-pyq-text border-type-pyq-border';
    } else if (t === 'concept') {
      badgeStyle = 'bg-type-concept-bg text-type-concept-text border-type-concept-border';
    } else if (t === 'practice') {
      badgeStyle = 'bg-type-practice-bg text-type-practice-text border-type-practice-border';
    }
  }

  const content = children || (difficulty || type || '');
  const formattedContent =
    typeof content === 'string'
      ? content.charAt(0).toUpperCase() + content.slice(1)
      : content;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle} ${className}`}
      {...props}
    >
      {formattedContent}
    </span>
  );
}
