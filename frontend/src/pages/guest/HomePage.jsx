import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { 
  Star, Wifi, Car, Coffee, Shield, MapPin, ArrowRight, 
  Calendar, Users, Quote, Sparkles, ChevronDown, CheckCircle2, Train, Map
} from 'lucide-react';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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
  const [guests, setGuests] = useState(2);
  const { roomTypes } = useData();
  const containerRef = useReveal();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', guests);
    navigate(`/booking?${params.toString()}`);
  }

  const attractions = [
    { name: 'Thiruvalla Railway Station', distance: '8 km', time: '15 mins', icon: <Train size={20} /> },
    { name: 'Chengannur Railway Station', distance: '11 km', time: '20 mins', icon: <Train size={20} /> },
    { name: 'Maramon Convention Ground', distance: '6 km', time: '12 mins', icon: <MapPin size={20} /> },
    { name: 'Aranmula Parthasarathy Temple', distance: '10 km', time: '20 mins', icon: <MapPin size={20} /> },
    { name: "Niranam St. Mary's Church", distance: '12 km', time: '25 mins', icon: <MapPin size={20} /> },
    { name: 'Pamba River', distance: '10 km', time: '20 mins', icon: <Map size={20} /> },
    { name: 'Kottayam', distance: '35 km', time: '1 hr', icon: <Map size={20} /> },
    { name: 'Sabarimala', distance: '75 km', time: '2.5 hrs', icon: <MapPin size={20} /> },
  ];

  return (
    <div ref={containerRef} style={{ background: '#fcfbfa', position: 'relative' }}>
      
      {/* Custom Styles for Home */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceScroll {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .animate-fade-in-down { animation: fadeInDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 2s ease-in-out forwards; }
        .animate-bounce-scroll { animation: bounceScroll 2s infinite; }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }

        .luxury-card {
          background: white;
          border: 1px solid rgba(197, 164, 109, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .luxury-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(27, 59, 54, 0.08), 0 5px 15px rgba(197, 164, 109, 0.12);
          border-color: rgba(197, 164, 109, 0.4);
        }
        
        .attraction-card {
          border-bottom: 1px solid rgba(197, 164, 109, 0.15);
          transition: all 0.3s;
        }
        .attraction-card:hover {
          background: rgba(197, 164, 109, 0.05);
          padding-left: 8px;
        }

        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Hero Section */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* PLACEHOLDER VIDEO: Replace this URL with actual video once uploaded */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
            {/* Fallback image if video fails/isn't uploaded yet */}
            <img src="/images/rooms/room-living.jpg" alt="Hero fallback" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </video>
        </div>
        
        {/* Dark Gradient Overlay for Premium Look */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(135deg, rgba(27, 59, 54, 0.8) 0%, rgba(12, 26, 46, 0.6) 100%)', 
          zIndex: 1 
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '800px', padding: '0 20px' }}>
            <p className="animate-fade-in-down" style={{ 
              color: 'var(--color-gold)', 
              letterSpacing: '8px', 
              fontSize: '12px', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              marginBottom: '24px' 
            }}>
              ✦ Welcome To The Sanctorum ✦
            </p>
            <h1 className="animate-fade-in-down delay-100" style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              fontWeight: 700, 
              color: 'white', 
              lineHeight: 1.1, 
              marginBottom: '24px', 
              fontFamily: 'var(--font-heading)' 
            }}>
              Experience Comfort at Bethel Meadows
            </h1>
            <p className="animate-fade-in-up delay-200" style={{ 
              color: 'rgba(255,255,255,0.85)', 
              fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
              lineHeight: '1.6', 
              marginBottom: '40px', 
              maxWidth: '600px', 
              margin: '0 auto 40px',
              fontFamily: 'var(--font-body)',
              fontWeight: 300
            }}>
              Premium serviced apartments in Eraviperoor, Thiruvalla.
            </p>
            <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn" style={{ 
                background: 'var(--color-gold)', 
                color: 'var(--color-navy)', 
                padding: '16px 36px', 
                fontSize: '14px', 
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                Book Now
              </Link>
              <Link to="/rooms" className="btn" style={{ 
                background: 'transparent', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.6)',
                padding: '16px 36px', 
                fontSize: '14px', 
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                Explore Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in delay-500" style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Scroll</span>
          <ChevronDown className="animate-bounce-scroll" size={20} />
        </div>
      </section>

      {/* Booking Widget */}
      <section style={{ 
        position: 'relative', 
        zIndex: 10,
        marginTop: '-50px',
        padding: '0 20px'
      }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <form onSubmit={handleSearch} style={{
            background: 'white',
            borderRadius: '0',
            boxShadow: '0 20px 40px rgba(27, 59, 54, 0.1)',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gray-500)', fontWeight: 600 }}>Arrival Date</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '16px', color: 'var(--color-gold)' }} />
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  min={today}
                  style={{
                    width: '100%',
                    background: '#fcfbfa',
                    border: '1px solid rgba(197, 164, 109, 0.3)',
                    padding: '14px 16px 14px 44px',
                    color: 'var(--color-navy)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gray-500)', fontWeight: 600 }}>Departure Date</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '16px', color: 'var(--color-gold)' }} />
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  style={{
                    width: '100%',
                    background: '#fcfbfa',
                    border: '1px solid rgba(197, 164, 109, 0.3)',
                    padding: '14px 16px 14px 44px',
                    color: 'var(--color-navy)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gray-500)', fontWeight: 600 }}>Guests</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Users size={16} style={{ position: 'absolute', left: '16px', color: 'var(--color-gold)', zIndex: 2 }} />
                <select 
                  value={guests} 
                  onChange={e => setGuests(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#fcfbfa',
                    border: '1px solid rgba(197, 164, 109, 0.3)',
                    padding: '14px 16px 14px 44px',
                    color: 'var(--color-navy)',
                    outline: 'none',
                    fontSize: '14px',
                    appearance: 'none',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 28px', height: '50px', width: '100%' }}>
              Check Availability
            </button>
          </form>
        </div>
      </section>

      {/* About Section */}
      <section className="section-lg" style={{ background: '#fcfbfa', paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Our Heritage</p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '24px', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                A Premium Haven in Central Kerala
              </h2>
              
              <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', marginBottom: '32px' }} />
              
              <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: '24px', fontSize: '16px', fontWeight: 300 }}>
                Located in the heart of Eraviperoor, Thiruvalla, Bethel Meadows redefines luxury living. Our premium serviced apartments are meticulously designed to offer the ultimate blend of homely comfort and five-star hospitality.
              </p>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: '40px', fontSize: '16px', fontWeight: 300 }}>
                Whether you are a family on vacation, a business professional requiring extended stays, or pilgrims seeking rest near Sabarimala and Aranmula, Bethel Meadows provides a serene, secure, and impeccably furnished sanctuary.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                {['Family Friendly', 'Business Ready', 'Pilgrim Sanctuary', 'Long Stays'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)', fontWeight: 500, fontSize: '14px' }}>
                    <CheckCircle2 size={18} color="var(--color-gold)" />
                    {feature}
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Discover More
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-16px -16px 16px 16px', border: '1px solid var(--color-gold)', zIndex: 0 }} />
              <img 
                src="/images/rooms/room-living.jpg" 
                alt="Bethel Meadows Property" 
                style={{ width: '100%', height: '500px', objectFit: 'cover', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="section-lg" style={{ background: 'white' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '64px' }}>
            <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Our Accommodations</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              Signature Suites & Apartments
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {roomTypes.slice(0, 6).map((room, i) => (
              <div key={room.id} className="luxury-card reveal" style={{ animationDelay: `${i * 100}ms`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                  <img 
                    src={room.images[0] || '/images/rooms/room-bed.jpg'} 
                    alt={room.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', padding: '6px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-navy)' }}>
                    {room.name.includes('3BHK') ? '3BHK' : room.name.includes('2BHK') || room.max_guests >= 4 ? '2BHK' : '1BHK'}
                  </div>
                </div>
                
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                    {room.name}
                  </h3>
                  <p style={{ color: 'var(--color-gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '16px' }}>
                    Starting from ₹{room.base_price} / night
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                    {room.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {room.facilities.slice(0, 3).map((fac, idx) => (
                      <span key={idx} style={{ fontSize: '11px', color: 'var(--color-gray-600)', background: '#f5f5f5', padding: '4px 10px', borderRadius: '100px' }}>
                        {fac}
                      </span>
                    ))}
                    {room.facilities.length > 3 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-gold)', background: 'var(--color-gold-muted)', padding: '4px 10px', borderRadius: '100px' }}>
                        +{room.facilities.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link to={`/rooms/${room.slug}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center reveal" style={{ marginTop: '48px' }}>
            <Link to="/rooms" className="btn btn-primary" style={{ padding: '16px 40px' }}>
              View All Accommodations
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Overview */}
      <section className="section-lg" style={{ background: 'var(--color-navy)', color: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Premium Living</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              World-Class Facilities
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '24px auto 0' }} />
          </div>

          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {[
              { icon: <Wifi size={28} />, title: 'High-Speed Wi-Fi' },
              { icon: <Car size={28} />, title: 'Free Parking' },
              { icon: <Coffee size={28} />, title: 'Equipped Kitchen' },
              { icon: <Shield size={28} />, title: '24×7 Security' },
              { icon: <Sparkles size={28} />, title: 'Fully Furnished' },
              { icon: <Star size={28} />, title: 'Premium Services' },
            ].map((fac, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                <div style={{ color: 'var(--color-gold)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  {fac.icon}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '0.5px' }}>{fac.title}</h4>
              </div>
            ))}
          </div>
          
          <div className="text-center reveal" style={{ marginTop: '48px' }}>
            <Link to="/amenities" className="btn btn-outline-white">
              Explore All Facilities
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section id="attractions" className="section-lg" style={{ background: '#fcfbfa' }}>
        <div className="container">
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Location</p>
              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '24px', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                Strategic & Serene Location
              </h2>
              <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', marginBottom: '32px' }} />
              <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: '24px', fontSize: '16px', fontWeight: 300 }}>
                Situated in Eraviperoor, Bethel Meadows serves as the perfect base for pilgrims, tourists, and transit travelers. Enjoy easy access to major railway stations and renowned spiritual destinations.
              </p>
              <a href="https://maps.app.goo.gl/qIp370fRVyGLMOoHd" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} /> View on Google Maps
              </a>
            </div>
            
            <div style={{ background: 'white', padding: '32px', border: '1px solid rgba(197, 164, 109, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0' }}>
                {attractions.map((attr, i) => (
                  <div key={i} className="attraction-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--color-gold-muted)', color: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {attr.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '4px' }}>{attr.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', display: 'flex', gap: '12px' }}>
                        <span>Distance: {attr.distance}</span>
                        <span style={{ color: 'var(--color-gold)' }}>•</span>
                        <span>~{attr.time}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="section-lg" style={{ background: 'white' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '64px' }}>
            <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Guest Experiences</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              Testimonials
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {[
              { name: 'Dr. John Thomas', role: 'Family Vacation', text: 'An absolute gem in Eraviperoor. The Beckingham suite was perfect for our family. Spotless, well-maintained, and the hospitality was truly premium.', rating: 5 },
              { name: 'Sarah Mathews', role: 'Business Trip', text: 'I stayed in the Belrose unit for a week. The high-speed wifi and quiet environment made it a perfect working retreat. Highly recommended.', rating: 5 },
              { name: 'Anoop Krishnan', role: 'Pilgrim Visitor', text: 'Excellent location for those visiting Sabarimala and Aranmula. The property is extremely safe, clean, and the staff is very accommodating.', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="reveal luxury-card" style={{ padding: '40px 32px', position: 'relative' }}>
                <Quote size={32} style={{ color: 'var(--color-gold-muted)', position: 'absolute', top: '32px', right: '32px' }} />
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="var(--color-gold)" color="var(--color-gold)" />
                  ))}
                </div>
                <p style={{ fontSize: '15px', color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: '32px', fontStyle: 'italic', flex: 1 }}>
                  "{review.text}"
                </p>
                <div style={{ borderTop: '1px solid rgba(197,164,109,0.2)', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)' }}>{review.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginTop: '4px' }}>{review.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center" style={{ marginTop: '32px', fontSize: '12px', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
            *Placeholder reviews. We invite you to experience our hospitality and leave your own review.
          </p>
        </div>
      </section>

    </div>
  );
}
