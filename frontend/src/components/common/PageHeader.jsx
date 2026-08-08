import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-f1-border pb-5 ${className}`}>
      <div className="space-y-1">
        {badge && (
          <div className="mb-1.5">
            {badge}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-black text-f1-dark tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-8 bg-f1-red rounded-full inline-block" />
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-f1-muted font-medium pl-4">{subtitle}</p>
        )}
      </div>

      {action && (
        <div className="w-full sm:w-auto flex items-center gap-3 pt-2 sm:pt-0">
          {action}
        </div>
      )}
    </div>
  );
}
