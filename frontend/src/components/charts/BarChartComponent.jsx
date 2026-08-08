import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function BarChartComponent({
  data = [],
  xKey = 'name',
  bars = [],
  height = 300,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full bg-f1-card text-f1-dark rounded-2xl p-4 shadow-soft-outer border border-f1-border" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2A303C' : '#C5CAD1'} opacity={0.6} />
          <XAxis dataKey={xKey} stroke={isDark ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
          <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#161A23' : '#FFFFFF',
              borderRadius: '12px',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '6px 6px 14px #C5CAD1',
              color: isDark ? '#F9FAFB' : '#171A1F',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: isDark ? '#F9FAFB' : '#171A1F' }} />
          {bars.map((bar, idx) => (
            <Bar
              key={idx}
              dataKey={bar.key}
              name={bar.name || bar.key}
              fill={bar.color || '#E10600'}
              radius={[6, 6, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
