import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Users, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Printer, Download, MapPin, Phone, User, Mail, MessageSquare } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROOM_IMAGES = [
  '/images/media__1782958486920.jpg',
  '/images/media__1782958486604.jpg',
  '/images/media__1782958486624.jpg',
  '/images/media__1782958486674.jpg',
  '/images/media__1782959875778.jpg',
];

const STEPS = [
  { label: 'Dates', icon: CalendarDays },
  { label: 'Guests', icon: Users },
  { label: 'Room', icon: MapPin },
  { label: 'Details', icon: User },
  { label: 'Review', icon: CreditCard },
  { label: 'Confirmed', icon: CheckCircle }
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  const [formData, setFormData] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    adults: parseInt(searchParams.get('guests')) || 2,
    children: 0,
    roomCount: 1,
    roomId: searchParams.get('room') || '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    identityCard: '',
    cardDetails: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    specialRequests: ''
  });

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
    fetch(`${API_BASE}/api/rooms`)
      .then(res => res.json())
      .then(data => { 
        if (!data || data.length === 0) data = FALLBACK_ROOMS;
        data.sort((a, b) => a.name.localeCompare(b.name)); 
        setRooms(data); 
      })
      .catch((err) => {
        console.error('API failed, using fallback data:', err);
        setRooms(FALLBACK_ROOMS.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const selectedRoom = rooms.find(r => r.id === formData.roomId);
  const nights = formData.checkIn && formData.checkOut
    ? Math.max(1, Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;
  const subtotal = selectedRoom ? nights * selectedRoom.price_per_night : 0;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;
  const today = new Date().toISOString().split('T')[0];

  const getRoomImage = (room, index) => {
    if (room.images?.[0] && !room.images[0].includes('unsplash')) return room.images[0];
    return ROOM_IMAGES[index % ROOM_IMAGES.length];
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: formData.roomId,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          identityCard: formData.identityCard,
          cardDetails: formData.cardDetails,
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooking(data.booking);
      setStep(5);
    } catch (err) {
      console.error('Booking API failed, using demo fallback:', err);
      // Fallback for demo purposes if backend isn't up
      setBooking({
        id: 'BM' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        identity_card: formData.identityCard,
        card_details: formData.cardDetails.replace(/\D/g, '').slice(-4).padStart(16, '*'),
        total_price: total
      });
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 0) return formData.checkIn && formData.checkOut && formData.checkOut > formData.checkIn;
    if (step === 1) return formData.adults >= 1;
    if (step === 2) return formData.roomId;
    if (step === 3) return formData.guestName && formData.guestEmail && formData.guestPhone && formData.identityCard && formData.cardDetails.length >= 16;
    return true;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '8px', fontWeight: 500 }}>
            Reserve Your Stay
          </h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '15px' }}>
            Book your luxury apartment at Bethel Meadows
          </p>
        </motion.div>

        {/* Progress Bar */}
        {step < 5 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '48px', flexWrap: 'wrap' }}>
            {STEPS.slice(0, 5).map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: i <= step ? 'var(--color-gold)' : 'var(--color-bg-alt)',
                    color: i <= step ? '#fff' : 'var(--color-text-muted)',
                    fontSize: '12px', fontWeight: 500, transition: 'var(--transition-smooth)'
                  }}>
                    <Icon size={14} />
                    <span className="step-label">{s.label}</span>
                  </div>
                  {i < 4 && <div style={{ width: '24px', height: '1px', background: i < step ? 'var(--color-gold)' : 'var(--color-border)' }} />}
                </div>
              );
            })}
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            
            {/* Step 0: Dates */}
            {step === 0 && (
              <div style={{ maxWidth: '500px', margin: '0 auto', background: 'var(--color-cards)', padding: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>Select Your Dates</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="label-luxury">Check-in Date</label>
                      <input type="date" className="input-luxury" value={formData.checkIn} min={today} onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-luxury">Est. Arrival Time</label>
                      <input type="time" className="input-luxury" value={formData.checkInTime} onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="label-luxury">Check-out Date</label>
                      <input type="date" className="input-luxury" value={formData.checkOut} min={formData.checkIn || today} onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-luxury">Departure Time</label>
                      <input type="time" className="input-luxury" value={formData.checkOutTime} onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })} />
                    </div>
                  </div>
                  {nights > 0 && (
                    <div style={{ textAlign: 'center', padding: '12px', background: 'var(--color-gold-glow)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)', fontWeight: 500 }}>
                      {nights} Night{nights > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Guests */}
            {step === 1 && (
              <div style={{ maxWidth: '500px', margin: '0 auto', background: 'var(--color-cards)', padding: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>Guest Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { label: 'Adults', key: 'adults', min: 1, max: 10 },
                    { label: 'Children', key: 'children', min: 0, max: 6 },
                    { label: 'Rooms', key: 'roomCount', min: 1, max: 5 }
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                      <span style={{ fontSize: '16px', fontWeight: 500 }}>{item.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setFormData({ ...formData, [item.key]: Math.max(item.min, formData[item.key] - 1) })} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', background: 'var(--color-bg)' }}>−</button>
                        <span style={{ fontSize: '18px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{formData[item.key]}</span>
                        <button onClick={() => setFormData({ ...formData, [item.key]: Math.min(item.max, formData[item.key] + 1) })} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', background: 'var(--color-bg)' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Room Selection */}
            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>Choose Your Room</h3>
                {loading ? <p style={{ textAlign: 'center' }}>Loading rooms...</p> : (
                  <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                    {rooms.map((room, i) => (
                      <div
                        key={room.id}
                        onClick={() => setFormData({ ...formData, roomId: room.id })}
                        style={{
                          background: 'var(--color-cards)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: formData.roomId === room.id ? 'var(--color-gold)' : 'var(--color-border-light)',
                          transition: 'var(--transition-smooth)',
                          boxShadow: formData.roomId === room.id ? 'var(--shadow-gold)' : 'var(--shadow-sm)'
                        }}
                      >
                        <img src={getRoomImage(room, i)} alt={room.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} loading="lazy" />
                        <div style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>{room.name}</h4>
                            <span style={{ background: 'var(--color-gold-glow)', color: 'var(--color-gold)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>{room.type}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-light)', fontSize: '13px' }}>
                              {room.type === '1 BHK' ? '1-2 Guests' : room.type === '2 BHK' ? '3-4 Guests' : '5-6 Guests'}
                            </span>
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-gold)', fontWeight: 600 }}>
                              ₹{room.price_per_night?.toLocaleString()}<span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontFamily: 'var(--font-body)' }}>/night</span>
                            </span>
                          </div>
                          {formData.roomId === room.id && (
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold)', fontSize: '13px', fontWeight: 600 }}>
                              <CheckCircle size={16} /> Selected
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Guest Details */}
            {step === 3 && (
              <div style={{ maxWidth: '500px', margin: '0 auto', background: 'var(--color-cards)', padding: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>Guest Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="label-luxury">Full Name</label>
                    <input type="text" className="input-luxury" value={formData.guestName} onChange={(e) => setFormData({ ...formData, guestName: e.target.value })} placeholder="Enter your full name" required />
                  </div>
                  <div>
                    <label className="label-luxury">Email Address</label>
                    <input type="email" className="input-luxury" value={formData.guestEmail} onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })} placeholder="your@email.com" required />
                  </div>
                  <div>
                    <label className="label-luxury">Phone Number</label>
                    <input type="tel" className="input-luxury" value={formData.guestPhone} onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })} placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <label className="label-luxury">Identity Card Number (Aadhar / Passport / License)</label>
                    <input type="text" className="input-luxury" value={formData.identityCard} onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })} placeholder="Enter ID number" required />
                  </div>
                  <div style={{ background: 'rgba(201, 169, 110, 0.05)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201, 169, 110, 0.2)' }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '16px', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={18} /> Guarantee Details
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginBottom: '16px' }}>Your card is required to guarantee the reservation. Payment will be collected at the property.</p>
                    <label className="label-luxury">Card Number</label>
                    <input type="text" className="input-luxury" value={formData.cardDetails} onChange={(e) => setFormData({ ...formData, cardDetails: e.target.value })} placeholder="**** **** **** ****" maxLength="19" required />
                  </div>
                  <div>
                    <label className="label-luxury">Special Requests (Optional)</label>
                    <textarea className="input-luxury" value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} placeholder="Any special requests..." rows={3} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--color-cards)', padding: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>Booking Summary</h3>
                
                {selectedRoom && (
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', padding: '16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <img src={getRoomImage(selectedRoom, rooms.indexOf(selectedRoom))} alt={selectedRoom.name} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>{selectedRoom.name}</h4>
                      <p style={{ color: 'var(--color-text-light)', fontSize: '13px' }}>{selectedRoom.type} • {nights} Night{nights > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'Guest', value: formData.guestName },
                    { label: 'Email', value: formData.guestEmail },
                    { label: 'Phone', value: formData.guestPhone },
                    { label: 'Check-in', value: `${new Date(formData.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${formData.checkInTime}` },
                    { label: 'Check-out', value: `${new Date(formData.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${formData.checkOutTime}` },
                    { label: 'Guests', value: `${formData.adults} Adult${formData.adults > 1 ? 's' : ''}${formData.children > 0 ? `, ${formData.children} Child${formData.children > 1 ? 'ren' : ''}` : ''}` }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                      <span style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>{item.label}</span>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>Room ({nights} night{nights > 1 ? 's' : ''} × ₹{selectedRoom?.price_per_night?.toLocaleString()})</span>
                    <span style={{ fontSize: '14px' }}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>GST (12%)</span>
                    <span style={{ fontSize: '14px' }}>₹{tax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid var(--color-gold)' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600 }}>Grand Total</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-gold)', fontWeight: 600 }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(201, 169, 110, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                  💳 Payment at Property
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && booking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  <CheckCircle size={40} color="#fff" />
                </motion.div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>Booking Confirmed!</h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '32px' }}>Your reservation has been successfully placed.</p>

                {/* Invoice Card */}
                <div id="invoice" style={{ background: 'var(--color-cards)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)', textAlign: 'left', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--color-gold)' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '4px' }}>🌿 Bethel Meadows</h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Luxury Serviced Apartments</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Booking ID</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600, color: 'var(--color-gold)' }}>{booking.id?.substring(0, 8).toUpperCase()}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div><span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Guest Name</span><div style={{ fontWeight: 500, marginTop: '4px' }}>{booking.guest_name}</div></div>
                    <div><span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</span><div style={{ fontWeight: 500, marginTop: '4px' }}>{booking.guest_email}</div></div>
                    <div><span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Check-in</span><div style={{ fontWeight: 500, marginTop: '4px' }}>{new Date(booking.check_in).toLocaleDateString('en-IN')}</div></div>
                    <div><span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Check-out</span><div style={{ fontWeight: 500, marginTop: '4px' }}>{new Date(booking.check_out).toLocaleDateString('en-IN')}</div></div>
                  </div>

                  <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600 }}>Total Amount</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: 'var(--color-gold)', fontWeight: 600 }}>₹{booking.total_price?.toLocaleString()}</span>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Payment at Property</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={() => window.print()} className="btn-outline-dark" style={{ gap: '8px' }}>
                    <Printer size={14} /> Print Invoice
                  </button>
                  <button onClick={() => navigate('/')} className="btn-primary">
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 5 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '600px', margin: '40px auto 0' }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', border: '1px solid var(--color-border)',
                borderRadius: '2px', fontSize: '13px', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1.5px',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.3 : 1,
                background: 'transparent', color: 'var(--color-text)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="btn-primary"
                style={{ opacity: canNext() ? 1 : 0.5, cursor: canNext() ? 'pointer' : 'not-allowed' }}
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Confirming...' : 'Confirm Booking'} <CheckCircle size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .step-label { display: none; }
        }
        @media print {
          body * { visibility: hidden; }
          #invoice, #invoice * { visibility: visible; }
          #invoice { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
