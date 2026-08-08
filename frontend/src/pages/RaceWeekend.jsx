import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Flag, Clock, CloudSun, Radio, Wrench, Trophy, Award, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Table from '../components/ui/Table';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import CircuitLayout from '../components/common/CircuitLayout';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function RaceWeekend() {
  const { season, round } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [race, setRace] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState([]);
  const [technical, setTechnical] = useState([]);

  const raceId = `${season}_${round}`;

  const fetchRaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resList = await Promise.allSettled([
        api.get(`/races/${raceId}`),
        api.get(`/sessions/${raceId}_race/results`),
        api.get(`/weather/${raceId}`),
        api.get(`/technical-updates?race_id=${raceId}`),
      ]);
      const [raceRes, resultsRes, weatherRes, techRes] = resList;

      setRace(raceRes.status === 'fulfilled' ? raceRes.value.data?.data || null : null);
      setResults(resultsRes.status === 'fulfilled' ? resultsRes.value.data?.results || [] : []);
      setWeather(weatherRes.status === 'fulfilled' ? weatherRes.value.data?.weather || [] : []);
      setTechnical(techRes.status === 'fulfilled' ? techRes.value.data?.updates || [] : []);
    } catch (err) {
      console.error('Failed to fetch race weekend data:', err);
      setError('Unable to load Grand Prix weekend information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaceData();
  }, [season, round]);

  if (loading) {
    return (
      <PageContainer>
        <Skeleton height="h-40" />
        <Skeleton height="h-12" />
        <Skeleton height="h-64" />
      </PageContainer>
    );
  }

  if (error || !race) {
    return (
      <PageContainer>
        <ErrorState message={error || 'Race event not found.'} onRetry={fetchRaceData} />
      </PageContainer>
    );
  }

  const isSprintWeekend = race.is_sprint || race.name?.toLowerCase().includes('sprint');

  const availableTabs = [
    { id: 'overview', label: 'Overview', icon: Flag },
    { id: 'results', label: 'Race Results', icon: Trophy },
    { id: 'fp1', label: 'FP1', icon: Clock },
    { id: 'fp2', label: 'FP2', icon: Clock },
    ...(!isSprintWeekend ? [{ id: 'fp3', label: 'FP3', icon: Clock }] : []),
    ...(isSprintWeekend
      ? [
          { id: 'sprint_qualifying', label: 'Sprint Shootout', icon: Clock },
          { id: 'sprint', label: 'Sprint', icon: Trophy },
        ]
      : []),
    { id: 'qualifying', label: 'Qualifying', icon: Clock },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'technical', label: 'Technical', icon: Wrench },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={race.name}
        subtitle={`${race.circuit_id || 'F1 Circuit'} — ${race.date}`}
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="default">ROUND {race.round}</Badge>
            {isSprintWeekend && <Badge variant="live">SPRINT WEEKEND</Badge>}
          </div>
        }
      />

      {/* Dynamic Session Tabs */}
      <Tabs tabs={availableTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* REAL 2D CIRCUIT LAYOUT MAP */}
          <CircuitLayout circuit={race} circuitId={race.circuit_id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-3">
              <h3 className="text-base font-extrabold text-f1-dark flex items-center gap-2">
                <Calendar className="w-4 h-4 text-f1-red" /> Weekend Schedule
              </h3>
              <p className="text-xs text-f1-muted">
                Weekend Format: <strong className="text-f1-dark">{isSprintWeekend ? 'Sprint Weekend' : 'Standard GP Weekend'}</strong>
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border flex justify-between">
                  <span>Friday: Practice 1 & 2</span>
                  <span className="font-bold">Completed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border flex justify-between">
                  <span>Saturday: Qualifying</span>
                  <span className="font-bold">Completed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border flex justify-between">
                  <span>Sunday: Grand Prix Race</span>
                  <span className="font-bold">Scheduled</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-3">
              <h3 className="text-base font-extrabold text-f1-dark flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-f1-red" /> Track Conditions
              </h3>
              {weather.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-f1-card shadow-soft-outer-sm border border-f1-border text-center">
                    <span className="text-f1-muted block">Air Temp</span>
                    <span className="text-lg font-black text-f1-dark">{weather[0].air_temp}°C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-f1-card shadow-soft-outer-sm border border-f1-border text-center">
                    <span className="text-f1-muted block">Track Temp</span>
                    <span className="text-lg font-black text-f1-red">{weather[0].track_temp}°C</span>
                  </div>
                </div>
              ) : (
                <EmptyState title="Weather" message="Track weather observations pending." />
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-f1-dark">Official Race Results</h2>
          {results.length > 0 ? (
            <Table headers={['Pos', 'No', 'Driver', 'Team', 'Grid', 'Laps', 'Points', 'Status']}>
              {results.map((res, idx) => (
                <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-black text-f1-red">{res.position}</td>
                  <td className="py-3 px-4 font-bold">{res.permanent_number || '-'}</td>
                  <td className="py-3 px-4 font-extrabold text-f1-dark">
                    {res.first_name} {res.last_name}
                  </td>
                  <td className="py-3 px-4 text-f1-muted">{res.constructor_name}</td>
                  <td className="py-3 px-4">{res.grid}</td>
                  <td className="py-3 px-4">{res.laps}</td>
                  <td className="py-3 px-4 font-extrabold text-f1-dark">{res.points}</td>
                  <td className="py-3 px-4">
                    <Badge variant={res.status === 'Finished' ? 'completed' : 'default'}>
                      {res.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState title="Results Pending" message="Race classification results not yet available for this session." />
          )}
        </div>
      )}

      {activeTab === 'weather' && (
        <Card className="space-y-4">
          <h2 className="text-xl font-extrabold text-f1-dark">Session Weather History</h2>
          {weather.length > 0 ? (
            <Table headers={['Timestamp', 'Air Temp (°C)', 'Track Temp (°C)', 'Humidity (%)', 'Rainfall']}>
              {weather.map((w, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4">{w.timestamp}</td>
                  <td className="py-3 px-4 font-bold">{w.air_temp}°C</td>
                  <td className="py-3 px-4 font-bold text-f1-red">{w.track_temp}°C</td>
                  <td className="py-3 px-4">{w.humidity}%</td>
                  <td className="py-3 px-4">{w.rainfall ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState message="Weather data unavailable." />
          )}
        </Card>
      )}

      {activeTab === 'technical' && (
        <Card className="space-y-4">
          <h2 className="text-xl font-extrabold text-f1-dark">Grand Prix Technical Updates</h2>
          {technical.length > 0 ? (
            <div className="space-y-3">
              {technical.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-f1-card shadow-soft-outer-sm border border-f1-border">
                  <span className="text-xs font-bold text-f1-red uppercase">{t.category}</span>
                  <p className="text-sm text-f1-dark mt-1">{t.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Verified Upgrades" message="No verified technical updates available." />
          )}
        </Card>
      )}

      {['fp1', 'fp2', 'fp3', 'sprint_qualifying', 'sprint', 'qualifying'].includes(activeTab) && (
        <EmptyState
          title={`${activeTab.toUpperCase()} Session Timing`}
          message="Detailed lap breakdown and sector timing for this session will load once completed."
        />
      )}
    </PageContainer>
  );
}
