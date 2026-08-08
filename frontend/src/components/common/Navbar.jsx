import React, { useState } from 'react';
import { Flag, Search, Menu, X, Film } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import NavigationOverlay from './NavigationOverlay';

export default function Navbar({ onReplayIntro }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-f1-card/80 backdrop-blur-md border-b border-f1-border shadow-soft-outer py-3 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Left: Collapsed Menu Toggle Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl bg-f1-card shadow-soft-outer border border-f1-border text-f1-dark hover:text-f1-red hover:shadow-soft-outer-hover transition-all flex items-center gap-2 group"
              title={menuOpen ? "Close Menu" : "Open Menu"}
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-f1-red" />
              ) : (
                <Menu className="w-5 h-5 text-f1-dark group-hover:text-f1-red" />
              )}
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-f1-dark group-hover:text-f1-red">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2.5 bg-f1-red text-white rounded-xl shadow-soft-outer group-hover:shadow-accent-glow transition-all duration-200">
                <Flag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-f1-dark">
                F1 <span className="text-f1-red">Hub</span>
              </span>
            </Link>
          </div>

          {/* Center: Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm mx-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drivers, teams, circuits..."
              icon={Search}
            />
          </form>

          {/* Right: Replay Intro Button */}
          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="px-3 py-1.5 rounded-xl bg-f1-card shadow-soft-outer border border-f1-border text-xs font-extrabold text-f1-dark hover:text-f1-red transition-all flex items-center gap-1.5"
                title="Watch 2026 Cinematic Opening"
              >
                <Film className="w-3.5 h-3.5 text-f1-red" />
                <span className="hidden sm:inline">Intro</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Navigation Directory Full-Screen Panel */}
      <NavigationOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
