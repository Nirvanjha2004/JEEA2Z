import React from 'react';
import MathText from '../MathText';

const OptionButton = ({ optionKey, optionText, selected, status, onClick, disabled }) => {
  // status: null | 'correct' | 'wrong' | 'revealed-correct'
  
  const getStyles = () => {
    const base = "w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center gap-3";
    
    if (status === 'correct') 
      return `${base} bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)]`;
    if (status === 'wrong') 
      return `${base} bg-[var(--danger-bg)] border-[var(--danger)] text-[var(--danger)]`;
    if (status === 'revealed-correct') 
      return `${base} bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)] opacity-70`;
    if (selected) 
      return `${base} bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)]`;
    
    return `${base} bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-focus)]`;
  };

  return (
    <button 
      className={getStyles()}
      onClick={() => !disabled && onClick(optionKey)}
      disabled={disabled}
    >
      <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-sm font-mono font-medium flex-shrink-0">
        {optionKey}
      </span>
      <MathText className="text-sm" text={optionText} />
    </button>
  );
};

export default OptionButton;
