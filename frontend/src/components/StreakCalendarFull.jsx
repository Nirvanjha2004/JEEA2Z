import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import Tooltip from './ui/Tooltip';
import Button from './ui/Button';

export default function StreakCalendarFull({ calendar = [], dailyGoal = 10, onDayClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { theme } = useTheme();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar days helper
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getStartDayOfWeek = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfWeek(year, month);

  // Map calendar solves for quick lookup
  const solvesMap = new Map();
  calendar.forEach((c) => {
    // Format date string to match YYYY-MM-DD
    solvesMap.set(c.date, c.solved);
  });

  const getCellColor = (solved, isFuture) => {
    if (isFuture) return 'bg-transparent text-text-disabled cursor-not-allowed';
    if (solved === 0) return 'bg-bg-elevated text-text-muted hover:bg-bg-subtle border border-border-default/30';
    
    // Solves ranges mapping
    if (solved <= 4) {
      return theme === 'dark'
        ? 'bg-[#7f1d1d] text-rose-100 hover:opacity-90 border border-red-900/50'
        : 'bg-[#fecaca] text-[#991b1b] hover:opacity-90 border border-[#fca5a5]';
    }
    if (solved <= 9) {
      return theme === 'dark'
        ? 'bg-[#e11d48] text-white hover:opacity-90 border border-rose-900/50'
        : 'bg-[#f43f5e] text-white hover:opacity-90 border border-[#fda4af]';
    }
    return theme === 'dark'
      ? 'bg-[#f97316] text-white hover:opacity-90 border border-orange-950/50'
      : 'bg-[#fb923c] text-white hover:opacity-90 border border-[#fed7aa]';
  };

  // Build grid cells
  const cells = [];

  // 1. Previous month padding days
  for (let i = 0; i < startDay; i++) {
    cells.push({ isPadding: true, key: `pad-start-${i}` });
  }

  // 2. Active days of month
  const todayDate = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const solved = solvesMap.get(dateStr) || 0;
    
    const cellDate = new Date(year, month, d);
    const isFuture = cellDate.getTime() > todayDate.getTime() && cellDate.getDate() !== todayDate.getDate();
    
    const isToday =
      todayDate.getFullYear() === year &&
      todayDate.getMonth() === month &&
      todayDate.getDate() === d;

    cells.push({
      dayNum: d,
      dateStr,
      solved,
      isToday,
      isFuture,
      isPadding: false,
      key: `day-${d}`,
    });
  }

  // 3. Next month padding days to make full rows of 7
  const totalCells = Math.ceil(cells.length / 7) * 7;
  const paddingEnd = totalCells - cells.length;
  for (let i = 0; i < paddingEnd; i++) {
    cells.push({ isPadding: true, key: `pad-end-${i}` });
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 w-full select-none text-left flex flex-col gap-4 animate-slide-in">
      
      {/* Header controls & legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-3.5">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-[13.5px] font-semibold text-text-primary uppercase tracking-wider">
              Streak Calendar
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              {monthName} {year}
            </p>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <Button
              variant="ghost"
              size="compact"
              className="w-7 h-7 p-0 flex items-center justify-center rounded-md"
              onClick={handlePrevMonth}
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </Button>
            <Button
              variant="ghost"
              size="compact"
              className="h-7 text-[11px] px-2.5 font-medium rounded-md"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="compact"
              className="w-7 h-7 p-0 flex items-center justify-center rounded-md"
              onClick={handleNextMonth}
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-2 text-[10px] text-text-muted font-medium items-center self-start sm:self-auto select-none">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-bg-elevated border border-border-default/50" />
            <div className={`w-2.5 h-2.5 rounded-[2px] ${theme === 'dark' ? 'bg-[#7f1d1d]' : 'bg-[#fecaca]'}`} />
            <div className={`w-2.5 h-2.5 rounded-[2px] ${theme === 'dark' ? 'bg-[#e11d48]' : 'bg-[#f43f5e]'}`} />
            <div className={`w-2.5 h-2.5 rounded-[2px] ${theme === 'dark' ? 'bg-[#f97316]' : 'bg-[#fb923c]'}`} />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="w-full">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center font-medium text-text-muted text-[11px] uppercase tracking-wider py-1 select-none border-b border-border-default/40">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Grid body */}
        <div className="grid grid-cols-7 gap-1 mt-1.5">
          {cells.map((cell) => {
            if (cell.isPadding) {
              return <div key={cell.key} className="aspect-square bg-transparent" />;
            }

            const { dayNum, dateStr, solved, isToday, isFuture } = cell;

            const cellColorClass = getCellColor(solved, isFuture);
            const showFlame = solved > 0 && !isFuture;

            const dateLabel = `${monthName.slice(0, 3)} ${dayNum}`;
            const tooltipContent = isFuture
              ? `${dateLabel} — Future date`
              : solved > 0
              ? `${dateLabel} — ${solved} solved ${solved >= dailyGoal ? '🔥 Streak active!' : ''}`
              : `${dateLabel} — No activity`;

            const elementClass = `aspect-square rounded-md flex items-center justify-center text-xs font-semibold relative transition-all duration-150 ${cellColorClass} ${
              isToday && !isFuture ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-surface' : ''
            }`;

            const handleCellClick = () => {
              if (isFuture || !onDayClick) return;
              onDayClick(dateStr, solved);
            };

            return (
              <Tooltip key={cell.key} content={tooltipContent}>
                <div
                  onClick={handleCellClick}
                  className={elementClass}
                  style={{ cursor: isFuture ? 'not-allowed' : 'pointer' }}
                >
                  <span>{dayNum}</span>

                  {/* Flame overlay */}
                  {showFlame && (
                    <span className="absolute top-0.5 right-0.5 text-[9px]" title="Streak Day">
                      🔥
                    </span>
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
