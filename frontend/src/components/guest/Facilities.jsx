import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AirVent, Sofa, ChefHat, Tv, Wifi, Bath, Droplet, Archive, Utensils, Zap, Car, Shield, Clock, Heart, Calendar } from 'lucide-react';

const facilities = [
  { icon: AirVent, label: 'Air Conditioning' },
  { icon: Sofa, label: 'Fully Furnished' },
  { icon: ChefHat, label: 'Equipped Kitchen' },
  { icon: Tv, label: 'Smart TV' },
  { icon: Wifi, label: 'High-Speed Wi-Fi' },
  { icon: Bath, label: 'Attached Bathroom' },
  { icon: Droplet, label: 'Hot Water' },
  { icon: Archive, label: 'Wardrobe' },
  { icon: Utensils, label: 'Dining Area' },
  { icon: Zap, label: 'Power Backup' },
  { icon: Car, label: 'Free Parking' },
  { icon: Shield, label: 'CCTV Security' },
  { icon: Clock, label: '24x7 Guest Support' },
  { icon: Heart, label: 'Family Friendly' },
  { icon: Calendar, label: 'Long Stay Friendly' }
];

export default function Facilities() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div className="section-title">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}
          >
            Unmatched Comfort
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Premium Facilities
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
          gap: '32px'
        }}>
          {facilities.map((fac, index) => {
            const IconComponent = fac.icon;
            return (
              <motion.div
                key={fac.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="facility-card"
                style={{
                  backgroundColor: 'var(--color-cards)',
                  padding: '32px 24px',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ color: 'var(--color-gold)' }}>
                  <IconComponent size={32} strokeWidth={1.5} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
                  {fac.label}
                </h4>
              </motion.div>
            )
          })}
        </div>
      </div>
      <style>{`
        .facility-card:hover {
          background-color: var(--color-gold);
          border-color: var(--color-gold);
          color: white;
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }
        .facility-card:hover div {
          color: white !important;
        }
        .facility-card:hover h4 {
          color: white !important;
        }
      `}</style>
    </section>
  );
}
