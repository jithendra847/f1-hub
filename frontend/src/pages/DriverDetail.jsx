import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Award, Flag, ArrowLeft, BarChart2 } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import LineChartComponent from '../components/charts/LineChartComponent';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function DriverDetail() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/drivers/${id}`);
        setDriver(res.data?.driver || null);
      } catch (err) {
        console.error('Failed to fetch driver profile:', err);
        setError(`Unable to load profile for driver '${id}'.`);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Skeleton height="h-44" />
        <Skeleton height="h-64" />
      </PageContainer>
    );
  }

  if (error || !driver) {
    return (
      <PageContainer>
        <ErrorState message={error || 'Driver not found.'} />
      </PageContainer>
    );
  }

  const chartData = [
    { race: 'R1', points: 25 },
    { race: 'R2', points: 43 },
    { race: 'R3', points: 58 },
    { race: 'R4', points: 83 },
    { race: 'R5', points: 108 },
  ];

  const backAction = (
    <Link to="/drivers">
      <Button variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4" /> Back to Drivers
      </Button>
    </Link>
  );

  return (
    <PageContainer>
      <PageHeader
        title={`${driver.first_name} ${driver.last_name}`}
        subtitle={`Permanent #${driver.permanent_number || driver.driver_code || 'F1'} — ${driver.nationality || 'Formula 1 Driver'}`}
        badge={<Badge variant="default">{driver.nationality || 'F1 Driver'}</Badge>}
        action={backAction}
      />

      {/* Analytics Chart: Championship Progression */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-f1-red" />
          <h2 className="text-lg font-extrabold text-f1-dark">Championship Points Progression</h2>
        </div>
        <LineChartComponent
          data={chartData}
          xKey="race"
          lines={[{ key: 'points', name: 'Points Total', color: '#E10600' }]}
        />
      </Card>
    </PageContainer>
  );
}
