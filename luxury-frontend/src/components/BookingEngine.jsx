import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingEngine() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [availability, setAvailability] = useState(null); // true, false, or null

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus(null);
    setAvailability(null);
  };

  const checkAvailability = async () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut) return;
    try {
      const res = await fetch(`http://localhost:5000/api/availability?roomId=${formData.roomId}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}`);
      const data = await res.json();
      setAvailability(data.available);
      if (data.available === false) {
        setStatus({ type: 'error', message: 'Room Not Available' });
      } else {
        setStatus({ type: 'success', message: 'Room Available' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotal = () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut) return 0;
    const room = rooms.find(r => r.id === formData.roomId);
    if (!room) return 0;

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return diffDays * room.price_per_night;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Booking Failed' });
      } else {
        setStatus({ type: 'success', message: 'Booking Confirmed' });
        setFormData({ roomId: '', checkIn: '', checkOut: '', guestName: '', guestEmail: '', guestPhone: '' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Booking Failed' });
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <section id="book" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '8px' }}>Reserve Your Stay</h2>
            <p style={{ color: 'var(--color-text-light)' }}>Experience luxury like never before.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>Select Room</label>
                <select name="roomId" value={formData.roomId} onChange={handleChange} required style={inputStyle}>
                  <option value="">-- Choose a Room --</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name} (₹{room.price_per_night}/night)</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>Full Name</label>
                <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required style={inputStyle} placeholder="John Doe" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>Email</label>
                <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} required style={inputStyle} placeholder="john@example.com" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>Phone</label>
                <input type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} required style={inputStyle} placeholder="+91 9876543210" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>Check In</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} onBlur={checkAvailability} required style={inputStyle} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-light)', fontSize: '14px' }}>Check Out</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} onBlur={checkAvailability} required style={inputStyle} />
              </div>
            </div>

            {total > 0 && (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--color-gold)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
                  <span>Total Amount:</span>
                  <span style={{ fontSize: '20px', color: 'var(--color-gold)' }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    backgroundColor: status.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                    color: status.type === 'error' ? '#ff4d4d' : '#4dff4d',
                    border: `1px solid ${status.type === 'error' ? '#ff4d4d' : '#4dff4d'}`
                  }}
                >
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading || availability === false}
              style={{
                backgroundColor: 'var(--color-gold)',
                color: '#fff',
                padding: '16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: (loading || availability === false) ? 'not-allowed' : 'pointer',
                opacity: (loading || availability === false) ? 0.7 : 1,
                transition: 'var(--transition-smooth)',
                marginTop: '16px'
              }}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: 'var(--color-text)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'var(--transition-smooth)',
  boxSizing: 'border-box'
};
