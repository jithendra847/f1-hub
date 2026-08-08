import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowLeft, BarChart2 } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import BarChartComponent from '../components/charts/BarChartComponent';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function ConstructorDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/constructors/${id}`);
        setTeam(res.data?.constructor || null);
      } catch (err) {
        console.error('Failed to fetch team details:', err);
        setError(`Unable to load specifications for team '${id}'.`);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Skeleton height="h-44" />
        <Skeleton height="h-64" />
      </PageContainer>
    );
  }

  if (error || !team) {
    return (
      <PageContainer>
        <ErrorState message={error || 'Team not found.'} />
      </PageContainer>
    );
  }

  const teamData = [
    { race: 'R1', points: 30 },
    { race: 'R2', points: 55 },
    { race: 'R3', points: 78 },
    { race: 'R4', points: 102 },
    { race: 'R5', points: 135 },
  ];

  const backAction = (
    <Link to="/constructors">
      <Button variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </Button>
    </Link>
  );

  return (
    <PageContainer>
      <PageHeader
        title={team.name}
        subtitle={`${team.nationality || 'F1 Constructor'} — 2026 Regulations Compliant Specification`}
        badge={<Badge variant="default">{team.nationality || 'Constructor'}</Badge>}
        action={backAction}
      />

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-f1-red" />
          <h2 className="text-lg font-extrabold text-f1-dark">Team Championship Points Accumulation</h2>
        </div>
        <BarChartComponent
          data={teamData}
          xKey="race"
          bars={[{ key: 'points', name: 'Constructor Points', color: '#E10600' }]}
        />
      </Card>
    </PageContainer>
  );
}
