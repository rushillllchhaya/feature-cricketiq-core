import React from 'react';

export default function SpeakButton({ speaking, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: speaking ? 'var(--accent-teal)' : 'var(--bg-tertiary)',
        border: '1px solid var(--border)', borderRadius: 8,
        padding: '8px 14px', cursor: 'pointer',
        fontSize: 16, transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 6,
        color: 'var(--text-primary)',
      }}
      title={speaking ? 'Stop speaking' : 'Read aloud'}
    >
      {speaking ? '🔊' : '🔈'}
      <span style={{ fontSize: 12, fontFamily: 'var(--font-ui)' }}>
        {speaking ? 'Stop' : 'Listen'}
      </span>
    </button>
  );
}
