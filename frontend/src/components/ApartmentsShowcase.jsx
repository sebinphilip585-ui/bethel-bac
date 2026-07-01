import React from 'react';
import { motion } from 'framer-motion';
import { Maximize, Users, ArrowRight } from 'lucide-react';

const apartments = [
  { name: 'Beckingham', bhk: '2BHK', price: 4500, image: 'https://images.unsplash.com/photo-1598928506311-c55d40f92716?auto=format&fit=crop&q=80' },
  { name: 'Beverly Hills', bhk: '2BHK', price: 4500, image: 'https://images.unsplash.com/photo-1502672260266-1c1e87418fd6?auto=format&fit=crop&q=80' },
  { name: 'Belrose', bhk: '1BHK', price: 2500, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80' },
  { name: 'Blooms Bay', bhk: '2BHK', price: 4500, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' },
  { name: 'Blue Bell', bhk: '1BHK', price: 2500, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80' },
  { name: 'Beehive', bhk: '1BHK', price: 2500, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80' },
  { name: 'Belarus', bhk: '3BHK', price: 6500, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80' },
  { name: 'Breeze Garden', bhk: '1BHK', price: 2500, image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80' },
  { name: 'Brook Hills', bhk: '1BHK', price: 2500, image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80' },
  { name: 'Bliss Heaven', bhk: '1BHK', price: 2500, image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80' },
];

export default function ApartmentsShowcase() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="section-title">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}
          >
            Refined Living Spaces
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Our Premium Apartments
          </motion.h2>
        </div>

        <div className="grid grid-cols-3">
          {apartments.map((apt, index) => (
            <motion.div
              key={apt.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: 'var(--color-cards)',
                boxShadow: 'var(--shadow-luxury)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition-smooth)'
              }}
              className="apartment-card"
            >
              <div style={{ position: 'relative', overflow: 'hidden', height: '280px' }}>
                <img 
                  src={apt.image} 
                  alt={apt.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  className="apartment-img"
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  color: 'var(--color-text)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  ₹{apt.price.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontFamily: 'var(--font-body)' }}>/ Night</span>
                </div>
              </div>

              <div style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{apt.name}</h3>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>
                    <Maximize size={18} color="var(--color-gold)" />
                    {apt.bhk}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>
                    <Users size={18} color="var(--color-gold)" />
                    {apt.bhk === '1BHK' ? '1-2 Guests' : apt.bhk === '2BHK' ? '3-4 Guests' : '5-6 Guests'}
                  </div>
                </div>

                <a href="#book" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--color-gold)', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '12px'
                }}>
                  Book Now <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .apartment-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-hover);
        }
        .apartment-card:hover .apartment-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
