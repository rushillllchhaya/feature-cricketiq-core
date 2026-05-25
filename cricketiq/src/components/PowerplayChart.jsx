import React from 'react';
import { motion } from 'framer-motion';
import { BAR_COLORS } from '../utils/dataHelpers';

export default function PowerplayChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.value)) * 1.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{ marginTop: 20 }}
    >
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
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / max) * 100}%` }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  type: "spring",
                  stiffness: 60,
                  damping: 15
                }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${BAR_COLORS[item.color] || BAR_COLORS.teal}, ${BAR_COLORS[item.color] || BAR_COLORS.teal}dd)`,
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10,
                }}
              >
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
                  {item.value}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
