import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Flag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Calendar() {
  const [season, setSeason] = useState('current');
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/calendar?season=${season}`);
      setRaces(res.data?.races || []);
    } catch (err) {
      console.error('Failed to load calendar:', err);
      setError('Unable to load Formula 1 race calendar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [season]);

  const getStatusVariant = (raceDate) => {
    const today = new Date();
    const rDate = new Date(raceDate);
    if (rDate.toDateString() === today.toDateString()) return 'live';
    if (rDate < today) return 'completed';
    return 'upcoming';
  };

  const seasonSelectorAction = (
    <div className="flex items-center gap-2 bg-f1-card p-1.5 rounded-2xl shadow-soft-inset border border-f1-border">
      {['current', '2025', '2024'].map((s) => (
        <button
          key={s}
          onClick={() => setSeason(s)}
          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            season === s
              ? 'bg-f1-red text-white shadow-accent-glow'
              : 'text-f1-muted hover:text-f1-dark hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          {s === 'current' ? '2026 Season' : s}
        </button>
      ))}
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="F1 Race Calendar"
        subtitle="Official Grand Prix schedule and session dates."
        action={seasonSelectorAction}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} height="h-48" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCalendar} />
      ) : races.length === 0 ? (
        <EmptyState message="No races found for the selected season." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races.map((race) => {
            const statusVariant = getStatusVariant(race.date);
            return (
              <Card key={race.round} className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-f1-red">ROUND {race.round}</span>
                    <Badge variant={statusVariant}>{statusVariant}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-f1-dark line-clamp-1">{race.name}</h3>
                    <p className="text-xs font-semibold text-f1-muted flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-f1-red" />
                      {race.circuit?.name || 'Circuit'} — {race.circuit?.country || ''}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-f1-border flex items-center justify-between">
                  <span className="text-xs font-bold text-f1-dark">{race.date}</span>
                  <Link
                    to={`/race/${race.season}/${race.round}`}
                    className="text-xs font-extrabold text-f1-red flex items-center gap-1 hover:underline"
                  >
                    Weekend Overview <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
