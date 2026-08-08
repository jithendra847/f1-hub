import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  Calendar,
  Trophy,
  Users,
  Shield,
  MapPin,
  BarChart2,
  GitCompare,
  Wrench,
  Newspaper,
  Search,
  Flag,
  ChevronRight
} from 'lucide-react';

export default function NavigationOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Close overlay on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { to: '/', label: 'Home', desc: 'Overview & 2026 Hero Slideshow', icon: Home },
    { to: '/calendar', label: '2026 Calendar', desc: 'Official Grand Prix schedule', icon: Calendar },
    { to: '/standings', label: 'Championship Standings', desc: 'Driver & Constructor rankings', icon: Trophy },
    { to: '/drivers', label: 'Drivers Lineup', desc: 'Grid driver profiles & stats', icon: Users },
    { to: '/constructors', label: 'Teams & Constructors', desc: 'Formula 1 team specifications', icon: Shield },
    { to: '/circuits', label: '2D Circuits Directory', desc: 'Interactive vector track maps', icon: MapPin },
    { to: '/statistics', label: 'Analytics & Progression', desc: 'Points progression charts', icon: BarChart2 },
    { to: '/compare', label: 'Head-to-Head Compare', desc: 'Driver vs Driver metrics', icon: GitCompare },
    { to: '/technical', label: 'Technical Upgrades', desc: 'Verified component upgrades', icon: Wrench },
    { to: '/news', label: 'News Feed', desc: 'Aggregated verified RSS news', icon: Newspaper },
    { to: '/search', label: 'Global Search', desc: 'Search drivers, teams, circuits', icon: Search },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-f1-bg/95 text-f1-dark backdrop-blur-2xl transition-all duration-200 animate-in fade-in">
      {/* Top Header Controls Bar inside Overlay */}
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 flex items-center justify-between border-b border-f1-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-f1-red text-white rounded-xl shadow-accent-glow">
            <Flag className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-f1-dark">
            F1 <span className="text-f1-red">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Close Menu Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-f1-red text-white shadow-accent-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 font-bold text-xs uppercase"
            title="Close Navigation Overlay"
          >
            <X className="w-5 h-5" /> Close
          </button>
        </div>
      </div>

      {/* Main Navigation Links Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col justify-center">
        <div className="px-2 mb-6">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-f1-red block">NAVIGATION DIRECTORY</span>
          <h3 className="text-2xl font-black text-f1-dark mt-1">Explore Formula 1 2026</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'bg-f1-red text-white border-f1-red shadow-accent-glow'
                      : 'bg-f1-card text-f1-dark border-f1-border shadow-soft-outer hover:shadow-soft-outer-hover hover:-translate-y-0.5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-f1-bg text-f1-red border border-f1-border'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-base font-extrabold transition-colors ${isActive ? 'text-white' : 'text-f1-dark group-hover:text-f1-red'}`}>
                          {item.label}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-f1-muted'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isActive ? 'text-white' : 'text-f1-muted'}`} />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer info inside overlay */}
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 border-t border-f1-border text-xs text-f1-muted flex justify-between items-center">
        <span>© 2026 F1 Hub — Multi-Provider Data Engine</span>
        <span>Press <kbd className="px-2 py-0.5 bg-f1-card rounded border border-f1-border text-[10px] font-mono text-f1-dark">ESC</kbd> to close</span>
      </div>
    </div>
  );
}
