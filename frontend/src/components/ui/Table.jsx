import React from 'react';

export default function Table({ headers = [], children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl shadow-soft-outer bg-f1-card border border-f1-border ${className}`}>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-f1-border text-xs font-bold uppercase tracking-wider text-f1-muted bg-black/5 dark:bg-white/5">
            {headers.map((head, idx) => (
              <th key={idx} className="py-3.5 px-4">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-f1-border text-sm text-f1-dark">
          {children}
        </tbody>
      </table>
    </div>
  );
}
