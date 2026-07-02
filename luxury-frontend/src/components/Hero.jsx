import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users, Search } from 'lucide-react';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouse = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/booking?${params.toString()}`);
  };

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <section
      ref={heroRef}
      style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', minHeight: '700px' }}
      id="hero"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-5%',
          backgroundImage: 'url(/images/media__1782959875778.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.1)`,
          transition: 'transform 0.3s ease-out',
          zIndex: 1
        }}
      />

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.5) 50%, rgba(26,26,26,0.75) 100%)',
        zIndex: 2
      }} />

      {/* Decorative Gold Lines */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '1px',
        height: '120px',
        background: 'linear-gradient(180deg, transparent, rgba(201,169,110,0.4), transparent)',
        zIndex: 3
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '5%',
        width: '1px',
        height: '80px',
        background: 'linear-gradient(180deg, transparent, rgba(201,169,110,0.4), transparent)',
        zIndex: 3
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 24px',
        paddingTop: '60px'
      }}>
        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}
        >
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--color-gold)'
          }} />
          <span style={{
            color: 'var(--color-gold)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            fontWeight: 500
          }}>
            Eraviperoor, Thiruvalla
          </span>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--color-gold)'
          }} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '900px',
            letterSpacing: '-0.02em'
          }}
        >
          Bethel Meadows
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            fontWeight: 300,
            marginBottom: '16px',
            maxWidth: '600px',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.5px'
          }}
        >
          Luxury Serviced Apartments in Thiruvalla
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            fontWeight: 300,
            marginBottom: '48px',
            maxWidth: '500px',
            fontStyle: 'italic',
            fontFamily: 'var(--font-accent)'
          }}
        >
          Rooted in Nature. Built for Life.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}
        >
          <a href="/booking" onClick={(e) => { e.preventDefault(); navigate('/booking'); }} className="btn-primary">
            Book Your Stay
          </a>
          <a href="#apartments" onClick={(e) => { e.preventDefault(); document.getElementById('apartments')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-outline">
            Explore Apartments
          </a>
        </motion.div>

        {/* Floating Booking Search */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '0',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
            maxWidth: '850px',
            width: '100%'
          }}
          className="hero-booking-form"
        >
          <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid var(--color-border-light)', minWidth: '160px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '6px' }}>
              <CalendarDays size={13} color="var(--color-gold)" />
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '15px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', width: '100%', cursor: 'pointer' }}
              aria-label="Check-in date"
            />
          </div>

          <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid var(--color-border-light)', minWidth: '160px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '6px' }}>
              <CalendarDays size={13} color="var(--color-gold)" />
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '15px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', width: '100%', cursor: 'pointer' }}
              aria-label="Check-out date"
            />
          </div>

          <div style={{ flex: 0.6, padding: '16px 24px', borderRight: '1px solid var(--color-border-light)', minWidth: '120px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '6px' }}>
              <Users size={13} color="var(--color-gold)" />
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '15px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', width: '100%', cursor: 'pointer', appearance: 'none' }}
              aria-label="Number of guests"
            >
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
              color: '#fff',
              border: 'none',
              padding: '16px 32px',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'}
            aria-label="Search available rooms"
          >
            <Search size={16} />
            <span className="search-btn-text">Search</span>
          </button>
        </motion.form>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{ width: '1px', height: '30px', background: 'linear-gradient(180deg, var(--color-gold), transparent)' }}
        />
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-booking-form {
            flex-direction: column !important;
            margin: 0 16px;
          }
          .hero-booking-form > div {
            border-right: none !important;
            border-bottom: 1px solid var(--color-border-light);
          }
          .search-btn-text { display: inline; }
        }
      `}</style>
    </section>
  );
}
