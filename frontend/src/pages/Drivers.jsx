import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronRight, Award } from 'lucide-react';
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

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/drivers?season=current');
      setDrivers(res.data?.drivers || []);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
      setError('Unable to load Formula 1 driver lineup.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => 
    `${d.first_name} ${d.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    (d.driver_code && d.driver_code.toLowerCase().includes(search.toLowerCase())) ||
    (d.nationality && d.nationality.toLowerCase().includes(search.toLowerCase()))
  );

  const searchAction = (
    <div className="w-full sm:w-72">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter drivers by name..."
        icon={Search}
      />
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="F1 Drivers Lineup"
        subtitle="Current season driver grid, permanent numbers, and profiles."
        action={searchAction}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <Skeleton key={n} height="h-44" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDrivers} />
      ) : filteredDrivers.length === 0 ? (
        <EmptyState message="No drivers match your search query." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-f1-red">
                    #{driver.permanent_number || driver.driver_code || 'F1'}
                  </span>
                  <Badge variant="default">{driver.nationality || 'F1'}</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-f1-dark leading-tight">
                    {driver.first_name} {driver.last_name}
                  </h3>
                  {driver.driver_code && (
                    <span className="text-xs font-bold text-f1-muted uppercase tracking-wider">
                      {driver.driver_code}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-f1-border flex items-center justify-between">
                <span className="text-xs text-f1-muted font-semibold">
                  DOB: {driver.date_of_birth || 'N/A'}
                </span>
                <Link
                  to={`/driver/${driver.id}`}
                  className="text-xs font-extrabold text-f1-red flex items-center gap-1 hover:underline"
                >
                  Profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
