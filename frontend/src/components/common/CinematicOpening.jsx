import React, { useEffect } from 'react';
import { ChevronRight, ArrowDown, X, Film, Archive, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CinematicOpening({ onEnterGrid, isEmbedded = false }) {
  const navigate = useNavigate();

  const localVideoPath = "/videos/A Beginner's Guide To Formula 1.mp4";
  const knowMoreUrl = "https://www.youtube.com/watch?v=JuEvK-zCqio&list=PLfoNZDHitwjVOVJpO2q7bb-fQb0PvVi5a";

  // Listen for Escape key press to close overlay when in modal mode
  useEffect(() => {
    if (isEmbedded) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEnterGrid) {
        onEnterGrid();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEmbedded, onEnterGrid]);

  const navigateToHistory = () => {
    if (!isEmbedded && onEnterGrid) {
      onEnterGrid();
    }
    navigate('/history');
  };

  const containerStyle = isEmbedded
    ? 'relative w-full min-h-[100svh] bg-black overflow-hidden flex flex-col justify-between p-4 md:p-8 select-none border-b border-white/10'
    : 'fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center overflow-y-auto p-4 font-sans select-none animate-in fade-in duration-300';

  const innerStyle = isEmbedded
    ? 'relative w-full h-full flex flex-col justify-between z-10 max-w-6xl mx-auto'
    : 'relative w-full max-w-5xl bg-neutral-950 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/15 rounded-2xl p-4 sm:p-6 md:p-8 my-auto z-10';

  return (
    <div className={containerStyle}>
      <div className={innerStyle}>
        
        {/* Top Controls: Header Badge & Close Button */}
        <div className="relative z-20 flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Film className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              A BEGINNER'S GUIDE TO FORMULA 1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={knowMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-600 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Want to Know More? Watch Full Series on YouTube"
            >
              <ExternalLink className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline text-[10px] uppercase">Want to Know More?</span>
            </a>

            {!isEmbedded && (
              <button
                onClick={onEnterGrid}
                className="p-2.5 rounded-full bg-red-600 text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold uppercase px-4"
                title="Close Intro Showcase"
              >
                <X className="w-4 h-4" /> Close
              </button>
            )}
          </div>
        </div>

        {/* Embedded HTML5 Video Player */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-black my-2 group">
          <video
            src={localVideoPath}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Center/Bottom Content & Call to Actions */}
        <div className="relative z-20 flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto pt-4">
          
          {/* Typography */}
          <div className="space-y-1">
            <h2 className="text-xs md:text-sm font-extrabold tracking-[0.35em] uppercase text-red-500">
              OFFICIAL FORMULA 1 INTRO SHOWCASE
            </h2>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase drop-shadow-2xl px-4">
              A BEGINNER'S GUIDE TO FORMULA 1
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={knowMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Want to Know More?
            </a>

            <button
              onClick={navigateToHistory}
              className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Archive className="w-4 h-4" /> Historical Archive <ChevronRight className="w-4 h-4" />
            </button>

            {isEmbedded && (
              <button
                onClick={onEnterGrid}
                className="group flex items-center gap-2 text-white/90 bg-white/5 hover:bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/30 transition-all"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Enter 2026 Hub</span>
                <div className="p-1 rounded-full bg-red-600 group-hover:scale-110 transition-all">
                  <ArrowDown className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
