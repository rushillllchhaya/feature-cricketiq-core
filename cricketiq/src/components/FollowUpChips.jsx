import React from 'react';
import { motion } from 'framer-motion';

export default function FollowUpChips({ chips, onSelect, loading }) {
  if (!chips?.length) return null;
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
      {chips.map((chip, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.12,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.05, borderColor: 'var(--accent-teal)', background: 'rgba(29,158,117,0.08)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', borderRadius: 24, padding: '10px 18px',
            fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s', display: 'flex', alignItems: 'center', gap: 6,
          }}
          disabled={loading}
          onClick={() => onSelect(chip)}
        >
          <span style={{ color: 'var(--accent-teal)' }}>→</span> {chip}
        </motion.button>
      ))}
    </div>
  );
}
