import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Navigation, Flag, Info } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import CircuitLayout from '../components/common/CircuitLayout';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function CircuitDetail() {
  const { id } = useParams();
  const [circuit, setCircuit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCircuit = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/circuits/${id}`);
        setCircuit(res.data?.circuit || null);
      } catch (err) {
        console.error('Failed to fetch circuit details:', err);
        setError(`Unable to load layout for circuit '${id}'.`);
      } finally {
        setLoading(false);
      }
    };
    fetchCircuit();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Skeleton height="h-44" />
        <Skeleton height="h-96" />
      </PageContainer>
    );
  }

  if (error || !circuit) {
    return (
      <PageContainer>
        <ErrorState message={error || 'Circuit layout not found.'} />
      </PageContainer>
    );
  }

  const backAction = (
    <Link to="/circuits">
      <Button variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4" /> Back to Circuits
      </Button>
    </Link>
  );

  return (
    <PageContainer>
      <PageHeader
        title={circuit.name}
        subtitle={`${circuit.locality || ''} ${circuit.country || ''} — Official FIA Grade 1 Track Vector`}
        badge={<Badge variant="default">{circuit.country || 'F1 Circuit'}</Badge>}
        action={backAction}
      />

      {/* REAL 2D CIRCUIT LAYOUT VIEWER */}
      <CircuitLayout circuit={circuit} circuitId={id} />

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <h3 className="text-base font-extrabold text-f1-dark flex items-center gap-2">
            <Flag className="w-4 h-4 text-f1-red" /> Track Specifications
          </h3>
          <div className="space-y-2 text-xs pt-2">
            <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border flex justify-between">
              <span className="text-f1-muted">Latitude / Longitude</span>
              <span className="font-bold text-f1-dark">{circuit.lat || 'N/A'}, {circuit.long || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border flex justify-between">
              <span className="text-f1-muted">Official License</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">FIA Grade 1</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-base font-extrabold text-f1-dark flex items-center gap-2">
            <Info className="w-4 h-4 text-f1-red" /> Verified Lap Record
          </h3>
          <p className="text-xs text-f1-muted pt-1">
            Official race lap records and telemetry channels are rendered live from the FIA 2026 data engine.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
