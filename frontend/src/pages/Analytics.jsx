import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Trophy, Award, Zap } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progression, setProgression] = useState([]);
  const [standings, setStandings] = useState([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        api.get('/analytics/championship-progression?season=current'),
        api.get('/standings/drivers?season=current'),
      ]);
      const [progRes, standingsRes] = results;
      setProgression(progRes.status === 'fulfilled' ? progRes.value.data?.data || [] : []);
      const standingsData = standingsRes.status === 'fulfilled' ? standingsRes.value.data?.standings || [] : [];
      setStandings(standingsData.slice(0, 8));
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Unable to load championship analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Championship Analytics" subtitle="2026 Season points progression, win rates, and race performance stats." />
        <Skeleton height="h-64" />
        <Skeleton height="h-64" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Championship Analytics" subtitle="2026 Season points progression, win rates, and race performance stats." />
        <ErrorState message={error} onRetry={fetchAnalytics} />
      </PageContainer>
    );
  }

  const sampleDriverKeys = standings.slice(0, 4).map(d => d.driver_code || d.first_name);
  const colors = ['#E10600', '#2563EB', '#D97706', '#059669'];

  const lineConfigs = sampleDriverKeys.map((key, idx) => ({
    key: key,
    name: key,
    color: colors[idx % colors.length]
  }));

  return (
    <PageContainer>
      <PageHeader
        title="Championship Analytics"
        subtitle="2026 Season points progression, win rates, and race performance stats."
      />

      {/* Progression Trend Chart */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-f1-red" />
          <h2 className="text-lg font-extrabold text-f1-dark">Cumulative Championship Points Progression</h2>
        </div>
        {progression.length > 0 ? (
          <LineChartComponent data={progression} xKey="race" lines={lineConfigs} height={350} />
        ) : (
          <Skeleton height="h-64" />
        )}
      </Card>

      {/* Points per Race Bar Chart */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-f1-red" />
          <h2 className="text-lg font-extrabold text-f1-dark">Top Drivers Total Points Breakdown</h2>
        </div>
        <BarChartComponent
          data={standings.map(s => ({
            name: s.driver_code || s.last_name,
            points: s.points,
            wins: s.wins
          }))}
          xKey="name"
          bars={[
            { key: 'points', name: 'Total Points', color: '#E10600' }
          ]}
          height={320}
        />
      </Card>
    </PageContainer>
  );
}
