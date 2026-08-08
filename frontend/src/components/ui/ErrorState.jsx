import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Unable to load data',
  message = 'An unexpected error occurred while fetching Formula 1 information.',
  onRetry,
}) {
  return (
    <div className="bg-f1-card text-f1-dark rounded-2xl p-8 shadow-soft-outer border border-f1-red/30 text-center max-w-md mx-auto space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-f1-red/10 text-f1-red flex items-center justify-center mx-auto shadow-soft-outer border border-f1-red/20">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-f1-dark">{title}</h3>
        <p className="text-xs text-f1-muted mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="accent" size="sm" onClick={onRetry} className="mx-auto mt-2">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </Button>
      )}
    </div>
  );
}
