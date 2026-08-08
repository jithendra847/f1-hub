import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

// Lazy-Loaded Page Components for Code-Splitting Optimization
const Home = lazy(() => import('../pages/Home'));
const Calendar = lazy(() => import('../pages/Calendar'));
const RaceWeekend = lazy(() => import('../pages/RaceWeekend'));
const Drivers = lazy(() => import('../pages/Drivers'));
const DriverDetail = lazy(() => import('../pages/DriverDetail'));
const Constructors = lazy(() => import('../pages/Constructors'));
const ConstructorDetail = lazy(() => import('../pages/ConstructorDetail'));
const Circuits = lazy(() => import('../pages/Circuits'));
const CircuitDetail = lazy(() => import('../pages/CircuitDetail'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Compare = lazy(() => import('../pages/Compare'));
const Technical = lazy(() => import('../pages/Technical'));
const News = lazy(() => import('../pages/News'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const Historical = lazy(() => import('../pages/Historical'));

const PageFallback = () => (
  <div className="p-8 space-y-6">
    <Skeleton height="h-44" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton height="h-64" />
      <Skeleton height="h-64" />
    </div>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-black text-f1-dark tracking-tight">{title}</h1>
    <EmptyState title={title} message="Feature implementation ready for next phase." />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="race/:season/:round" element={<RaceWeekend />} />
          <Route path="results" element={<Historical />} />
          <Route path="history" element={<Historical />} />
          <Route path="standings" element={<PlaceholderPage title="Championship Standings" />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="driver/:id" element={<DriverDetail />} />
          <Route path="constructors" element={<Constructors />} />
          <Route path="constructor/:id" element={<ConstructorDetail />} />
          <Route path="circuits" element={<Circuits />} />
          <Route path="circuit/:id" element={<CircuitDetail />} />
          <Route path="statistics" element={<Analytics />} />
          <Route path="compare" element={<Compare />} />
          <Route path="technical" element={<Technical />} />
          <Route path="news" element={<News />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
