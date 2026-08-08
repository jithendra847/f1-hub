import React, { useState, useEffect } from 'react';
import { Wrench, Shield, Filter, Info } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Technical() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const fetchTechnicalUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/technical-updates');
      setUpdates(res.data?.updates || []);
    } catch (err) {
      console.error('Failed to fetch technical updates:', err);
      setError('Unable to load technical upgrades feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicalUpdates();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Components' },
    { id: 'Aero', label: 'Aero' },
    { id: 'PU', label: 'Power Unit' },
    { id: 'Floor', label: 'Floor' },
    { id: 'Sidepods', label: 'Sidepods' },
    { id: 'Wings', label: 'Wings' },
    { id: 'Suspension', label: 'Suspension' },
  ];

  const filteredUpdates = updates.filter(u =>
    activeCategory === 'ALL' || u.category?.toUpperCase() === activeCategory.toUpperCase()
  );

  return (
    <PageContainer>
      <PageHeader
        title="Technical Upgrades & Development"
        subtitle="Verified FIA technical update submissions by constructor team and component category."
      />

      {/* Category Tabs */}
      <Tabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <div className="space-y-4">
          <Skeleton height="h-32" />
          <Skeleton height="h-32" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTechnicalUpdates} />
      ) : filteredUpdates.length === 0 ? (
        <EmptyState
          title="Verified Upgrades"
          message="No verified technical updates available."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUpdates.map((item, idx) => (
            <Card key={idx} className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="live">{item.category}</Badge>
                <span className="text-xs text-f1-muted font-bold">{item.constructor_name || 'Team'}</span>
              </div>
              <h3 className="text-base font-extrabold text-f1-dark">{item.component}</h3>
              <p className="text-xs text-f1-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
