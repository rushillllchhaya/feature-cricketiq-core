import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnswerBanner({ narrative, isNewbie, onSpeak, speaking }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!narrative) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(narrative.slice(0, i));
      if (i >= narrative.length) {
        clearInterval(intervalRef.current);
        setDone(true);
      }
    }, 18);
    return () => clearInterval(intervalRef.current);
  }, [narrative]);

  if (!narrative) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{ marginTop: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: 'italic', fontSize: 17, lineHeight: 1.7,
            color: 'var(--text-primary)',
          }}
             dangerouslySetInnerHTML={{
               __html: displayed.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent-teal)">$1</strong>')
             }}
          />
          {!done && <span className="typewriter-cursor" />}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSpeak(narrative)}
          style={{
            background: speaking ? 'var(--accent-teal)' : 'var(--bg-tertiary)',
            border: 'none', borderRadius: 8, padding: '8px 12px',
            cursor: 'pointer', fontSize: 18, flexShrink: 0,
            transition: 'background 0.2s',
          }}
          title={speaking ? 'Stop' : 'Listen'}
        >
          {speaking ? '🔊' : '🔈'}
        </motion.button>
      </div>
      <AnimatePresence>
        {isNewbie && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: 12, padding: '8px 12px', background: 'rgba(29,158,117,0.08)',
              borderRadius: 8, borderLeft: '3px solid var(--accent-teal)',
              fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-ai)',
            }}
          >
            🎓 Beginner mode active
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
