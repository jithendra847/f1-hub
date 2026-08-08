import React from 'react';
import { Info } from 'lucide-react';

export default function EmptyState({
  title = 'Data unavailable',
  message = 'No records match your request.',
}) {
  return (
    <div className="bg-f1-card text-f1-dark rounded-2xl p-8 shadow-soft-outer border border-f1-border text-center max-w-md mx-auto space-y-3">
      <div className="w-10 h-10 rounded-xl bg-f1-bg text-f1-muted flex items-center justify-center mx-auto shadow-soft-inset border border-f1-border">
        <Info className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-base font-extrabold text-f1-dark">{title}</h4>
        <p className="text-xs text-f1-muted mt-1">{message}</p>
      </div>
    </div>
  );
}
