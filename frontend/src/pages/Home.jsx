import React, { useState, useEffect, useRef } from 'react';
import { Flag, Clock, Trophy, Calendar, Zap, CloudSun, Wrench, Newspaper, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import CinematicOpening from '../components/common/CinematicOpening';
import CircuitLayout from '../components/common/CircuitLayout';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [news, setNews] = useState([]);
  const [technicalUpdates, setTechnicalUpdates] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextRace, setNextRace] = useState(null);
  const gridRef = useRef(null);

  const handleScrollToGrid = () => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calculateCountdown = (targetDateStr) => {
    const target = new Date(targetDateStr || '2026-03-20T14:00:00Z').getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, target - now);

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const fetchHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        api.get('/calendar?season=current'),
        api.get('/standings/drivers?season=current'),
        api.get('/standings/constructors?season=current'),
        api.get('/news?limit=4'),
        api.get('/technical-updates?limit=4'),
      ]);

      const [calRes, driverRes, constRes, newsRes, techRes] = results;

      if (calRes.status === 'fulfilled' && calRes.value.data?.races) {
        const races = calRes.value.data.races;
        setCalendar(races);
        const upcoming = races.find((r) => new Date(r.date) >= new Date()) || races[0];
        setNextRace(upcoming);
      }

      if (driverRes.status === 'fulfilled') {
        setDriverStandings(driverRes.value.data?.standings?.slice(0, 5) || []);
      }
      if (constRes.status === 'fulfilled') {
        setConstructorStandings(constRes.value.data?.standings?.slice(0, 5) || []);
      }
      if (newsRes.status === 'fulfilled') {
        setNews(newsRes.value.data?.articles?.slice(0, 4) || []);
      }
      if (techRes.status === 'fulfilled') {
        setTechnicalUpdates(techRes.value.data?.updates?.slice(0, 4) || []);
      }
    } catch (err) {
      console.error('Failed to load homepage data:', err);
      setError('Failed to connect to backend engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!nextRace?.date) return;
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(nextRace.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextRace]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton height="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height="h-80" />
          <Skeleton height="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchHomeData} />;
  }

  return (
    <div className="space-y-8">
      {/* Full-Screen Edge-to-Edge Viewport Hero Slideshow */}
      <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-8">
        <CinematicOpening isEmbedded={true} onEnterGrid={handleScrollToGrid} />
      </div>

      <div ref={gridRef} id="grid-content" className="space-y-8 pt-4">
        {/* Dynamic Next Race Banner */}
        {nextRace && (
        <Card className="bg-gradient-to-br from-f1-card via-f1-card to-f1-card relative overflow-hidden border border-f1-border shadow-soft-outer">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Badge variant="live">UPCOMING GRAND PRIX</Badge>
                <span className="text-xs font-bold text-f1-muted">Round {nextRace.round}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-f1-dark tracking-tight">
                {nextRace.name}
              </h1>
              <p className="text-sm font-semibold text-f1-muted flex items-center justify-center lg:justify-start gap-1.5">
                <Calendar className="w-4 h-4 text-f1-red" /> {nextRace.circuit?.name || 'Circuit'} — {nextRace.date}
              </p>
            </div>

            {/* 2D Track Preview Thumbnail */}
            <div className="w-full lg:w-72">
              <CircuitLayout circuit={nextRace.circuit} circuitId={nextRace.circuit?.id || nextRace.circuit_id} compact={true} />
            </div>

            {/* Countdown Display */}
            <div className="flex items-center gap-3 bg-f1-card p-4 rounded-2xl shadow-soft-inset border border-f1-border">
              <div className="text-center px-2">
                <span className="text-2xl md:text-3xl font-black text-f1-red">{countdown.days}</span>
                <span className="block text-[10px] uppercase font-bold text-f1-muted">Days</span>
              </div>
              <span className="text-xl font-bold text-f1-muted">:</span>
              <div className="text-center px-2">
                <span className="text-2xl md:text-3xl font-black text-f1-dark">{countdown.hours}</span>
                <span className="block text-[10px] uppercase font-bold text-f1-muted">Hrs</span>
              </div>
              <span className="text-xl font-bold text-f1-muted">:</span>
              <div className="text-center px-2">
                <span className="text-2xl md:text-3xl font-black text-f1-dark">{countdown.minutes}</span>
                <span className="block text-[10px] uppercase font-bold text-f1-muted">Min</span>
              </div>
              <span className="text-xl font-bold text-f1-muted">:</span>
              <div className="text-center px-2">
                <span className="text-2xl md:text-3xl font-black text-f1-red">{countdown.seconds}</span>
                <span className="block text-[10px] uppercase font-bold text-f1-muted">Sec</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Grid: Driver & Constructor Standings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Driver Standings */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-f1-red" />
              <h2 className="text-lg font-extrabold text-f1-dark">Driver Standings</h2>
            </div>
            <Link to="/standings">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {driverStandings.length > 0 ? (
            <div className="space-y-2">
              {driverStandings.map((d, idx) => (
                <div
                  key={d.driver_id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-f1-card shadow-soft-outer-sm border border-f1-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-sm text-f1-red">{d.position}</span>
                    <div>
                      <p className="font-bold text-sm text-f1-dark">
                        {d.first_name} {d.last_name}
                      </p>
                      <p className="text-xs text-f1-muted">{d.constructor_name || 'Team'}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-f1-dark">{d.points} PTS</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Driver standings unavailable." />
          )}
        </Card>

        {/* Constructor Standings */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-f1-red" />
              <h2 className="text-lg font-extrabold text-f1-dark">Constructor Standings</h2>
            </div>
            <Link to="/standings">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {constructorStandings.length > 0 ? (
            <div className="space-y-2">
              {constructorStandings.map((c, idx) => (
                <div
                  key={c.constructor_id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-f1-card shadow-soft-outer-sm border border-f1-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-sm text-f1-red">{c.position}</span>
                    <p className="font-bold text-sm text-f1-dark">{c.constructor_name}</p>
                  </div>
                  <span className="font-black text-sm text-f1-dark">{c.points} PTS</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Constructor standings unavailable." />
          )}
        </Card>
      </div>

      {/* Grid: Latest News & Technical Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest News */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-f1-red" />
              <h2 className="text-lg font-extrabold text-f1-dark">Latest F1 News</h2>
            </div>
            <Link to="/news">
              <Button variant="ghost" size="sm">
                More News <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {news.length > 0 ? (
            <div className="space-y-3">
              {news.map((item, idx) => (
                <a
                  key={idx}
                  href={item.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-f1-card shadow-soft-outer-sm hover:shadow-soft-outer-hover transition-all duration-200 border border-f1-border"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-extrabold text-f1-red uppercase">{item.source}</span>
                    <span className="text-[10px] text-f1-muted">{item.category}</span>
                  </div>
                  <h3 className="font-bold text-sm text-f1-dark mt-1 line-clamp-2">{item.title}</h3>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState message="No recent articles found." />
          )}
        </Card>

        {/* Technical Updates */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-f1-red" />
              <h2 className="text-lg font-extrabold text-f1-dark">Technical Upgrades</h2>
            </div>
            <Link to="/technical">
              <Button variant="ghost" size="sm">
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {technicalUpdates.length > 0 ? (
            <div className="space-y-3">
              {technicalUpdates.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-f1-card shadow-soft-outer-sm border border-f1-border">
                  <span className="text-[10px] font-bold text-f1-red">{item.category}</span>
                  <p className="text-xs text-f1-dark mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Verified Upgrades" message="No verified technical updates available." />
          )}
        </Card>
      </div>
    </div>
  </div>
);
}
