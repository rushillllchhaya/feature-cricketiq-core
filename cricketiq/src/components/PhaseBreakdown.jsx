import React from 'react';
import { motion } from 'framer-motion';
import { getStatusColor, JARGON } from '../utils/dataHelpers';

function PhaseCard({ label, data, delay, showTooltips }) {
  if (!data) return null;
  const statusColor = getStatusColor(data.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay / 1000
      }}
      className="card"
      style={{
        flex: '1 1 200px', minWidth: 180,
        borderTop: `3px solid ${statusColor}`, position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: statusColor, opacity: 0.3,
      }} />
      <h4 style={{
        fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12,
        cursor: showTooltips ? 'help' : 'default',
      }}
        title={showTooltips ? JARGON[label] || '' : undefined}
      >
        {label}
      </h4>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 4 }}>
        {data.run_rate}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        RR per over
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Wickets</span>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: data.wickets > 2 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
            {data.wickets}
          </div>
        </div>
        <div style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
          background: `${statusColor}20`, color: statusColor, alignSelf: 'flex-end',
        }}>
          {data.status?.toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
}

export default function PhaseBreakdown({ data, showTooltips }) {
  if (!data) return null;
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
      <PhaseCard label="Powerplay" data={data.powerplay} delay={0} showTooltips={showTooltips} />
      <PhaseCard label="Middle Overs" data={data.middle} delay={80} showTooltips={showTooltips} />
      <PhaseCard label="Death Overs" data={data.death} delay={160} showTooltips={showTooltips} />
    </div>
  );
}
