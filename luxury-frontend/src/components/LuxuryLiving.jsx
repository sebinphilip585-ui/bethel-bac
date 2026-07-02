import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Home, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Nature Inspired',
    desc: 'Surrounded by lush greenery and fresh air, our apartments offer a serene escape from the city bustle.'
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assured',
    desc: 'Every detail is crafted with precision — from premium fixtures to thoughtful interior design.'
  },
  {
    icon: Home,
    title: 'Premium Apartments',
    desc: 'Spacious 1, 2 & 3 BHK fully furnished apartments with modern amenities and luxury finishes.'
  },
  {
    icon: Sparkles,
    title: 'Community Living',
    desc: 'A vibrant community space designed for balance, growth, and everyday well-being.'
  }
];

export default function LuxuryLiving() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-cream)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-gold-glow) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '80px' }}>
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <img
                  src="/images/media__1782958486674.jpg"
                  alt="Kitchen and living area"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <img
                  src="/images/media__1782958486604.jpg"
                  alt="Comfortable sofa"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
              </div>
              <div style={{ paddingTop: '40px' }}>
                <img
                  src="/images/media__1782958486624.jpg"
                  alt="Entertainment setup"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '20px',
                background: 'var(--color-gold)',
                color: '#fff',
                padding: '20px 24px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 600, lineHeight: 1 }}>M Square</div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px', opacity: 0.9 }}>3rd Floor, Eraviperoor</div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
              <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '11px', fontWeight: 600 }}>
                The Experience
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              marginBottom: '24px',
              lineHeight: 1.2,
              fontWeight: 500
            }}>
              Luxury Living, Reimagined
            </h2>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Live close to nature. Stay close to life. Our premium apartments are designed for balance, growth, and everyday well-being — offering the perfect blend of modern luxury and natural serenity.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    style={{ display: 'flex', gap: '14px' }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'var(--color-gold-glow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={18} color="var(--color-gold)" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', marginBottom: '4px', fontWeight: 600 }}>
                        {feature.title}
                      </h4>
                      <p style={{ color: 'var(--color-text-light)', fontSize: '13px', lineHeight: 1.6 }}>
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
