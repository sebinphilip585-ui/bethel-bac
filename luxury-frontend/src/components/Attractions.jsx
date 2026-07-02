import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

const attractions = [
  { name: 'Thiruvalla Railway Station', distance: '3 km', time: '10 mins', desc: 'Major transit hub connecting to all major cities.' },
  { name: 'Sabarimala', distance: '85 km', time: '2.5 hrs', desc: 'Prominent Hindu pilgrimage center in the Periyar Tiger Reserve.' },
  { name: 'Aranmula Parthasarathy Temple', distance: '12 km', time: '25 mins', desc: 'Ancient temple famous for the Aranmula boat race.' },
  { name: 'Maramon Convention', distance: '10 km', time: '20 mins', desc: 'One of the largest Christian gatherings in Asia.' },
  { name: "Niranam St. Mary's Church", distance: '9 km', time: '18 mins', desc: 'One of the oldest churches in India, founded by St. Thomas.' },
  { name: 'Pamba River', distance: '10 km', time: '20 mins', desc: 'Third longest river in Kerala, known as Dakshina Ganga.' },
  { name: 'Chengannur Railway Station', distance: '14 km', time: '30 mins', desc: 'Gateway to Sabarimala, a major railway stop.' },
  { name: 'Kottayam', distance: '28 km', time: '50 mins', desc: 'The city of letters, lakes, and latex.' }
];

export default function Attractions() {
  return (
    <section id="attractions" className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
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
              Explore The Region
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Nearby Attractions
          </motion.h2>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '20px' }}>
          {attractions.map((attr, index) => (
            <motion.div
              key={attr.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="attraction-card"
              style={{
                backgroundColor: 'var(--color-cards)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '28px 24px',
                transition: 'var(--transition-smooth)',
                cursor: 'default'
              }}
            >
              {/* Distance Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-gold-glow)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '16px'
              }}>
                <MapPin size={12} color="var(--color-gold)" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-gold)' }}>{attr.distance}</span>
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                marginBottom: '8px',
                fontWeight: 500,
                lineHeight: 1.3
              }}>
                {attr.name}
              </h4>

              <p style={{
                color: 'var(--color-text-light)',
                fontSize: '13px',
                marginBottom: '16px',
                lineHeight: 1.6
              }}>
                {attr.desc}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border-light)'
              }}>
                <Clock size={12} />
                {attr.time} from property
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .attraction-card:hover {
          border-color: var(--color-gold-border);
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </section>
  );
}
