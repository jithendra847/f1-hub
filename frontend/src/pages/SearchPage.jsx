import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Users, Shield, MapPin, Newspaper, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (term) => {
    if (!term || term.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(term.trim())}`);
      setResults(res.data?.results || null);
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to perform search query.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Global Search"
        subtitle="Search across Formula 1 drivers, constructors, circuits, and breaking news articles."
      />

      <form onSubmit={handleSearchSubmit} className="max-w-xl">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type driver name, team, circuit, or news keyword..."
          icon={Search}
        />
      </form>

      {loading ? (
        <Skeleton height="h-64" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => performSearch(query)} />
      ) : results ? (
        <div className="space-y-8">
          {/* Driver Results */}
          {results.drivers?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold text-f1-dark flex items-center gap-2">
                <Users className="w-5 h-5 text-f1-red" /> Drivers ({results.drivers.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.drivers.map(d => (
                  <Card key={d.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-f1-dark">{d.first_name} {d.last_name}</h3>
                      <p className="text-xs text-f1-muted">#{d.permanent_number || d.driver_code}</p>
                    </div>
                    <Link to={`/driver/${d.id}`} className="text-f1-red font-extrabold text-xs">
                      View Profile <ChevronRight className="w-3.5 h-3.5 inline" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Constructor Results */}
          {results.constructors?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold text-f1-dark flex items-center gap-2">
                <Shield className="w-5 h-5 text-f1-red" /> Teams ({results.constructors.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.constructors.map(c => (
                  <Card key={c.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-f1-dark">{c.name}</h3>
                      <p className="text-xs text-f1-muted">{c.nationality}</p>
                    </div>
                    <Link to={`/constructor/${c.id}`} className="text-f1-red font-extrabold text-xs">
                      View Specs <ChevronRight className="w-3.5 h-3.5 inline" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* News Results */}
          {results.news?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold text-f1-dark flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-f1-red" /> Articles ({results.news.length})
              </h2>
              <div className="space-y-2">
                {results.news.map((n, idx) => (
                  <Card key={idx} className="p-4">
                    <span className="text-[10px] font-black text-f1-red uppercase">{n.source}</span>
                    <h3 className="font-bold text-sm text-f1-dark mt-1">{n.title}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {results.drivers?.length === 0 && results.constructors?.length === 0 && results.news?.length === 0 && (
            <EmptyState message={`No matches found for query "${query}".`} />
          )}
        </div>
      ) : null}
    </PageContainer>
  );
}
