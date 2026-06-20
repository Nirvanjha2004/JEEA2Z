import React from 'react';

export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`skeleton bg-bg-subtle rounded-md ${className}`}
      {...props}
    />
  );
}
export { Skeleton };
