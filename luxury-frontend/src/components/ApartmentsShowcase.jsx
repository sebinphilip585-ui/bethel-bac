import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Users, ArrowRight } from 'lucide-react';

export default function ApartmentsShowcase() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        
        // Sort rooms so they always appear in the same order
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        setApartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontSize: '24px' }}>
          Loading Luxurious Rooms...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)', textAlign: 'center' }}>
        <div style={{ color: 'red', fontFamily: 'var(--font-heading)', fontSize: '24px' }}>
          Error: {error}
        </div>
      </section>
    );
  }

  return (
    <section id="apartments" className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
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
              key={apt.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
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
                  src={apt.images && apt.images.length > 0 ? apt.images[0] : 'https://images.unsplash.com/photo-1598928506311-c55d40f92716?auto=format&fit=crop&q=80'} 
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
                  ₹{apt.price_per_night.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontFamily: 'var(--font-body)' }}>/ Night</span>
                </div>
              </div>

              <div style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{apt.name}</h3>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>
                    <Maximize size={18} color="var(--color-gold)" />
                    {apt.type}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>
                    <Users size={18} color="var(--color-gold)" />
                    {apt.type === '1 BHK' ? '1-2 Guests' : apt.type === '2 BHK' ? '3-4 Guests' : '5-6 Guests'}
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
