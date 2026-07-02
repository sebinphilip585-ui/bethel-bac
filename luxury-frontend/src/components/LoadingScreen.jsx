import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px'
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        {/* Leaf Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ marginBottom: '16px', fontSize: '36px', color: '#C9A96E' }}
        >
          🌿
        </motion.div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: '#FFFFFF',
          fontWeight: 500,
          letterSpacing: '6px',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Bethel Meadows
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: '#C9A96E',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontWeight: 400
        }}>
          Luxury Serviced Apartments
        </p>
      </motion.div>

      {/* Gold Loading Bar */}
      <div style={{
        width: '200px',
        height: '2px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
            borderRadius: '4px'
          }}
        />
      </div>
    </motion.div>
  );
}
