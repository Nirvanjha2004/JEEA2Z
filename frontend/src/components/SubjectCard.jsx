import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

export default function SubjectCard({ subject }) {
  const { name, slug, total = 0, done = 0, color = '#ef4444' } = subject;

  return (
    <Link
      to={`/sheet/${slug}`}
      className="block bg-navy-800 hover:bg-navy-800/90 border border-navy-700 hover:border-navy-500 rounded-xl p-6 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white group-hover:text-brand-red transition-colors flex items-center gap-2">
          <span
            className="w-2 h-4 rounded-sm inline-block"
            style={{ backgroundColor: color }}
          ></span>
          {name}
        </h3>
        <span className="text-xs font-semibold text-navy-400 group-hover:text-navy-300 transition-colors">
          View Sheet &rarr;
        </span>
      </div>

      <ProgressBar current={done} total={total} color={color} showLabel={true} />
    </Link>
  );
}
