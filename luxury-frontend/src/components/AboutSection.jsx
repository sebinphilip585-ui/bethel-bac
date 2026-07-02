import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const isNumeric = !isNaN(target);
    if (!isNumeric) { setCount(target); return; }

    const num = parseInt(target);
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {typeof count === 'number' ? count : target}{suffix}
    </span>
  );
}

export default function AboutSection() {
  const features = [
    { number: '10', suffix: '+', label: 'Premium Apartments' },
    { number: '24', suffix: '/7', label: 'Guest Support' },
    { number: '100', suffix: '%', label: 'Fully Furnished' },
    { number: '5', suffix: '★', label: 'Guest Rating' }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-cards)' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '80px' }}>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
              <span style={{
                color: 'var(--color-gold)',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                About Bethel Meadows
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-text)',
              marginBottom: '24px',
              lineHeight: 1.2,
              fontWeight: 500
            }}>
              A Sanctuary of Elegance in Thiruvalla
            </h2>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Welcome to Bethel Meadows, where luxury meets the warmth of a home. Situated at M Square Mall, 3rd Floor, Eraviperoor, we offer premium serviced apartments perfect for families, couples, business travellers, Sabarimala pilgrims, and long-stay guests.
            </p>

            <p style={{ color: 'var(--color-text-light)', marginBottom: '40px', lineHeight: 1.8 }}>
              Our fully furnished apartments feature air conditioning, equipped kitchens, smart TVs, high-speed Wi-Fi, and a peaceful environment to ensure a comfortable and unforgettable stay.
            </p>

            <a href="#apartments" className="btn-outline-dark" onClick={(e) => { e.preventDefault(); document.getElementById('apartments')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Discover Our Spaces
            </a>
          </motion.div>

          {/* Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src="/images/media__1782958486920.jpg"
                alt="Bethel Meadows Premium Bedroom"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '550px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />

              {/* Gold Accent Border */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                width: '100%',
                height: '100%',
                border: '1px solid var(--color-gold-border)',
                borderRadius: '4px',
                zIndex: -1
              }} />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                backgroundColor: 'var(--color-bg)',
                padding: '32px 36px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                {features.map((f, idx) => (
                  <div key={idx}>
                    <div style={{
                      color: 'var(--color-gold)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.2rem',
                      lineHeight: 1,
                      fontWeight: 600
                    }}>
                      <AnimatedCounter target={f.number} suffix={f.suffix} />
                    </div>
                    <div style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      marginTop: '8px',
                      fontWeight: 500
                    }}>
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
