import React from 'react';

export default function StreakCalendar({ calendar }) {
  if (!calendar || calendar.length === 0) {
    return <div className="text-text-muted text-[12px] italic">No activity records found.</div>;
  }

  // Format date helper: "Jan 12"
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCellColor = (solved) => {
    if (solved === 0) return 'bg-bg-elevated border border-border-default/50';
    if (solved <= 4) return 'bg-[#7f1d1d] border border-[#991b1b]/50 text-red-200';
    if (solved <= 9) return 'bg-[#e11d48] border border-[#be123c]/50 text-rose-100';
    return 'bg-[#f97316] border border-[#ea580c]/50 text-orange-50';
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 w-full select-none text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">
            Solve Heatmap
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">Your daily activity over the last 30 days.</p>
        </div>
        <span className="text-[10px] text-text-muted font-medium bg-bg-elevated border border-border-default px-2 py-0.5 rounded">
          Last 30 Days
        </span>
      </div>

      <div className="flex flex-wrap gap-1 items-center justify-start max-w-full">
        {calendar.map((day, idx) => {
          const colorClass = getCellColor(day.solved);
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-[2px] transition-all duration-150 relative group cursor-help shrink-0 ${colorClass}`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-bg-elevated border border-border-default text-text-primary text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-10 shadow-xl leading-none">
                {formatDate(day.date)}: {day.solved} solved
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-4 text-[10px] text-text-muted font-medium items-center justify-end">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[1.5px] bg-bg-elevated border border-border-default/50" title="0 solved" />
          <div className="w-3 h-3 rounded-[1.5px] bg-[#7f1d1d]" title="1-4 solved" />
          <div className="w-3 h-3 rounded-[1.5px] bg-[#e11d48]" title="5-9 solved" />
          <div className="w-3 h-3 rounded-[1.5px] bg-[#f97316]" title="10+ solved" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
