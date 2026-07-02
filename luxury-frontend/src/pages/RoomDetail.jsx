import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Maximize, Wifi, AirVent, Tv, ChefHat, Bath, Droplet, Shield, Car, Clock, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ROOM_IMAGES = [
  '/images/media__1782958486920.jpg',
  '/images/media__1782958486604.jpg',
  '/images/media__1782958486624.jpg',
  '/images/media__1782958486674.jpg',
  '/images/media__1782959875778.jpg',
];

const ALL_AMENITIES = [
  { icon: AirVent, label: 'Air Conditioning' },
  { icon: Wifi, label: 'High-Speed Wi-Fi' },
  { icon: Tv, label: 'Smart LED TV' },
  { icon: ChefHat, label: 'Equipped Kitchen' },
  { icon: Bath, label: 'Attached Bathroom' },
  { icon: Droplet, label: 'Hot Water 24/7' },
  { icon: Shield, label: 'CCTV Security' },
  { icon: Car, label: 'Free Parking' },
  { icon: Clock, label: '24x7 Support' },
  { icon: Calendar, label: 'Long Stay Welcome' }
];

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/rooms/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/api/rooms`).then(r => r.json())
    ]).then(([roomData, allRooms]) => {
      setRoom(roomData);
      setRooms(allRooms.filter(r => r.id !== id).slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Loading...</div>
    </div>
  );

  if (!room) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Room not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '20px' }}>Go Home</button>
      </div>
    </div>
  );

  const roomImages = room.images?.length > 0 && !room.images[0]?.includes('unsplash')
    ? [...room.images, ...ROOM_IMAGES.slice(0, 3)]
    : ROOM_IMAGES;

  const guestCount = room.type === '1 BHK' ? '1-2' : room.type === '2 BHK' ? '3-4' : '5-6';
  const bedType = room.type === '1 BHK' ? 'Queen Bed' : room.type === '2 BHK' ? 'King Bed + Queen Bed' : 'King Bed + 2 Queen Beds';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '80px' }}>
      {/* Hero Gallery */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden' }}>
        <img
          src={roomImages[activeImage]}
          alt={room.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease' }}
          onClick={() => setFullscreen(true)}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,26,0.2) 0%, rgba(26,26,26,0.5) 100%)' }} />

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.9)', padding: '10px 20px', border: 'none', borderRadius: '2px',
          cursor: 'pointer', fontSize: '13px', fontWeight: 500, zIndex: 10
        }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Image Navigation */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {roomImages.slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setActiveImage(i)} style={{
              width: activeImage === i ? '24px' : '8px', height: '8px', borderRadius: '4px',
              background: activeImage === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
              border: 'none', cursor: 'pointer', transition: 'var(--transition-smooth)'
            }} />
          ))}
        </div>

        {/* Prev/Next */}
        <button onClick={() => setActiveImage(prev => (prev - 1 + roomImages.length) % roomImages.length)}
          style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 10, backdropFilter: 'blur(10px)' }}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setActiveImage(prev => (prev + 1) % roomImages.length)}
          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 10, backdropFilter: 'blur(10px)' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', padding: '48px 0 80px', alignItems: 'start' }} className="room-detail-grid">
          {/* Main Content */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600 }}>{room.type}</span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginTop: '8px', marginBottom: '16px', fontWeight: 500 }}>{room.name}</h1>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-light)', fontSize: '14px' }}><Maximize size={16} color="var(--color-gold)" /> {room.type}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-light)', fontSize: '14px' }}><Users size={16} color="var(--color-gold)" /> {guestCount} Guests</div>
              </div>

              <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '32px' }} />

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '16px' }}>About This Apartment</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '12px' }}>
                Welcome to {room.name}, a premium {room.type} serviced apartment at Bethel Meadows. This beautifully designed space offers modern luxury with the comfort of home, featuring premium furnishings, a fully equipped kitchen, and all essential amenities.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '40px' }}>
                Perfect for {room.type === '1 BHK' ? 'couples and solo travellers' : room.type === '2 BHK' ? 'families and small groups' : 'large families and groups'}, this apartment combines elegant design with practical comfort for an unforgettable stay.
              </p>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '8px' }}>Room Features</h3>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={{ padding: '12px 20px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>🛏️ {bedType}</div>
                <div style={{ padding: '12px 20px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>👥 Max {guestCount} Guests</div>
                <div style={{ padding: '12px 20px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>🏠 {room.type}</div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '20px' }}>Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '40px' }}>
                {ALL_AMENITIES.map((amenity, i) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                      <Icon size={18} color="var(--color-gold)" strokeWidth={1.5} />
                      <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Related Rooms */}
            {rooms.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '20px' }}>Other Apartments</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {rooms.map((r, i) => (
                    <div key={r.id} onClick={() => navigate(`/rooms/${r.id}`)} style={{
                      background: 'var(--color-cards)', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                      border: '1px solid var(--color-border-light)', cursor: 'pointer', transition: 'var(--transition-smooth)'
                    }} className="related-room">
                      <img src={ROOM_IMAGES[i % ROOM_IMAGES.length]} alt={r.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} loading="lazy" />
                      <div style={{ padding: '14px' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', marginBottom: '4px' }}>{r.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{r.type}</span>
                          <span style={{ fontSize: '14px', color: 'var(--color-gold)', fontWeight: 600 }}>₹{r.price_per_night?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Booking Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              background: 'var(--color-cards)', padding: '32px', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 600, color: 'var(--color-gold)' }}>₹{room.price_per_night?.toLocaleString()}</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}> / night</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ECC71' }} />
                  <span style={{ fontSize: '12px', color: '#2ECC71', fontWeight: 500 }}>Available</span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--color-border-light)', marginBottom: '24px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Type</span><span style={{ fontWeight: 500 }}>{room.type}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Max Guests</span><span style={{ fontWeight: 500 }}>{guestCount}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bed</span><span style={{ fontWeight: 500 }}>{bedType}</span></div>
              </div>

              <button onClick={() => navigate(`/booking?room=${room.id}`)} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '14px' }}>
                Book Now <ArrowRight size={16} />
              </button>

              <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                💳 Pay at property
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .related-room:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        @media (max-width: 768px) {
          .room-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
