import React from 'react';

export default function ProgressBar({ current = 0, total = 0, color = '#ef4444', height = 'h-2', showLabel = false }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {showLabel && (
          <span className="text-xs text-navy-400 font-medium">
            Progress: <span className="text-white">{current}</span> / <span className="text-navy-300">{total}</span>
          </span>
        )}
        <span className="text-xs font-semibold text-navy-300 ml-auto">{percentage}%</span>
      </div>
      <div className={`w-full bg-navy-700 rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
