import React from 'react';

export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`space-y-8 animate-in fade-in duration-200 ${className}`}>
      {children}
    </div>
  );
}
