import React, { useState, useEffect } from 'react';
import { MapPin, Search, ChevronRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import CircuitLayout from '../components/common/CircuitLayout';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Circuits() {
  const [circuits, setCircuits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCircuits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/circuits');
      setCircuits(res.data?.circuits || []);
    } catch (err) {
      console.error('Failed to fetch circuits:', err);
      setError('Unable to load Formula 1 circuit directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircuits();
  }, []);

  const filtered = circuits.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.country && c.country.toLowerCase().includes(search.toLowerCase())) ||
    (c.locality && c.locality.toLowerCase().includes(search.toLowerCase()))
  );

  const searchAction = (
    <div className="w-full sm:w-72">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search circuit or country..."
        icon={Search}
      />
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="F1 Circuit Directory"
        subtitle="Global Grand Prix circuits, real 2D telemetry vector maps, and track turn specs."
        action={searchAction}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Skeleton key={n} height="h-64" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCircuits} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No circuits match your search query." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((circuit, idx) => (
            <Card key={circuit.id || idx} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <MapPin className="w-6 h-6 text-f1-red" />
                  <Badge variant="default">{circuit.country || 'F1 Track'}</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-f1-dark leading-tight">{circuit.name}</h3>
                  <p className="text-xs text-f1-muted flex items-center gap-1 mt-1">
                    <Navigation className="w-3 h-3 text-f1-red" />
                    {circuit.locality || circuit.country || 'Location'}
                  </p>
                </div>

                {/* 2D Circuit Layout Vector Mini Preview */}
                <CircuitLayout circuit={circuit} circuitId={circuit.id} compact={true} />
              </div>

              <div className="pt-3 border-t border-f1-border flex items-center justify-between">
                <span className="text-xs text-f1-muted font-bold">2D Vector Geometry</span>
                <Link
                  to={`/circuit/${circuit.id}`}
                  className="text-xs font-extrabold text-f1-red flex items-center gap-1 hover:underline"
                >
                  Interactive Map <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
