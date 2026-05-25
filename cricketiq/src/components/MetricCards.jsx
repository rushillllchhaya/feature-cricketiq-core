import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { formatDelta } from '../utils/dataHelpers';

function MetricCard({ label, value, delta, trend, delay }) {
  const numericVal = parseFloat(value);
  const isNumeric = !isNaN(numericVal) && !/\//.test(value);
  const decimals = isNumeric && String(value).includes('.') ? 1 : 0;
  const countedValue = useCountUp(isNumeric ? numericVal : 0, 1200, decimals, true);

  const trendColor = trend === 'up' ? 'var(--accent-teal)' : trend === 'down' ? 'var(--accent-red)' : 'var(--accent-amber)';

  return (
    <div className="card pop-in" style={{
      animationDelay: `${delay}ms`, flex: '1 1 200px', minWidth: 180,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 60, height: 60,
        background: `radial-gradient(circle at top right, ${trendColor}15, transparent 70%)`,
      }} />
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1 }}>
        {isNumeric ? countedValue : value}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <span style={{ color: trendColor, fontSize: 14, fontWeight: 700 }}>{formatDelta(trend)}</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{delta}</span>
      </div>
    </div>
  );
}

export default function MetricCards({ metrics }) {
  if (!metrics?.length) return null;
  return (
    <div className="animate-slide-up delay-200" style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
      {metrics.map((m, i) => (
        <MetricCard key={i} {...m} delay={i * 100} />
      ))}
    </div>
  );
}
