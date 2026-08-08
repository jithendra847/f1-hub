import React from 'react';
import { NavLink } from 'react-router-dom';
import {
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
  Search
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/standings', label: 'Standings', icon: Trophy },
    { to: '/drivers', label: 'Drivers', icon: Users },
    { to: '/constructors', label: 'Teams', icon: Shield },
    { to: '/circuits', label: 'Circuits', icon: MapPin },
    { to: '/statistics', label: 'Analytics', icon: BarChart2 },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/technical', label: 'Technical', icon: Wrench },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/search', label: 'Search', icon: Search },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Navigation Drawer / Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-f1-card border-r border-f1-border p-6 flex flex-col justify-between shadow-soft-outer transition-all duration-300 md:translate-x-0 md:static md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="px-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-f1-muted">Navigation</h2>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-f1-red text-white shadow-accent-glow'
                        : 'text-f1-dark hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-soft-outer-sm'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-f1-border text-xs text-f1-muted px-2">
          <p className="font-bold text-f1-dark">Formula 1 2026</p>
          <p className="mt-0.5">Multi-Provider Data Engine</p>
        </div>
      </aside>
    </>
  );
}
