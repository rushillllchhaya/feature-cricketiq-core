import React from 'react';

export default function InsightStrip({ insight }) {
  if (!insight) return null;
  return (
    <div className="card glow-pulse animate-slide-up delay-500" style={{
      marginTop: 20, borderLeft: '4px solid var(--accent-teal)',
      background: 'linear-gradient(90deg, rgba(29,158,117,0.08), var(--bg-secondary))',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: 15, fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {insight}
        </p>
      </div>
    </div>
  );
}
