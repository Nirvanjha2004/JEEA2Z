import React from 'react';

export const SkeletonRow = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-border-default/50 skeleton">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-3">
          <div className="h-4 bg-bg-subtle rounded-md w-full"></div>
        </td>
      ))}
    </tr>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 skeleton flex flex-col gap-3">
      <div className="h-5 bg-bg-subtle rounded-md w-2/3"></div>
      <div className="h-3 bg-bg-subtle rounded-md w-full"></div>
      <div className="h-3 bg-bg-subtle rounded-md w-1/2"></div>
    </div>
  );
};

export const SkeletonStats = () => {
  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 skeleton flex flex-col gap-2">
      <div className="h-4 bg-bg-subtle rounded-md w-1/3"></div>
      <div className="h-8 bg-bg-subtle rounded-md w-2/3"></div>
    </div>
  );
};
