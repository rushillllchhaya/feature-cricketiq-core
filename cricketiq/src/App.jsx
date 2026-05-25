import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import BackgroundAnimation from './components/BackgroundAnimation';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundAnimation />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '24px 0 0', borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(180deg, rgba(29,158,117,0.03) 0%, transparent 100%)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>🏏</span>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-ui)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
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
      </motion.header>

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px', position: 'relative', zIndex: 1 }}>
        <QueryBar onSubmit={handleQuery} loading={loading} />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card fade-in"
              style={{ marginTop: 20, borderLeft: '4px solid var(--accent-red)', background: 'rgba(226,75,74,0.06)' }}
            >
              <p style={{ color: 'var(--accent-red)', fontSize: 14 }}>⚠️ {error}</p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {!loading && result && (
            <motion.div
              key={`result-${queryKey}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <motion.div variants={itemVariants}>
                <AnswerBanner
                  narrative={narrative}
                  isNewbie={newbieMode}
                  onSpeak={(text) => toggleSpeech(text)}
                  speaking={speaking}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <MetricCards metrics={result.metrics} />
              </motion.div>

              <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: result.worm_data ? '1fr 1fr' : '1fr', gap: 16, marginTop: 0 }}>
                <div>
                  <PowerplayChart data={result.bar_chart} />
                  <PhaseBreakdown data={result.phase_data} showTooltips={newbieMode} />
                </div>
                {result.worm_data && (
                  <div>
                    <WormChart data={result.worm_data} />
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <InsightStrip insight={result.insight} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FollowUpChips chips={result.follow_ups} onSelect={handleQuery} loading={loading} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <SeasonComparison />
              </motion.div>
            </motion.div>
          )}

          {!loading && !result && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', marginTop: 80 }}
            >
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
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, borderColor: 'var(--accent-teal)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuery(item.q)}
                    style={{
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      borderRadius: 12, padding: '16px', cursor: 'pointer', textAlign: 'left',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 8, fontFamily: 'var(--font-ui)' }}>{item.q}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
