import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const features = [
    { number: '10', label: 'Premium Apartments' },
    { number: '24/7', label: 'Guest Support' },
    { number: '100%', label: 'Fully Furnished' },
    { number: '✓', label: 'Family Friendly' }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-cards)' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '64px' }}>
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
              About Bethel Meadows
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--color-text)', marginBottom: '24px', lineHeight: 1.2 }}>
              A Sanctuary of Elegance in Thiruvalla
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', fontSize: '1.1rem' }}>
              Welcome to Bethel Meadows, where luxury meets the warmth of a home. We offer premium serviced apartments perfect for families, couples, business travellers, Sabarimala pilgrims, and long-stay guests.
            </p>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '40px' }}>
              Our fully furnished apartments feature air conditioning, equipped kitchens, smart TVs, high-speed Wi-Fi, and a peaceful environment to ensure a comfortable and unforgettable stay.
            </p>
            
            <a href="#apartments" className="btn-outline" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
              Discover Our Spaces
            </a>
          </motion.div>

          {/* Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <img 
              src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80" 
              alt="Bethel Meadows Interior"
              style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '4px', boxShadow: 'var(--shadow-luxury)' }}
            />
            
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              backgroundColor: 'var(--color-bg)',
              padding: '40px',
              boxShadow: 'var(--shadow-hover)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {features.map((f, idx) => (
                  <div key={idx}>
                    <div style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', lineHeight: 1 }}>{f.number}</div>
                    <div style={{ color: 'var(--color-text)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
