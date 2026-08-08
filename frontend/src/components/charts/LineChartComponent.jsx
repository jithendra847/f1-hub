import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function LineChartComponent({
  data = [],
  xKey = 'name',
  lines = [],
  height = 300,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full bg-f1-card text-f1-dark rounded-2xl p-4 shadow-soft-outer border border-f1-border" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          {lines.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.key}
              name={line.name || line.key}
              stroke={line.color || '#E10600'}
              strokeWidth={3}
              dot={{ r: 4, fill: line.color || '#E10600' }}
              activeDot={{ r: 6, stroke: isDark ? '#161A23' : '#FFFFFF', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
