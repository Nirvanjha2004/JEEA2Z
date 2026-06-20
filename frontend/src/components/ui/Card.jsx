import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-bg-surface border border-border-default rounded-lg p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
