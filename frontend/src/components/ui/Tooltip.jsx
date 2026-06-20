import React, { useState } from 'react';

export default function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-bg-elevated border border-border-default text-text-primary text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-50 shadow-md pointer-events-none animate-slide-in">
          {content}
        </div>
      )}
    </div>
  );
}
export { Tooltip };
