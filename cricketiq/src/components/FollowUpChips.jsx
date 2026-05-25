import React from 'react';

export default function FollowUpChips({ chips, onSelect, loading }) {
  if (!chips?.length) return null;
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
      {chips.map((chip, i) => (
        <button
          key={i}
          className="slide-in-right"
          style={{
            animationDelay: `${i * 120}ms`,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', borderRadius: 24, padding: '10px 18px',
            fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6,
          }}
          disabled={loading}
          onClick={() => onSelect(chip)}
          onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent-teal)'; e.target.style.background = 'rgba(29,158,117,0.08)'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg-secondary)'; }}
        >
          <span style={{ color: 'var(--accent-teal)' }}>→</span> {chip}
        </button>
      ))}
    </div>
  );
}
