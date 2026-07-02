import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Users, ArrowRight, Wifi, AirVent, Tv, ChefHat, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROOM_FACILITIES = {
  '1 BHK': [
    { icon: AirVent, label: 'AC' },
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Tv, label: 'Smart TV' },
    { icon: ChefHat, label: 'Kitchen' }
  ],
  '2 BHK': [
    { icon: AirVent, label: 'AC' },
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Tv, label: 'Smart TV' },
    { icon: ChefHat, label: 'Kitchen' }
  ],
  '3 BHK': [
    { icon: AirVent, label: 'AC' },
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Tv, label: 'Smart TV' },
    { icon: ChefHat, label: 'Kitchen' }
  ]
};

const ROOM_IMAGES = [
  '/images/media__1782958486920.jpg',
  '/images/media__1782958486604.jpg',
  '/images/media__1782958486624.jpg',
  '/images/media__1782958486674.jpg',
  '/images/media__1782959875778.jpg',
];

export default function ApartmentsShowcase() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const FALLBACK_ROOMS = [
    { id: '1', name: 'Beckingham', type: '2 BHK', price_per_night: 4500, images: ['/images/media__1782958486604.jpg'] },
    { id: '2', name: 'Beverly Hills', type: '2 BHK', price_per_night: 4500, images: ['/images/media__1782958486624.jpg'] },
    { id: '3', name: 'Belrose', type: '1 BHK', price_per_night: 2500, images: ['/images/media__1782958486674.jpg'] },
    { id: '4', name: 'Blooms Bay', type: '2 BHK', price_per_night: 4500, images: ['/images/media__1782958486920.jpg'] },
    { id: '5', name: 'Blue Bell', type: '1 BHK', price_per_night: 2500, images: ['/images/media__1782958486604.jpg'] },
    { id: '6', name: 'Beehive', type: '1 BHK', price_per_night: 2500, images: ['/images/media__1782958486624.jpg'] },
    { id: '7', name: 'Belarus', type: '3 BHK', price_per_night: 6500, images: ['/images/media__1782958486674.jpg'] },
    { id: '8', name: 'Breeze Garden', type: '1 BHK', price_per_night: 2500, images: ['/images/media__1782958486920.jpg'] },
    { id: '9', name: 'Brook Hills', type: '1 BHK', price_per_night: 2500, images: ['/images/media__1782958486604.jpg'] },
    { id: '10', name: 'Bliss Heaven', type: '1 BHK', price_per_night: 2500, images: ['/images/media__1782958486624.jpg'] }
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/rooms`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        let data = await response.json();
        if (!data || data.length === 0) data = FALLBACK_ROOMS;
        data.sort((a, b) => a.name.localeCompare(b.name));
        setApartments(data);
      } catch (err) {
        console.error('API failed, using fallback data:', err);
        setApartments(FALLBACK_ROOMS.sort((a, b) => a.name.localeCompare(b.name)));
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filters = ['All', '1 BHK', '2 BHK', '3 BHK'];
  const filtered = activeFilter === 'All' ? apartments : apartments.filter(a => a.type === activeFilter);

  const getRoomImage = (apt, index) => {
    if (apt.images && apt.images.length > 0 && !apt.images[0].includes('unsplash')) {
      return apt.images[0];
    }
    return ROOM_IMAGES[index % ROOM_IMAGES.length];
  };

  if (loading) {
    return (
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid var(--color-gold-border)',
                borderTopColor: 'var(--color-gold)',
                borderRadius: '50%'
              }}
            />
            Loading Rooms...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apartments" className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}
          >
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
            <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '11px', fontWeight: 600 }}>
              Refined Living Spaces
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Our Premium Apartments
          </motion.h2>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px', flexWrap: 'wrap' }}
        >
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '10px 28px',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                border: '1px solid',
                borderColor: activeFilter === f ? 'var(--color-gold)' : 'var(--color-border)',
                background: activeFilter === f ? 'var(--color-gold)' : 'transparent',
                color: activeFilter === f ? '#fff' : 'var(--color-text-secondary)',
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Room Cards */}
        <div className="grid grid-cols-3" style={{ gap: '28px' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((apt, index) => (
              <motion.div
                key={apt.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredId(apt.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: 'var(--color-cards)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: hoveredId === apt.id ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
                  transition: 'var(--transition-smooth)',
                  transform: hoveredId === apt.id ? 'translateY(-8px)' : 'translateY(0)',
                  border: '1px solid',
                  borderColor: hoveredId === apt.id ? 'var(--color-gold-border)' : 'var(--color-border-light)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => navigate(`/rooms/${apt.id}`)}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '260px' }}>
                  <img
                    src={getRoomImage(apt, index)}
                    alt={apt.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                      transform: hoveredId === apt.id ? 'scale(1.08)' : 'scale(1)'
                    }}
                  />

                  {/* Glass Overlay on Hover */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(26,26,26,0.6) 100%)',
                    opacity: hoveredId === apt.id ? 1 : 0.5,
                    transition: 'var(--transition-smooth)'
                  }} />

                  {/* Room Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(26, 26, 26, 0.7)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    padding: '6px 16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    borderRadius: '2px'
                  }}>
                    {apt.type}
                  </div>

                  {/* Availability Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(46, 204, 113, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '2px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ECC71', boxShadow: '0 0 8px rgba(46,204,113,0.5)' }} />
                    <span style={{ color: '#2ECC71', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Available</span>
                  </div>

                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 16px',
                    borderRadius: '2px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-text)', fontWeight: 600 }}>
                      ₹{apt.price_per_night?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-light)', marginLeft: '4px' }}>/ night</span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    marginBottom: '12px',
                    fontWeight: 500,
                    color: 'var(--color-text)'
                  }}>
                    {apt.name}
                  </h3>

                  {/* Room Info */}
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-light)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-light)', fontSize: '13px' }}>
                      <Maximize size={14} color="var(--color-gold)" />
                      {apt.type}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-light)', fontSize: '13px' }}>
                      <Users size={14} color="var(--color-gold)" />
                      {apt.type === '1 BHK' ? '1-2' : apt.type === '2 BHK' ? '3-4' : '5-6'} Guests
                    </div>
                  </div>

                  {/* Facilities */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {(ROOM_FACILITIES[apt.type] || ROOM_FACILITIES['1 BHK']).map((fac, i) => {
                      const Icon = fac.icon;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '11px' }}>
                          <Icon size={13} strokeWidth={1.5} />
                          {fac.label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/booking?room=${apt.id}`); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '12px',
                      background: hoveredId === apt.id ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'transparent',
                      color: hoveredId === apt.id ? '#fff' : 'var(--color-gold)',
                      border: '1px solid var(--color-gold)',
                      borderRadius: '2px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    Book Now
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Gold bottom accent */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                  opacity: hoveredId === apt.id ? 1 : 0,
                  transition: 'var(--transition-smooth)'
                }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
