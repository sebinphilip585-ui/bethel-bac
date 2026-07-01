import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Map, Home, Heart, Shield, CheckCircle } from 'lucide-react';

const reasons = [
  { icon: Star, title: 'Premium Serviced Apartments', desc: 'Experience the pinnacle of luxury living with fully serviced accommodation.' },
  { icon: Map, title: 'Prime Location', desc: 'Conveniently located near key attractions and transit hubs in Thiruvalla.' },
  { icon: Home, title: 'Spacious Accommodation', desc: 'Thoughtfully designed living spaces providing the ultimate comfort.' },
  { icon: CheckCircle, title: 'Affordable Luxury', desc: '5-star amenities without the exorbitant price tag.' },
  { icon: Heart, title: 'Peaceful Environment', desc: 'A serene getaway perfect for families and Sabarimala pilgrims.' },
  { icon: Shield, title: '24x7 Guest Support', desc: 'Round-the-clock assistance to ensure a flawless stay.' }
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '64px' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
              The Bethel Advantage
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--color-text)', marginBottom: '24px', lineHeight: 1.2 }}>
              Why Choose Bethel Meadows?
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '40px', fontSize: '1.1rem' }}>
              We redefine hospitality by offering the warmth of a home combined with the luxury of a premium hotel.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {reasons.slice(0, 3).map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--color-cards)', padding: '16px', borderRadius: '50%', height: 'fit-content', boxShadow: 'var(--shadow-luxury)' }}>
                    <r.icon size={24} color="var(--color-gold)" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '8px' }}>{r.title}</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <img 
              src="https://images.unsplash.com/photo-1574643033890-3330e791696b?auto=format&fit=crop&q=80" 
              alt="Luxury Living"
              style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '4px', boxShadow: 'var(--shadow-luxury)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {reasons.slice(3, 6).map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--color-cards)', padding: '16px', borderRadius: '50%', height: 'fit-content', boxShadow: 'var(--shadow-luxury)' }}>
                    <r.icon size={24} color="var(--color-gold)" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '8px' }}>{r.title}</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
