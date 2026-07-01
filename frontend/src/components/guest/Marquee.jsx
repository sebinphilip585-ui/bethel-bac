import React from 'react';
import { motion } from 'framer-motion';

export default function Marquee() {
  return (
    <section style={{ backgroundColor: 'var(--color-bg)', padding: '60px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid var(--color-gold)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
        >
          <img src="/images/property/facade.jpg" alt="Bethel Meadows Facade" style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-text)', marginBottom: '8px' }}>
              Bethel Meadows Building Facade
            </h3>
            <p style={{ color: 'var(--color-gold)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
              Eraviperoor, Thiruvalla, Kerala
            </p>
          </div>
        </motion.div>
      </div>
      
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'var(--color-text)', padding: '20px 0', marginTop: '60px' }}>
        <div style={{ 
          display: 'inline-block', 
          color: 'var(--color-gold)', 
          fontSize: '13px', 
          fontWeight: 600, 
          letterSpacing: '3px', 
          textTransform: 'uppercase',
          animation: 'marqueeAnim 30s linear infinite'
        }}>
          <style>{`
            @keyframes marqueeAnim {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          ✦ Fully Furnished Apartments ✦ 24/7 Guest Support ✦ Sabarimala Pilgrim Friendly ✦ High-Speed Wi-Fi ✦ Peaceful Environment ✦ Free Parking ✦ Fully Furnished Apartments ✦ 24/7 Guest Support ✦ Sabarimala Pilgrim Friendly ✦ High-Speed Wi-Fi ✦ Peaceful Environment ✦ Free Parking ✦
        </div>
      </div>
    </section>
  );
}
