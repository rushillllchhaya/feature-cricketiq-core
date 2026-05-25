import React, { useState } from 'react';
import { useAnalyst } from './hooks/useAnalyst';
import { useSpeech } from './hooks/useSpeech';
import QueryBar from './components/QueryBar';
import AnswerBanner from './components/AnswerBanner';
import MetricCards from './components/MetricCards';
import PowerplayChart from './components/PowerplayChart';
import PhaseBreakdown from './components/PhaseBreakdown';
import WormChart from './components/WormChart';
import InsightStrip from './components/InsightStrip';
import FollowUpChips from './components/FollowUpChips';
import LoadingState from './components/LoadingState';
import NewbieToggle from './components/NewbieToggle';
import SeasonComparison from './components/SeasonComparison';
import './styles/animations.css';

export default function App() {
  const { analyse, loading, result, error } = useAnalyst();
  const { speaking, toggle: toggleSpeech } = useSpeech();
  const [newbieMode, setNewbieMode] = useState(false);
  const [queryKey, setQueryKey] = useState(0);

  const handleQuery = (query) => {
    setQueryKey(k => k + 1);
    analyse(query, newbieMode);
  };

  const narrative = result
    ? (newbieMode && result.newbie_narrative ? result.newbie_narrative : result.narrative)
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="animate-slide-up" style={{
        padding: '24px 0 0', borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(29,158,117,0.03) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>🏏</span>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-ui)', letterSpacing: '-0.02em' }}>
                  Cricket<span style={{ color: 'var(--accent-teal)' }}>IQ</span>
                </h1>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>
                  AI-Powered Match Analyst
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)' }}>
                <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-teal)', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>IPL 2024 Data</span>
              </div>
              <NewbieToggle enabled={newbieMode} onToggle={() => setNewbieMode(!newbieMode)} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
        <QueryBar onSubmit={handleQuery} loading={loading} />

        {error && (
          <div className="card fade-in" style={{ marginTop: 20, borderLeft: '4px solid var(--accent-red)', background: 'rgba(226,75,74,0.06)' }}>
            <p style={{ color: 'var(--accent-red)', fontSize: 14 }}>⚠️ {error}</p>
          </div>
        )}

        {loading && <LoadingState />}

        {!loading && result && (
          <div key={queryKey}>
            <AnswerBanner
              narrative={narrative}
              isNewbie={newbieMode}
              onSpeak={(text) => toggleSpeech(text)}
              speaking={speaking}
            />
            <MetricCards metrics={result.metrics} />

            <div style={{ display: 'grid', gridTemplateColumns: result.worm_data ? '1fr 1fr' : '1fr', gap: 16, marginTop: 0 }}>
              <div>
                <PowerplayChart data={result.bar_chart} />
                <PhaseBreakdown data={result.phase_data} showTooltips={newbieMode} />
              </div>
              {result.worm_data && (
                <div>
                  <WormChart data={result.worm_data} />
                </div>
              )}
            </div>

            <InsightStrip insight={result.insight} />
            <FollowUpChips chips={result.follow_ups} onSelect={handleQuery} loading={loading} />
            <SeasonComparison />
          </div>
        )}

        {/* Empty state */}
        {!loading && !result && !error && (
          <div className="animate-slide-up delay-200" style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏏</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Ask anything about IPL 2024
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              Get AI-powered analysis with animated charts, phase breakdowns, and deep insights. Try clicking one of the chips above.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginTop: 32, maxWidth: 700, margin: '32px auto 0' }}>
              {[
                { q: "Why did GT lose the powerplay vs RCB?", icon: "📊" },
                { q: "Who is the best death bowler this season?", icon: "🎯" },
                { q: "Compare Virat Kohli and Rohit Sharma", icon: "⚔️" },
              ].map((item, i) => (
                <button key={i} onClick={() => handleQuery(item.q)} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '16px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-teal)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 8, fontFamily: 'var(--font-ui)' }}>{item.q}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
