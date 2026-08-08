import React from 'react';

export default function Card({ children, className = '', hoverable = true, ...props }) {
  return (
    <div
      className={`bg-f1-card text-f1-dark rounded-2xl p-6 shadow-soft-outer border border-f1-border transition-all duration-300 ${
        hoverable ? 'hover:shadow-soft-outer-hover hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
