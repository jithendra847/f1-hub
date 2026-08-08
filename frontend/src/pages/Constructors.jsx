import React, { useState, useEffect } from 'react';
import { Shield, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Constructors() {
  const [constructors, setConstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/constructors?season=current');
      setConstructors(res.data?.constructors || []);
    } catch (err) {
      console.error('Failed to fetch constructors:', err);
      setError('Unable to load Formula 1 team lineup.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConstructors();
  }, []);

  const filtered = constructors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.nationality && c.nationality.toLowerCase().includes(search.toLowerCase()))
  );

  const searchAction = (
    <div className="w-full sm:w-72">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter teams by name..."
        icon={Search}
      />
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="F1 Constructors & Teams"
        subtitle="Official Formula 1 teams competing in the 2026 World Championship."
        action={searchAction}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Skeleton key={n} height="h-44" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchConstructors} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No teams match your search query." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((team) => (
            <Card key={team.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Shield className="w-8 h-8 text-f1-red" />
                  <Badge variant="default">{team.nationality || 'F1 Team'}</Badge>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-f1-dark">{team.name}</h3>
                  <p className="text-xs text-f1-muted mt-0.5">2026 Championship Contender</p>
                </div>
              </div>

              <div className="pt-3 border-t border-f1-border flex items-center justify-between">
                <span className="text-xs text-f1-muted font-semibold">Formula 1</span>
                <Link
                  to={`/constructor/${team.id}`}
                  className="text-xs font-extrabold text-f1-red flex items-center gap-1 hover:underline"
                >
                  Team Specs <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
