import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

export default function ChapterCard({ chapter, subjectSlug, color }) {
  const { id, name, order_index, question_count = 0, done_count = 0 } = chapter;

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 hover:border-navy-600 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-start gap-4 flex-1">
        {/* Circle order badge */}
        <div className="w-10 h-10 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center font-bold text-navy-300 text-sm shrink-0">
          {order_index}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-white truncate mb-1">
            {name}
          </h4>
          <span className="text-xs text-navy-400">
            {question_count} Questions
          </span>
        </div>
      </div>

      {/* Progress & Link */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto md:min-w-[280px]">
        <div className="flex-1 sm:max-w-[200px]">
          <ProgressBar current={done_count} total={question_count} color={color} height="h-1.5" />
        </div>
        <Link
          to={`/sheet/${subjectSlug}/${id}`}
          className="px-4 py-2 bg-navy-900 hover:bg-navy-950 border border-navy-700 text-sm font-semibold text-white rounded-lg hover:border-brand-red transition text-center shrink-0"
        >
          Open Chapter &rarr;
        </Link>
      </div>
    </div>
  );
}
