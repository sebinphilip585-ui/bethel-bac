import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, Percent } from 'lucide-react';

const offers = [
  {
    title: 'Extended Stay Offer',
    desc: 'Book 7 nights or more and enjoy a special discounted rate on our premium apartments.',
    badge: 'Long Stay',
    discount: '15% OFF',
    icon: Clock,
    gradient: 'linear-gradient(135deg, #1B3A2D, #2A5A45)'
  },
  {
    title: 'Weekend Getaway',
    desc: 'Escape the routine with our weekend packages. Perfect for families and couples.',
    badge: 'Weekend',
    discount: '10% OFF',
    icon: Tag,
    gradient: 'linear-gradient(135deg, #2A2A2A, #4A4A4A)'
  },
  {
    title: 'Sabarimala Pilgrim Special',
    desc: 'Special rates for Sabarimala pilgrims. Comfortable stay with convenient location.',
    badge: 'Pilgrim',
    discount: 'Special Rate',
    icon: Percent,
    gradient: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'
  }
];

export default function SpecialOffers() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="section-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}
          >
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
            <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '11px', fontWeight: 600 }}>
              Exclusive Deals
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Special Offers
          </motion.h2>
        </div>

        <div className="grid grid-cols-3">
          {offers.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="offer-card"
                style={{
                  background: offer.gradient,
                  borderRadius: 'var(--radius-lg)',
                  padding: '40px 32px',
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {/* Decorative circle */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)'
                }} />

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <Icon size={18} />
                  <span style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    opacity: 0.8
                  }}>
                    {offer.badge}
                  </span>
                </div>

                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '32px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  lineHeight: 1
                }}>
                  {offer.discount}
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  marginBottom: '12px',
                  fontWeight: 500
                }}>
                  {offer.title}
                </h3>

                <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.7 }}>
                  {offer.desc}
                </p>

                <button style={{
                  marginTop: '24px',
                  padding: '10px 24px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  borderRadius: '2px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}>
                  Learn More
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style>{`
        .offer-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
      `}</style>
    </section>
  );
}
