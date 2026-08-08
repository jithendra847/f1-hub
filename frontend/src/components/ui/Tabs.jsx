import React from 'react';

export default function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 p-1.5 rounded-2xl bg-f1-card border border-f1-border shadow-soft-inset ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'bg-f1-red text-white shadow-accent-glow'
                : 'text-f1-muted hover:text-f1-dark hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
