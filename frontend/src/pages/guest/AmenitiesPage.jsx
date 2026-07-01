import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, Car, Coffee, Utensils, Shield, Tv, Wind, Bath, 
  ShowerHead, Shirt, Phone, Clock, Sparkles, Camera,
  Baby, Accessibility, ArrowRight, Check
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

const AMENITIES = [
  { icon: <Wifi size={24} />, name: 'High-Speed WiFi', desc: 'Complimentary high-speed wireless internet available throughout the property.' },
  { icon: <Wind size={24} />, name: 'Air Conditioning', desc: 'Individual climate control in every room for your comfort.' },
  { icon: <Tv size={24} />, name: 'Smart TV', desc: 'Large-screen Smart TVs with streaming capabilities for entertainment.' },
  { icon: <Car size={24} />, name: 'Free Parking', desc: 'Spacious parking area with 24/7 security and CCTV surveillance.' },
  { icon: <Coffee size={24} />, name: 'Fully Equipped Kitchen', desc: 'Modern kitchen setups available in our apartment suites.' },
  { icon: <Shield size={24} />, name: '24/7 Security', desc: 'Round-the-clock security personnel and CCTV monitoring.' },
  { icon: <Sparkles size={24} />, name: 'Housekeeping', desc: 'Professional housekeeping services to maintain highest cleanliness standards.' },
  { icon: <Bath size={24} />, name: 'Hot Water', desc: '24/7 hot water supply in all rooms with modern geyser systems.' },
  { icon: <ShowerHead size={24} />, name: 'Premium Toiletries', desc: 'Complimentary premium bath amenities.' },
  { icon: <Phone size={24} />, name: 'Intercom System', desc: 'In-room intercom system for direct communication.' },
  { icon: <Shirt size={24} />, name: 'Laundry Service', desc: 'Express laundry and ironing services available on request.' },
  { icon: <Camera size={24} />, name: 'CCTV Coverage', desc: 'Comprehensive CCTV coverage in all common areas.' },
];

const IN_ROOM = [
  'Premium King Bedding', 'Air Conditioning', 'Smart TV', 'High-Speed WiFi',
  'Fully Furnished Living', 'Equipped Kitchen (Suites)', 'Wardrobe', '24/7 Hot Water',
  'Housekeeping', 'Premium Bath Amenities', 'Intercom',
  'Power Backup', 'Work Desk', 'Coffee/Tea Maker'
];

export default function AmenitiesPage() {
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
        
        .amenity-card {
          background: white;
          border: 1px solid rgba(197, 164, 109, 0.15);
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          gap: 24px;
        }
        
        .amenity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 59, 54, 0.08), 0 4px 12px rgba(197, 164, 109, 0.1);
          border-color: rgba(197, 164, 109, 0.4);
        }
        
        .amenity-icon-wrapper {
          width: 56px;
          height: 56px;
          background: var(--color-gold-muted);
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.4s;
        }
        
        .amenity-card:hover .amenity-icon-wrapper {
          background: var(--color-gold);
          color: white;
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(rgba(12, 26, 46, 0.8), rgba(12, 26, 46, 0.9)), url("/images/rooms/room-sofa.jpg") center/cover',
        padding: '160px 0 100px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container reveal">
          <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            Premium Living
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', fontWeight: 700 }}>
            World-Class Facilities
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '0 auto 24px' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.6 }}>
            Every detail at Bethel Meadows is designed to make your stay comfortable, secure, and memorable.
          </p>
        </div>
      </div>

      {/* Main Amenities Grid */}
      <section className="section-lg">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {AMENITIES.map((amenity, i) => (
              <div key={i} className="reveal amenity-card" style={{ animationDelay: `${(i % 3) * 100}ms` }}>
                <div className="amenity-icon-wrapper">
                  {amenity.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                    {amenity.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: '1.6' }}>
                    {amenity.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In Every Room */}
      <section className="section-lg" style={{ background: 'white', borderTop: '1px solid rgba(197, 164, 109, 0.1)' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: '64px' }}>
            <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Standard Inclusions</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: 'var(--color-navy)' }}>
              In Every Suite
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '24px auto 0' }} />
          </div>
          
          <div className="reveal" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {IN_ROOM.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px',
                background: '#fcfbfa',
                border: '1px solid rgba(197, 164, 109, 0.15)',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--color-navy)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.background = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(197, 164, 109, 0.15)'; e.currentTarget.style.background = '#fcfbfa'; }}
              >
                <div style={{ 
                  width: '24px', height: '24px', 
                  borderRadius: '50%', background: 'var(--color-gold-muted)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-gold)'
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
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
          <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Ready to Experience?</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'white', marginBottom: '24px' }}>
            Book Your Stay Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', fontSize: '16px', fontWeight: 300 }}>
            Experience all our premium amenities firsthand.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rooms" className="btn btn-outline-white" style={{ padding: '16px 32px' }}>
              View Rooms
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
