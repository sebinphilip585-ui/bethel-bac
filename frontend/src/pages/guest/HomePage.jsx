import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROOM_TYPES, SPECIAL_OFFERS } from '../../lib/api';
import { 
  Star, Wifi, Car, Coffee, Shield, MapPin, ArrowRight, 
  Calendar, Users, ChevronRight, Quote, Sparkles, Phone, ShieldCheck, Heart
} from 'lucide-react';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const elements = ref.current?.querySelectorAll('.reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [currentHeroImg, setCurrentHeroImg] = useState(0);
  const containerRef = useReveal();
  const navigate = useNavigate();

  const heroImages = [
    '/images/rooms/room-living.jpg',
    '/images/rooms/room-bed.jpg',
    '/images/rooms/room-tv.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImg(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const today = new Date().toISOString().split('T')[0];

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', guests);
    navigate(`/booking?${params.toString()}`);
  }

  return (
    <div ref={containerRef} style={{ background: '#fcfbfa', position: 'relative' }}>
      
      {/* Scope Scoped Luxury Animations & CSS overrides */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1%, -1%); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(197, 164, 109, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(197, 164, 109, 0); }
          100% { box-shadow: 0 0 0 0 rgba(197, 164, 109, 0); }
        }
        @keyframes glowBorder {
          0% { border-color: rgba(197, 164, 109, 0.2); }
          50% { border-color: rgba(197, 164, 109, 0.6); }
          100% { border-color: rgba(197, 164, 109, 0.2); }
        }
        .animate-kenburns {
          animation: kenburns 16s ease-in-out infinite alternate;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .btn-gold-glow {
          animation: pulseGlow 2.5s infinite;
        }
        .premium-hover-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-hover-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(10, 22, 40, 0.08), 0 4px 15px rgba(197, 164, 109, 0.15);
          border-color: var(--color-gold) !important;
        }
        .glass-booking-widget {
          background: rgba(12, 26, 46, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
        }
        .glass-booking-widget:hover {
          border-color: rgba(197, 164, 109, 0.4);
        }
        .luxury-text-gradient {
          background: linear-gradient(135deg, #ffffff 30%, var(--color-gold-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .luxury-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0 24px 0;
        }
        .luxury-divider::before {
          content: '';
          height: 1px;
          background: linear-gradient(90deg, var(--color-gold) 0%, transparent 100%);
          flex: 1;
        }
        .luxury-divider-diamond {
          width: 8px;
          height: 8px;
          background: var(--color-gold);
          transform: rotate(45deg);
        }
        .amenity-card {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .amenity-card:hover {
          background: rgba(197, 164, 109, 0.08) !important;
          border-color: rgba(197, 164, 109, 0.3) !important;
          transform: translateY(-5px);
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {heroImages.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`Hero ${idx + 1}`} 
              className={currentHeroImg === idx ? 'animate-kenburns' : ''}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: currentHeroImg === idx ? 1 : 0,
                transition: 'opacity 1.8s ease-in-out',
                zIndex: currentHeroImg === idx ? 1 : 0
              }}
            />
          ))}
        </div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(12,26,46,0.5) 0%, rgba(12,26,46,0.85) 100%)', zIndex: 1 }} />
        
        {/* Subtle decorative gold frames */}
        <div className="hero-frame top-left" style={{ borderLeft: '2px solid rgba(197,164,109,0.3)', borderTop: '2px solid rgba(197,164,109,0.3)', position: 'absolute', top: '40px', left: '40px', width: '60px', height: '60px', zIndex: 2 }} />
        <div className="hero-frame top-right" style={{ borderRight: '2px solid rgba(197,164,109,0.3)', borderTop: '2px solid rgba(197,164,109,0.3)', position: 'absolute', top: '40px', right: '40px', width: '60px', height: '60px', zIndex: 2 }} />
        <div className="hero-frame bottom-left" style={{ borderLeft: '2px solid rgba(197,164,109,0.3)', borderBottom: '2px solid rgba(197,164,109,0.3)', position: 'absolute', bottom: '40px', left: '40px', width: '60px', height: '60px', zIndex: 2 }} />
        <div className="hero-frame bottom-right" style={{ borderRight: '2px solid rgba(197,164,109,0.3)', borderBottom: '2px solid rgba(197,164,109,0.3)', position: 'absolute', bottom: '40px', right: '40px', width: '60px', height: '60px', zIndex: 2 }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          <div style={{ maxWidth: '720px', paddingBottom: '60px' }}>
            <p className="hero-label animate-float" style={{ color: 'var(--color-gold)', letterSpacing: '6px', fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
              ✦ A Sanctuary of Refinement
            </p>
            <h1 className="hero-title luxury-text-gradient" style={{ fontSize: 'var(--text-hero)', fontWeight: 800, lineHeight: 1.1, marginBottom: 'var(--space-5)', letterSpacing: '-0.02em' }}>
              Experience the Art of Hospitality
            </h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-lg)', lineHeight: '1.7', marginBottom: 'var(--space-8)', maxWidth: '580px', fontFamily: 'var(--font-accent)' }}>
              Nestled in the lush hills of Munnar, Bethel Meadows blends timeless colonial elegance with modern luxury. Experience curated comfort designed to soothe your soul.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary btn-lg btn-gold-glow">
                Book Your Stay
                <ArrowRight size={18} />
              </Link>
              <Link to="/rooms" className="btn btn-outline-white btn-lg">
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Floating Glassmorphic Booking Widget */}
          <form className="glass-booking-widget" onSubmit={handleSearch} style={{
            position: 'absolute',
            bottom: '-120px',
            left: 'var(--space-6)',
            right: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6) var(--space-8)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 'var(--space-6)',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gold-light)', fontWeight: 600 }}>Check In</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-gold)' }} />
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  min={today}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '10px 12px 10px 38px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '14px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gold-light)', fontWeight: 600 }}>Check Out</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-gold)' }} />
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '10px 12px 10px 38px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '14px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gold-light)', fontWeight: 600 }}>Guests</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Users size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-gold)', zIndex: 2 }} />
                <select 
                  value={guests} 
                  onChange={e => setGuests(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '10px 12px 10px 38px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '14px',
                    borderRadius: 'var(--radius-sm)',
                    appearance: 'none',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1" style={{ color: 'var(--color-navy)' }}>1 Guest</option>
                  <option value="2" style={{ color: 'var(--color-navy)' }}>2 Guests</option>
                  <option value="3" style={{ color: 'var(--color-navy)' }}>3 Guests</option>
                  <option value="4" style={{ color: 'var(--color-navy)' }}>4 Guests</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 28px', height: '46px', alignSelf: 'flex-end', width: '100%' }}>
              Check Rooms
            </button>
          </form>
        </div>
      </section>

      {/* Welcome Section — Story */}
      <section className="section-lg" style={{ background: '#fcfbfa', paddingTop: '180px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
            <div>
              <p className="section-label">Our Philosophy</p>
              <h2 className="section-title" style={{ fontSize: '42px', fontWeight: 800 }}>A Sanctum of Peace<br />& Natural Beauty</h2>
              
              <div className="luxury-divider" style={{ maxWidth: '280px' }}>
                <span className="luxury-divider-diamond" />
              </div>
              
              <p style={{ color: 'var(--color-gray-700)', lineHeight: '1.9', marginBottom: 'var(--space-5)', fontFamily: 'var(--font-accent)', fontSize: '20px', fontStyle: 'italic' }}>
                "We believe luxury lies in simplicity, silence, and attention to detail. Our spaces are curated to harmonize with the mist-laden tea gardens of Munnar."
              </p>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: '1.8', marginBottom: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
                Every corner of Bethel Meadows tells a story of craftsmanship. From the robust, hand-polished teakwood headboards to the ambient warm lights that mimic soft sunset rays, we prioritize materials that breathe warmth. Surrounded by quiet mountains, it is a space designed to help you disconnect and recall the joy of resting.
              </p>
              <Link to="/about" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Our Heritage Story
                <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifycontent: 'center' }}>
              {/* Primary Image Frame with custom drop shadows */}
              <div style={{
                border: '1px solid rgba(197, 164, 109, 0.3)',
                padding: '12px',
                background: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
              }}>
                <img 
                  src="/images/rooms/room-bed.jpg" 
                  alt="Deluxe Room Frame" 
                  style={{ width: '100%', height: '460px', objectFit: 'cover', transition: 'all 0.5s' }}
                />
              </div>

              {/* Overlapping accent floating image */}
              <div className="animate-float" style={{ 
                position: 'absolute', 
                bottom: '-50px', 
                left: '-60px', 
                width: '220px', 
                height: '220px', 
                background: 'white',
                border: '6px solid white',
                boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
                padding: '4px',
                border: '1px solid var(--color-gold-light)',
                overflow: 'hidden'
              }}>
                <img 
                  src="/images/rooms/room-sofa.jpg" 
                  alt="Living Area Frame" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="section-lg" style={{ background: 'var(--color-cream)', paddingBottom: '120px' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '60px' }}>
            <p className="section-label">Accommodation</p>
            <h2 className="section-title" style={{ fontSize: '38px' }}>Exquisite Rooms & Suites</h2>
            <div className="divider">
              <span className="divider-diamond" />
            </div>
            <p className="section-subtitle" style={{ maxWidth: '540px' }}>
              Indulge in spacious layouts characterized by polished wooden finishings, panoramic views, and premium comforts.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 'var(--space-8)'
          }}>
            {ROOM_TYPES.filter(rt => rt.featured).map((room, i) => (
              <div key={room.id} className="room-card reveal premium-hover-card" style={{ 
                background: 'var(--color-white)',
                border: '1px solid rgba(197, 164, 109, 0.15)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                animationDelay: `${i * 100}ms`
              }}>
                <div className="room-card-img" style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                  <img 
                    src={room.images[0]} 
                    alt={room.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {i === 0 ? (
                    <div className="room-card-badge" style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--color-navy)', color: 'var(--color-gold)', fontWeight: 600, fontSize: '10px', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Guest Favorite
                    </div>
                  ) : (
                    <div className="room-card-badge" style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--color-gold)', color: 'var(--color-navy)', fontWeight: 600, fontSize: '10px', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Featured Suite
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(12,26,46,0.7)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>
                    ✦ {room.size_sqft} sq ft
                  </div>
                </div>
                <div className="room-card-body" style={{ padding: 'var(--space-6)' }}>
                  <p className="room-card-type" style={{ color: 'var(--color-gold-dark)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
                    King Bed · {room.max_guests} Guests Max
                  </p>
                  <h3 className="room-card-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: 'var(--color-navy)', marginBottom: '10px' }}>
                    {room.name}
                  </h3>
                  <p className="room-card-desc" style={{ fontSize: '13px', color: 'var(--color-gray-500)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {room.short_description}
                  </p>
                  
                  {/* Styled icons */}
                  <div className="room-card-amenities" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                    <span className="room-card-amenity" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-600)' }}><Wifi size={13} style={{ color: 'var(--color-gold)' }} /> Free WiFi</span>
                    <span className="room-card-amenity" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-600)' }}><Coffee size={13} style={{ color: 'var(--color-gold)' }} /> Breakfast</span>
                    <span className="room-card-amenity" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-600)' }}><Shield size={13} style={{ color: 'var(--color-gold)' }} /> Smart Safe</span>
                  </div>

                  <div className="room-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                    <div className="room-card-price" style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--color-navy)' }}>
                      ₹{room.base_price.toLocaleString()}<span style={{ fontSize: '11px', color: 'var(--color-gray-400)', fontWeight: 400 }}> / night</span>
                    </div>
                    <Link to={`/rooms/${room.slug}`} className="btn btn-outline btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-12)' }}>
            <Link to="/rooms" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All Room Types
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Highlights */}
      <section className="section-lg" style={{ background: 'var(--color-navy)', color: 'var(--color-white)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(197,164,109,0.06) 0%, transparent 60%)', zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center reveal" style={{ marginBottom: '60px' }}>
            <p className="section-label">Luxury Offerings</p>
            <h2 className="section-title" style={{ color: 'var(--color-white)', fontSize: '38px' }}>
              Curated Guest Services
            </h2>
            <div className="divider">
              <span className="divider-diamond" style={{ background: 'var(--color-gold-light)' }} />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-8)'
          }} className="reveal">
            {[
              { icon: <Wifi size={24} />, title: 'High-Speed WiFi', desc: 'Secure connection throughout the property.' },
              { icon: <Car size={24} />, title: 'Valet Parking', desc: 'Complimentary safe parking for all guests.' },
              { icon: <Coffee size={24} />, title: 'Gourmet Breakfast', desc: 'Fresh regional delicacies prepared daily.' },
              { icon: <Shield size={24} />, title: 'Premium Security', desc: '24/7 camera surveillance and patrol.' },
              { icon: <Star size={24} />, title: 'Entertainment', desc: 'Smart TVs loaded with international channels.' },
              { icon: <Sparkles size={24} />, title: 'Housekeeping', desc: 'Impeccable housekeeping boards twice a day.' },
            ].map((item, i) => (
              <div key={i} className="amenity-card" style={{
                textAlign: 'left',
                padding: 'var(--space-8) var(--space-6)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(197,164,109,0.1)',
                  color: 'var(--color-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-4)'
                }}>
                  {item.icon}
                </div>
                <h4 style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '15px', 
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '8px'
                }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-12)' }}>
            <Link to="/amenities" className="btn btn-outline-white btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Explore Services List
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-lg" style={{ background: '#fdfcfa' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '60px' }}>
            <p className="section-label">Guest Reviews</p>
            <h2 className="section-title" style={{ fontSize: '38px' }}>Voices of Comfort</h2>
            <div className="divider">
              <span className="divider-diamond" />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 'var(--space-6)'
          }} className="reveal">
            {[
              { name: 'Rajesh Kumar', role: 'Business Traveler', text: 'Absolutely wonderful stay! The rooms are beautifully designed with warm wooden interiors. The staff was incredibly welcoming and attentive. The online payment portal was seamless.', rating: 5 },
              { name: 'Priya Menon', role: 'Couples Retreat', text: 'We celebrated our anniversary here and it was perfect. The premium suite was spacious, clean, and had panoramic views of Munnar hills. Truly premium service.', rating: 5 },
              { name: 'Amit Sharma', role: 'Family Vacation', text: 'Excellent hospitality and food. Booking confirmation email arrived immediately in my inbox containing all reservation details. Extremely smooth operational standards.', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="testimonial-card" style={{
                background: 'white',
                border: '1px solid rgba(197, 164, 109, 0.12)',
                borderRadius: '12px',
                padding: '36px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                position: 'relative'
              }}>
                <Quote size={28} className="quote-icon" style={{ color: 'var(--color-gold-light)', opacity: 0.5, marginBottom: '16px' }} />
                <p className="review-text" style={{ fontSize: '13.5px', color: 'var(--color-gray-600)', lineHeight: '1.7', marginBottom: '24px', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
                <div className="reviewer" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <div className="reviewer-avatar" style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--color-gold-muted)', color: 'var(--color-gold-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px'
                  }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="reviewer-name" style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{review.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginBottom: '4px' }}>{review.role}</div>
                    <div className="reviewer-stars" style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} size={11} fill="var(--color-gold)" color="var(--color-gold)" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers (Dotted Ticket Style) */}
      {SPECIAL_OFFERS.length > 0 && (
        <section className="section-lg" style={{ background: 'var(--color-cream)' }}>
          <div className="container">
            <div className="text-center reveal" style={{ marginBottom: '60px' }}>
              <p className="section-label">Exclusive Deals</p>
              <h2 className="section-title" style={{ fontSize: '38px' }}>Monsoon & Season Offers</h2>
              <div className="divider">
                <span className="divider-diamond" />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-8)'
            }} className="reveal">
              {SPECIAL_OFFERS.slice(0, 3).map(offer => (
                <div key={offer.id} className="offer-card" style={{
                  background: 'white',
                  border: '2px dashed var(--color-gold-light)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(10,22,40,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ background: 'var(--color-gold-muted)', color: 'var(--color-gold-dark)', fontSize: '11px', fontWeight: 700, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Limited Offer
                      </span>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
                        {offer.discount_percent}% <span style={{ fontSize: '12px', color: 'var(--color-gray-400)', fontWeight: 400 }}>OFF</span>
                      </div>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--color-navy)', marginBottom: '10px' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--color-gray-500)', lineHeight: '1.6', marginBottom: '20px' }}>
                      {offer.description}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <code style={{
                      background: '#fcfaf7',
                      border: '1.5px solid var(--color-gold-light)',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-gold-dark)',
                      letterSpacing: '1.5px'
                    }}>
                      {offer.code}
                    </code>
                    <Link to="/booking" className="btn btn-outline btn-sm">
                      Apply Promo
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
              <Link to="/offers" className="btn btn-secondary">
                Explore All Offers
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Location Section */}
      <section className="section-lg" style={{ background: '#fcfbfa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }} className="reveal">
            <div>
              <p className="section-label">Travel Guide</p>
              <h2 className="section-title" style={{ fontSize: '38px' }}>Find Us in Munnar</h2>
              <div className="divider" style={{ margin: '16px 0 24px 0', justifycontent: 'flex-start' }}>
                <span className="divider-diamond" />
              </div>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: '1.8', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Located amid pristine valleys and tea plantations, Bethel Meadows is easily accessible by road from Cochin International Airport (approx. 3.5 hours). We provide airport transit options and local tour arrangements on request.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-gold-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-dark)' }}>
                    <MapPin size={16} />
                  </div>
                  <span style={{ fontSize: '13.5px', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                    Chithirapuram Power House Road, Munnar, Kerala, 685565
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-gold-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-dark)' }}>
                    <Phone size={16} />
                  </div>
                  <span style={{ fontSize: '13.5px', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                    +91 98765 43210 / +91 4865 230400
                  </span>
                </div>
              </div>

              <a
                href="https://share.google/mFsAWt66HkAMuOeeO"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <MapPin size={16} />
                Launch Google Maps
              </a>
            </div>
            <div style={{
              overflow: 'hidden',
              height: '450px',
              border: '1px solid rgba(197, 164, 109, 0.25)',
              padding: '8px',
              background: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31307.72895696568!2d77.042738!3d10.091176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0799794d099a6d%3A0x63250e5813c7c8e!2sMunnar%2C%20Kerala!5e0!3m2!1sen!2sin!4v1719408453412!5m2!1sen!2sin"
                style={{ width: '100%', height: '100%', border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bethel Meadows Location Map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'var(--color-navy)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, rgba(197,164,109,0.08) 0%, transparent 75%)',
          zIndex: 0
        }} />
        <div className="container reveal" style={{ 
          padding: 'var(--space-24) var(--space-6)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <p className="section-label" style={{ marginBottom: 'var(--space-3)' }}>Experience Luxury</p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-5xl)',
            color: 'var(--color-white)',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em',
            fontWeight: 800
          }}>
            Ready for an Unforgettable Stay?
          </h2>
          <p style={{
            fontFamily: 'var(--font-accent)',
            fontSize: 'var(--text-lg)',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 'var(--space-10)',
            maxWidth: '560px',
            margin: '0 auto var(--space-10)',
            lineHeight: '1.7'
          }}>
            Book directly with us online to unlock the lowest price guarantees, complimentary welcome drinks, and late checkout.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-primary btn-lg btn-gold-glow">
              Book Direct Now
              <ArrowRight size={18} />
            </Link>
            <a href="tel:+919876543210" className="btn btn-outline-white btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} />
              Speak with Concierge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
