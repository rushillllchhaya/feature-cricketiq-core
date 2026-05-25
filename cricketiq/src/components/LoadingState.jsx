import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Reviewing the footage…",
  "Checking DLS calculations…",
  "Consulting the third umpire…",
  "Analysing run rate trajectories…",
  "Checking pitch report…",
  "Studying wagon wheel patterns…",
  "Reviewing field placements…",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{ marginTop: 24 }}>
      {/* Loading message */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span className="spin" style={{ fontSize: 22 }}>🏏</span>
        <span style={{ fontSize: 14, color: 'var(--accent-teal)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
          {MESSAGES[msgIndex]}
        </span>
      </div>
      {/* Skeleton: Answer */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="skeleton" style={{ height: 18, width: '90%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 18, width: '70%' }} />
      </div>
      {/* Skeleton: Metrics */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="card" style={{ flex: '1 1 200px', minWidth: 180 }}>
            <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
          </div>
        ))}
      </div>
      {/* Skeleton: Chart */}
      <div className="card">
        <div className="skeleton" style={{ height: 12, width: '30%', marginBottom: 16 }} />
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div className="skeleton" style={{ width: 40, height: 16 }} />
            <div className="skeleton" style={{ flex: 1, height: 28, borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
