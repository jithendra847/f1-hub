import React from 'react';

export default function Skeleton({ className = '', height = 'h-6', width = 'w-full' }) {
  return (
    <div
      className={`bg-f1-card border border-f1-border rounded-xl animate-pulse shadow-soft-inset ${height} ${width} ${className}`}
    />
  );
}
