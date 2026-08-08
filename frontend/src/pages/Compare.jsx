import React, { useState, useEffect } from 'react';
import { GitCompare, Trophy, Award, Flag, ArrowRight, Shield } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import BarChartComponent from '../components/charts/BarChartComponent';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Compare() {
  const [drivers, setDrivers] = useState([]);
  const [driver1, setDriver1] = useState('verstappen');
  const [driver2, setDriver2] = useState('hamilton');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLineup = async () => {
      try {
        const res = await api.get('/drivers?season=current');
        const list = res.data?.drivers || [];
        setDrivers(list);
        if (list.length >= 2) {
          setDriver1(list[0].id);
          setDriver2(list[1].id);
        }
      } catch (err) {
        console.error('Failed to load driver lineup:', err);
      }
    };
    fetchLineup();
  }, []);

  const runComparison = async () => {
    if (!driver1 || !driver2 || driver1 === driver2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/analytics/compare?driver1=${driver1}&driver2=${driver2}`);
      setComparison(res.data?.comparison || null);
    } catch (err) {
      console.error('Comparison error:', err);
      setError('Unable to fetch head-to-head comparison metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driver1 && driver2 && driver1 !== driver2) {
      runComparison();
    }
  }, [driver1, driver2]);

  return (
    <PageContainer>
      <PageHeader
        title="Head-to-Head Comparison"
        subtitle="Compare championship points, race wins, podium finishes, and performance metrics between any two F1 drivers."
      />

      {/* Driver Selector Controls */}
      <Card className="flex flex-col md:flex-row items-center justify-around gap-6 bg-f1-card border border-f1-border">
        <div className="space-y-2 text-center w-full md:w-auto">
          <label className="text-xs font-black uppercase text-f1-red block">Driver A</label>
          <select
            value={driver1}
            onChange={(e) => setDriver1(e.target.value)}
            className="neu-input font-bold text-sm text-f1-dark cursor-pointer min-w-[200px]"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id} className="bg-f1-card text-f1-dark">{d.first_name} {d.last_name}</option>
            ))}
          </select>
        </div>

        <div className="p-3 rounded-full bg-f1-red text-white shadow-accent-glow">
          <GitCompare className="w-6 h-6" />
        </div>

        <div className="space-y-2 text-center w-full md:w-auto">
          <label className="text-xs font-black uppercase text-f1-red block">Driver B</label>
          <select
            value={driver2}
            onChange={(e) => setDriver2(e.target.value)}
            className="neu-input font-bold text-sm text-f1-dark cursor-pointer min-w-[200px]"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id} className="bg-f1-card text-f1-dark">{d.first_name} {d.last_name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Comparison Results */}
      {loading ? (
        <Skeleton height="h-64" />
      ) : error ? (
        <ErrorState message={error} onRetry={runComparison} />
      ) : comparison ? (
        <div className="space-y-6">
          {/* Head-to-Head Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver A Card */}
            <Card className="space-y-4 border-l-4 border-l-f1-red">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-f1-dark">
                  {comparison.driver1.info.first_name} {comparison.driver1.info.last_name}
                </h3>
                <Badge variant="default">{comparison.driver1.info.nationality || 'F1'}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
                  <span className="text-[10px] text-f1-muted uppercase font-bold block">Points</span>
                  <span className="text-xl font-black text-f1-red">{comparison.driver1.stats.points}</span>
                </div>
                <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
                  <span className="text-[10px] text-f1-muted uppercase font-bold block">Wins</span>
                  <span className="text-xl font-black text-f1-dark">{comparison.driver1.stats.wins}</span>
                </div>
                <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
                  <span className="text-[10px] text-f1-muted uppercase font-bold block">Podiums</span>
                  <span className="text-xl font-black text-f1-dark">{comparison.driver1.stats.podiums}</span>
                </div>
              </div>
            </Card>

            {/* Driver B Card */}
            <Card className="space-y-4 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-f1-dark">
                  {comparison.driver2.info.first_name} {comparison.driver2.info.last_name}
                </h3>
                <Badge variant="default">{comparison.driver2.info.nationality || 'F1'}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
                  <span className="text-[10px] text-f1-muted uppercase font-bold block">Points</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">{comparison.driver2.stats.points}</span>
                </div>
                <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
                  <span className="text-[10px] text-f1-muted uppercase font-bold block">Wins</span>
                  <span className="text-xl font-black text-f1-dark">{comparison.driver2.stats.wins}</span>
                </div>
                <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
                  <span className="text-[10px] text-f1-muted uppercase font-bold block">Podiums</span>
                  <span className="text-xl font-black text-f1-dark">{comparison.driver2.stats.podiums}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Comparison Bar Chart */}
          <Card className="space-y-4">
            <h2 className="text-lg font-extrabold text-f1-dark">Key Metric Comparison Bar Chart</h2>
            <BarChartComponent
              data={[
                {
                  metric: 'Points',
                  DriverA: comparison.driver1.stats.points,
                  DriverB: comparison.driver2.stats.points,
                },
                {
                  metric: 'Wins',
                  DriverA: comparison.driver1.stats.wins,
                  DriverB: comparison.driver2.stats.wins,
                },
                {
                  metric: 'Podiums',
                  DriverA: comparison.driver1.stats.podiums,
                  DriverB: comparison.driver2.stats.podiums,
                },
              ]}
              xKey="metric"
              bars={[
                { key: 'DriverA', name: `${comparison.driver1.info.last_name}`, color: '#E10600' },
                { key: 'DriverB', name: `${comparison.driver2.info.last_name}`, color: '#2563EB' },
              ]}
              height={320}
            />
          </Card>
        </div>
      ) : null}
    </PageContainer>
  );
}
