import React from 'react';
import { motion } from 'framer-motion';

export default function Marquee() {
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--color-cards)',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      padding: '24px 0',
      display: 'flex',
      alignItems: 'center'
    }}>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
        style={{
          display: 'flex',
          gap: '64px',
          whiteSpace: 'nowrap',
          alignItems: 'center'
        }}
      >
        {/* Repeat the content twice for seamless looping */}
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Premium Living
            </span>
            <img 
              src="/images/media__1782958487848.jpg" 
              alt="M Square Mall" 
              style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              M Square Mall, 3rd Floor
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Eraviperoor, Thiruvalla
            </span>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
