import React from 'react';
import { motion } from 'framer-motion';

export default function InsightStrip({ insight }) {
  if (!insight) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: [
          "0 0 0px rgba(29,158,117,0)",
          "0 0 18px rgba(29,158,117,0.4)",
          "0 0 4px rgba(29,158,117,0.1)"
        ]
      }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 0.5 },
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }
      }}
      className="card"
      style={{
        marginTop: 20, borderLeft: '4px solid var(--accent-teal)',
        background: 'linear-gradient(90deg, rgba(29,158,117,0.08), var(--bg-secondary))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: 15, fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {insight}
        </p>
      </div>
    </motion.div>
  );
}
