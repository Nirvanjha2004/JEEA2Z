import React from 'react';

const BlankInput = ({ id, value, onChange, status, correctValue, placeholder }) => {
  // status: null | 'correct' | 'wrong'
  
  const getStyles = () => {
    const base = "bg-transparent border-b-2 text-center text-lg font-medium w-32 py-1 transition-all duration-150 outline-none";
    
    if (status === 'correct') 
      return `${base} border-[var(--success)] text-[var(--success)]`;
    if (status === 'wrong') 
      return `${base} border-[var(--danger)] text-[var(--danger)]`;
    
    return `${base} border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent)]`;
  };

  return (
    <div className="inline-flex flex-col items-center mx-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder || "___"}
        className={getStyles()}
        disabled={status !== null}
      />
      {status === 'wrong' && (
        <span className="text-xs text-[var(--success)] mt-1">
          Correct: {correctValue}
        </span>
      )}
    </div>
  );
};

export default BlankInput;
