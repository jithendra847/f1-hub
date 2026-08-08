import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ErrorBoundary from '../components/common/ErrorBoundary';
import CinematicOpening from '../components/common/CinematicOpening';

export default function MainLayout() {
  const [showIntro, setShowIntro] = useState(false);

  const handleEnterGrid = () => {
    setShowIntro(false);
    sessionStorage.setItem('f1_intro_seen', 'true');
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <div className="min-h-screen bg-f1-bg text-f1-dark flex flex-col font-sans antialiased">
      {showIntro && <CinematicOpening onEnterGrid={handleEnterGrid} />}

      {/* Floating Collapsed Sticky Navigation Bar */}
      <Navbar onReplayIntro={handleReplayIntro} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 min-w-0">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
