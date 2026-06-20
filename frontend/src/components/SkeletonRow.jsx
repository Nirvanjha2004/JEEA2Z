import React from 'react';
import Skeleton from './ui/Skeleton';

export const SkeletonRow = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-border-default/50 skeleton">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 skeleton flex flex-col gap-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};

export const SkeletonStats = () => {
  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 skeleton flex flex-col gap-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
};
