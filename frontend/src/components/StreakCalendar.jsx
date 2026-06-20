import React from 'react';

export default function StreakCalendar({ calendar }) {
  if (!calendar || calendar.length === 0) {
    return <div className="text-navy-500 text-sm">No activity records.</div>;
  }

  // Format date helper: "Jan 12"
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCellColor = (solved) => {
    if (solved === 0) return 'bg-navy-800 border border-navy-700/50';
    if (solved <= 4) return 'bg-red-900/40 text-red-300 border border-red-800/40';
    if (solved <= 9) return 'bg-red-600/40 text-red-200 border border-red-500/40';
    return 'bg-red-600 text-white font-bold';
  };

  return (
    <div className="bg-navy-850 border border-navy-800 rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Solve History</h3>
        <span className="text-[10px] text-navy-400 font-medium">Last 30 Days</span>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 items-center justify-start">
        {calendar.map((day, idx) => {
          const colorClass = getCellColor(day.solved);
          return (
            <div
              key={idx}
              className={`aspect-square w-full rounded-lg flex items-center justify-center text-xs transition-all relative group cursor-help ${colorClass}`}
            >
              {day.solved > 0 ? day.solved : ''}
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-navy-950 border border-navy-700 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 shadow-lg">
                {formatDate(day.date)} — {day.solved} solved
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-5 text-[10px] text-navy-400 font-semibold items-center justify-end">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-navy-800 border border-navy-700/50" title="0 solved" />
          <div className="w-3.5 h-3.5 rounded bg-red-900/40 border border-red-800/40" title="1-4 solved" />
          <div className="w-3.5 h-3.5 rounded bg-red-600/40 border border-red-500/40" title="5-9 solved" />
          <div className="w-3.5 h-3.5 rounded bg-red-600" title="10+ solved" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
