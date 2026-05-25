import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      {/* Ambient Blobs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 400 + 300,
            height: Math.random() * 400 + 300,
            borderRadius: '50%',
            background: i % 2 === 0 ? 'rgba(29,158,117,0.08)' : 'rgba(55,122,221,0.05)',
            filter: 'blur(80px)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: -1,
          }}
        />
      ))}

      {/* Subtle Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        opacity: 0.3,
      }} />
    </div>
  );
};

export default BackgroundAnimation;
