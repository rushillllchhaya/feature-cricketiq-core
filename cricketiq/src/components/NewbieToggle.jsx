import React from 'react';

export default function NewbieToggle({ enabled, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
        Beginner Mode
      </span>
      <button
        onClick={onToggle}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: enabled ? 'var(--accent-teal)' : 'var(--bg-tertiary)',
          position: 'relative', transition: 'background 0.2s ease',
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3,
          left: enabled ? 23 : 3,
          transition: 'left 0.2s ease',
        }} />
      </button>
      {enabled && (
        <span style={{
          fontSize: 11, background: 'rgba(29,158,117,0.15)', color: 'var(--accent-teal)',
          padding: '2px 8px', borderRadius: 4, fontWeight: 600,
        }}>
          ON
        </span>
      )}
    </div>
  );
}
