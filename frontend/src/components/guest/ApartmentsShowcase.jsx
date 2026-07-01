import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Maximize, Users, ArrowRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function ApartmentsShowcase() {
  const { roomTypes } = useData();
  
  // Use a fallback image if room doesn't have one
  const getFallbackImage = (index) => {
    const fallbacks = [
      '/images/rooms/room-new-1.jpg',
      '/images/rooms/room-new-2.jpg',
      '/images/rooms/room-new-3.jpg',
      '/images/rooms/room-new-4.jpg',
      '/images/rooms/room-new-5.jpg'
    ];
    return fallbacks[index % fallbacks.length];
  };

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
          {roomTypes.slice(0, 6).map((apt, index) => (
            <motion.div
              key={apt.id}
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
                  src={(apt.images && apt.images.length > 0) ? apt.images[0] : getFallbackImage(index)} 
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
                  ₹{apt.base_price?.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontFamily: 'var(--font-body)' }}>/ Night</span>
                </div>
              </div>

              <div style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{apt.name}</h3>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>
                    <Maximize size={18} color="var(--color-gold)" />
                    {apt.size_sqft} SQ FT
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>
                    <Users size={18} color="var(--color-gold)" />
                    Up to {apt.max_guests} Guests
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/rooms/${apt.slug}`} style={{ fontSize: '12px', color: 'var(--color-text-light)', textDecoration: 'underline' }}>
                    View Details
                  </Link>
                  <Link to={`/booking?room=${apt.id}`} style={{ 
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
                  </Link>
                </div>
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
