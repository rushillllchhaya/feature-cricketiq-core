import React, { useState, useEffect } from 'react';
import { BAR_COLORS } from '../utils/dataHelpers';

export default function PowerplayChart({ data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [data]);

  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.value)) * 1.15;

  return (
    <div className="card animate-slide-up delay-300" style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Run Rate Comparison
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 40, fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
              {item.team}
            </span>
            <div style={{ flex: 1, height: 32, background: 'var(--bg-primary)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div
                className="bar-grow"
                style={{
                  width: animated ? `${(item.value / max) * 100}%` : '0%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${BAR_COLORS[item.color] || BAR_COLORS.teal}, ${BAR_COLORS[item.color] || BAR_COLORS.teal}dd)`,
                  borderRadius: 6,
                  transitionDelay: `${i * 80}ms`,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10,
                }}
              >
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
