import React from 'react';
import { motion } from 'framer-motion';
import { AirVent, Sofa, ChefHat, Tv, Wifi, Bath, Droplet, Archive, Utensils, Zap, Car, Shield, Clock, Heart, Calendar } from 'lucide-react';

const facilities = [
  { icon: AirVent, label: 'Air Conditioning', desc: 'Climate controlled rooms' },
  { icon: Sofa, label: 'Fully Furnished', desc: 'Premium interiors' },
  { icon: ChefHat, label: 'Equipped Kitchen', desc: 'Cook at your ease' },
  { icon: Tv, label: 'Smart TV', desc: 'LED entertainment' },
  { icon: Wifi, label: 'High-Speed Wi-Fi', desc: 'Stay connected' },
  { icon: Bath, label: 'Attached Bathroom', desc: 'Modern fittings' },
  { icon: Droplet, label: 'Hot Water', desc: '24/7 availability' },
  { icon: Archive, label: 'Wardrobe', desc: 'Ample storage' },
  { icon: Utensils, label: 'Dining Area', desc: 'Comfortable dining' },
  { icon: Zap, label: 'Power Backup', desc: 'Uninterrupted supply' },
  { icon: Car, label: 'Free Parking', desc: 'Secure parking' },
  { icon: Shield, label: 'CCTV Security', desc: 'Round-the-clock safety' },
  { icon: Clock, label: '24x7 Support', desc: 'Always available' },
  { icon: Heart, label: 'Family Friendly', desc: 'Kid-safe spaces' },
  { icon: Calendar, label: 'Long Stay', desc: 'Extended stay welcome' }
];

export default function Facilities() {
  return (
    <section id="facilities" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
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
              Unmatched Comfort
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Premium Amenities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Experience a blend of luxury and convenience with our thoughtfully curated amenities.
          </motion.p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {facilities.map((fac, index) => {
            const IconComponent = fac.icon;
            return (
              <motion.div
                key={fac.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="facility-card"
                style={{
                  backgroundColor: 'var(--color-cards)',
                  padding: '28px 20px',
                  textAlign: 'center',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'var(--transition-smooth)',
                  cursor: 'default'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--color-gold-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                className="facility-icon-wrap"
                >
                  <IconComponent size={22} strokeWidth={1.5} color="var(--color-gold)" className="facility-icon" />
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  color: 'var(--color-text)'
                }}>
                  {fac.label}
                </h4>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.4
                }}>
                  {fac.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style>{`
        .facility-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-4px);
          box-shadow: var(--shadow-gold);
        }
        .facility-card:hover .facility-icon-wrap {
          background: var(--color-gold) !important;
        }
        .facility-card:hover .facility-icon {
          color: white !important;
          stroke: white !important;
        }
      `}</style>
    </section>
  );
}
