import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGES = [
  '/images/property/room.png',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80'
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${HERO_IMAGES[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}
        />
      </AnimatePresence>

      {/* Dark Luxury Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(45, 45, 45, 0.4), rgba(45, 45, 45, 0.7))',
        zIndex: 2
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 24px'
      }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: 'var(--color-gold)',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            marginBottom: '24px'
          }}
        >
          Welcome to Bethel Meadows
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '1000px'
          }}
        >
          Experience Comfort at Bethel Meadows
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 300,
            marginBottom: '48px',
            maxWidth: '600px'
          }}
        >
          Premium Serviced Apartments in Eraviperoor, Thiruvalla.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/booking" className="btn-primary">Book Your Stay</Link>
          <a href="#apartments" className="btn-outline">Explore Apartments</a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-gold)' }}
        />
      </motion.div>
    </section>
  );
}
