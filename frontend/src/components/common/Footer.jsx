import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-f1-card border-t border-f1-border shadow-soft-outer py-6 px-4 md:px-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-f1-muted">
        <div>
          <p>© 2026 F1 Hub. All rights reserved.</p>
          <p className="mt-0.5">Not affiliated with Formula One World Championship Limited.</p>
        </div>
        <div className="flex items-center gap-4 font-semibold">
          <span>Data Sources: Jolpica, FastF1, OpenF1</span>
          <span>•</span>
          <span>F1 Hub Engine</span>
        </div>
      </div>
    </footer>
  );
}
