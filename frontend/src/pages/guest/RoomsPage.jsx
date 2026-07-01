import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Wifi, Coffee, Shield, Star, Users, Maximize2, ArrowRight, BedDouble } from 'lucide-react';

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

export default function RoomsPage() {
  const { roomTypes } = useData();
  const navigate = useNavigate();
  const containerRef = useReveal();

  return (
    <div ref={containerRef} style={{ background: '#fcfbfa' }}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .room-img-wrapper {
          position: relative;
          overflow: hidden;
        }
        .room-img-wrapper img {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .room-card:hover .room-img-wrapper img {
          transform: scale(1.05);
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(rgba(12, 26, 46, 0.8), rgba(12, 26, 46, 0.9)), url("/images/rooms/room-living.jpg") center/cover',
        padding: '160px 0 100px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container reveal">
          <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            Accommodations
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', fontWeight: 700 }}>
            Rooms & Suites
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '0 auto 24px' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.6 }}>
            Discover our collection of thoughtfully designed rooms, each offering a perfect 
            blend of classic charm, spacious living, and modern luxury.
          </p>
        </div>
      </div>

      {/* Room List */}
      <section className="section-lg">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {roomTypes.map((room, i) => (
            <div key={room.id} className="reveal room-card" style={{ 
              display: 'flex', 
              flexDirection: i % 2 === 1 ? 'row-reverse' : 'row',
              background: 'white',
              boxShadow: '0 20px 40px rgba(27, 59, 54, 0.05)',
              border: '1px solid rgba(197, 164, 109, 0.1)'
            }}>
              {/* Image Side */}
              <div className="room-img-wrapper" style={{ flex: '1 1 50%', minHeight: '400px' }}>
                <img 
                  src={room.images[0] || '/images/rooms/room-bed.jpg'} 
                  alt={room.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
                />
                <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-navy)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {room.name.includes('3BHK') ? '3BHK' : room.name.includes('2BHK') || room.max_guests >= 4 ? '2BHK' : '1BHK'}
                </div>
              </div>
              
              {/* Content Side */}
              <div style={{ flex: '1 1 50%', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ color: 'var(--color-gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '16px' }}>
                  <BedDouble size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  {room.bed_type} · {room.size_sqft} sq ft
                </p>
                
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: 'var(--color-navy)', marginBottom: '24px', lineHeight: 1.1 }}>
                  {room.name}
                </h2>
                
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: '32px', fontSize: '15px', fontWeight: 300 }}>
                  {room.description}
                </p>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderTop: '1px solid var(--color-gray-200)', borderBottom: '1px solid var(--color-gray-200)', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)', fontSize: '14px', fontWeight: 500 }}>
                    <Users size={18} color="var(--color-gold)" /> {room.max_guests} Guests
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)', fontSize: '14px', fontWeight: 500 }}>
                    <Maximize2 size={18} color="var(--color-gold)" /> {room.size_sqft} sqft
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
                  {room.facilities.slice(0, 6).map(f => (
                    <span key={f} style={{ padding: '6px 16px', background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)', fontSize: '12px', color: 'var(--color-gray-600)' }}>
                      {f}
                    </span>
                  ))}
                  {room.facilities.length > 6 && (
                    <span style={{ padding: '6px 16px', background: 'var(--color-gold-muted)', color: 'var(--color-gold-dark)', fontSize: '12px', fontWeight: 600 }}>
                      +{room.facilities.length - 6} more
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting from</span>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)' }}>
                      ₹{room.base_price.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--color-gray-500)', fontWeight: 400 }}>/ night</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to={`/rooms/${room.slug}`} className="btn btn-outline" style={{ padding: '12px 24px' }}>
                      Details
                    </Link>
                    <Link to={`/booking?room=${room.id}`} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="reveal" style={{
        background: 'var(--color-navy)',
        padding: '100px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(197,164,109,0.08) 0%, transparent 70%)'
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Need Help?</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'white', marginBottom: '24px' }}>
            Can't Decide? We're Here to Help
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', fontSize: '16px', fontWeight: 300 }}>
            Contact our reservations team and we'll help you find the perfect suite for your stay.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-outline-white" style={{ padding: '16px 32px' }}>
              Contact Us
            </Link>
            <Link to="/booking" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Book Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
