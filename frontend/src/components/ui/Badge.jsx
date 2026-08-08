import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-f1-card text-f1-dark border border-f1-border shadow-soft-outer-sm',
    live: 'bg-f1-red text-white shadow-accent-glow animate-pulse',
    upcoming: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    verified: 'bg-emerald-600 text-white shadow-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
