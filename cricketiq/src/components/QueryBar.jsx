import React, { useState, useRef, useEffect } from 'react';

const SAMPLE_QUERIES = [
  { label: 'Powerplay', query: "Why did GT lose the powerplay vs RCB?" },
  { label: 'Death Overs', query: "Who is the best death bowler this IPL season?" },
  { label: 'Batting', query: "Compare Rohit Sharma and Shubman Gill's powerplay strike rates" },
  { label: 'Bowling', query: "Explain Jasprit Bumrah's economy rate in death overs" },
  { label: 'Team Compare', query: "Which team has the highest dot ball percentage in 2024?" },
  { label: 'Player Form', query: "How does CSK bat in the middle overs?" },
];

export default function QueryBar({ onSubmit, loading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() && !loading) onSubmit(query.trim());
  };

  const handleChip = (q) => {
    setQuery(q);
    onSubmit(q);
  };

  return (
    <div className="animate-slide-up">
      <form onSubmit={handleSubmit} className="relative query-underline" style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-tertiary)', borderRadius: 12,
          border: '1px solid var(--border)', padding: '14px 18px',
          transition: 'border-color 0.2s ease',
        }}>
          {loading ? (
            <span className="spin" style={{ fontSize: 20 }}>🏏</span>
          ) : (
            <span style={{ fontSize: 20 }}>🔍</span>
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about IPL 2024… e.g. 'Why did GT lose the powerplay?'"
            disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 16, fontFamily: 'var(--font-ui)',
            }}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              background: query.trim() ? 'var(--accent-teal)' : 'var(--bg-secondary)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontFamily: 'var(--font-ui)', fontWeight: 600,
              fontSize: 14, cursor: query.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s ease', opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Analysing…' : 'Analyse'}
          </button>
        </div>
      </form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SAMPLE_QUERIES.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleChip(chip.query)}
            disabled={loading}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', borderRadius: 20, padding: '6px 14px',
              fontSize: 12, fontFamily: 'var(--font-ui)', cursor: 'pointer',
              transition: 'all 0.2s ease', fontWeight: 500,
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent-teal)'; e.target.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
