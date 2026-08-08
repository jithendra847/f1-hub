import React, { useState, useEffect } from 'react';
import { Newspaper, Search, ExternalLink, Filter } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function News() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryParam = activeCategory !== 'ALL' ? `&category=${activeCategory}` : '';
      const res = await api.get(`/news?limit=50${categoryParam}`);
      setNews(res.data?.articles || []);
    } catch (err) {
      console.error('Failed to fetch news feed:', err);
      setError('Unable to load aggregated Formula 1 news feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const categories = [
    { id: 'ALL', label: 'All News' },
    { id: 'RACE', label: 'Race Reports' },
    { id: 'FIA', label: 'FIA & Regulations' },
    { id: 'TEAMS', label: 'Team Updates' },
    { id: 'TECHNICAL', label: 'Technical' },
  ];

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.summary.toLowerCase().includes(search.toLowerCase()) ||
    item.source.toLowerCase().includes(search.toLowerCase())
  );

  const searchAction = (
    <div className="w-full sm:w-72">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search news articles..."
        icon={Search}
      />
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="F1 Breaking News Feed"
        subtitle="Aggregated verified RSS news feeds from official F1 providers."
        action={searchAction}
      />

      {/* Category Filter Tabs */}
      <Tabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => (
            <Skeleton key={n} height="h-32" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchNews} />
      ) : filteredNews.length === 0 ? (
        <EmptyState message="No news articles match your filter criteria." />
      ) : (
        <div className="space-y-4">
          {filteredNews.map((article, idx) => (
            <Card key={idx} className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-f1-red uppercase">{article.source}</span>
                  <span className="text-[10px] text-f1-muted">•</span>
                  <span className="text-[10px] text-f1-muted font-bold">{article.published_at || 'Recent'}</span>
                  <Badge variant="default">{article.category}</Badge>
                </div>

                <h3 className="text-lg font-extrabold text-f1-dark hover:text-f1-red transition-colors">
                  <a href={article.article_url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>

                <p className="text-xs text-f1-muted line-clamp-2">{article.summary}</p>
              </div>

              <div className="flex items-center md:items-end">
                <a
                  href={article.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-button text-xs font-bold text-f1-red flex items-center gap-1.5 px-4 py-2"
                >
                  Read Article <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
