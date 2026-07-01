import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Users, Maximize2, ArrowRight, BedDouble, Check } from 'lucide-react';

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

const APARTMENTS_DATA = [
  { name: 'Beckingham', bhk: '2BHK', price: 4500, img: '/images/rooms/room-living.jpg', size: 600, beds: '2 King Beds', desc: 'A luxurious 2BHK suite designed for elegance and comfort. Enjoy spacious living with premium furnishings.' },
  { name: 'Beverly Hills', bhk: '2BHK', price: 4500, img: '/images/rooms/room-bed.jpg', size: 600, beds: '2 King Beds', desc: 'An exquisite 2BHK apartment offering panoramic views and top-tier hospitality for a memorable stay.' },
  { name: 'Belrose', bhk: '1BHK', price: 2500, img: '/images/rooms/room-sofa.jpg', size: 350, beds: '1 King Bed', desc: 'A cozy and elegant 1BHK unit perfect for couples or solo travelers seeking a peaceful retreat.' },
  { name: 'Blooms Bay', bhk: '2BHK', price: 4500, img: '/images/rooms/room-tv.jpg', size: 600, beds: '2 King Beds', desc: 'A modern 2BHK suite with a spacious living area and premium furnishings for an elevated experience.' },
  { name: 'Blue Bell', bhk: '1BHK', price: 2500, img: '/images/rooms/room-ac.jpg', size: 350, beds: '1 King Bed', desc: 'A serene 1BHK unit combining simplicity with luxury, offering a restful stay amidst nature.' },
  { name: 'Beehive', bhk: '1BHK', price: 2500, img: '/images/rooms/room-living.jpg', size: 350, beds: '1 King Bed', desc: 'A warm and inviting 1BHK suite equipped with all modern amenities for a comfortable extended stay.' },
  { name: 'Belarus', bhk: '3BHK', price: 6500, img: '/images/rooms/room-bed.jpg', size: 900, beds: '3 King Beds', desc: 'Our grandest 3BHK presidential suite offering ultimate luxury, expansive space, and elite amenities.' },
  { name: 'Breeze Garden', bhk: '1BHK', price: 2500, img: '/images/rooms/room-sofa.jpg', size: 380, beds: '1 King Bed', desc: 'A beautiful garden-facing 1BHK apartment filled with natural light and peaceful atmosphere.' },
  { name: 'Brook Hills', bhk: '1BHK', price: 2500, img: '/images/rooms/room-tv.jpg', size: 360, beds: '1 King Bed', desc: 'Enjoy scenic views and modern amenities in this elegantly designed 1BHK sanctuary.' },
  { name: 'Bliss Heaven', bhk: '1BHK', price: 2500, img: '/images/rooms/room-ac.jpg', size: 350, beds: '1 King Bed', desc: 'A heavenly 1BHK retreat featuring modern aesthetic, warm lighting, and complete privacy.' },
];

const FACILITIES = [
  'Air Conditioning', 'Fully Furnished', 'Equipped Kitchen', 'Refrigerator',
  'Smart TV', 'High-Speed Wi-Fi', 'Attached Bathroom', 'Hot Water'
];

export default function RoomsPage() {
  const { roomTypes } = useData();
  const navigate = useNavigate();
  const containerRef = useReveal();

  const handleBookNow = (apartName) => {
    // Attempt to match the database room type ID by name
    const dbRoom = roomTypes.find(rt => rt.name.toLowerCase().includes(apartName.toLowerCase()));
    if (dbRoom) {
      navigate(`/booking?room=${dbRoom.id}`);
    } else {
      navigate(`/booking`);
    }
  };

  const handleViewDetails = (apartName) => {
    const dbRoom = roomTypes.find(rt => rt.name.toLowerCase().includes(apartName.toLowerCase()));
    if (dbRoom) {
      navigate(`/rooms/${dbRoom.slug}`);
    }
  };

  return (
    <div ref={containerRef} style={{ background: '#fdfcf9', minHeight: '100vh' }}>
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
        
        .luxury-card {
          background: white;
          border: 1px solid rgba(205, 162, 82, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          position: relative;
        }
        
        .luxury-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(12, 37, 31, 0.08);
          border-color: rgba(205, 162, 82, 0.4);
        }
        
        .luxury-img-container {
          overflow: hidden;
          position: relative;
          height: 280px;
        }
        
        .luxury-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .luxury-card:hover .luxury-img-container img {
          transform: scale(1.05);
        }
        
        .apart-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #0c251f;
          color: #cda252;
          padding: 6px 16px;
          font-size: 11px;
          fontWeight: 700;
          letter-spacing: 1px;
          border: 1px solid #cda252;
        }

        .action-btn {
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s;
        }
        
        .action-btn-primary {
          background: #0c251f;
          color: #cda252;
          border: 1px solid #cda252;
        }
        .action-btn-primary:hover {
          background: #cda252;
          color: #0c251f;
        }
        
        .action-btn-secondary {
          background: transparent;
          color: #0c251f;
          border: 1px solid rgba(12, 37, 31, 0.2);
        }
        .action-btn-secondary:hover {
          border-color: #0c251f;
          background: rgba(12, 37, 31, 0.03);
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(rgba(12, 37, 31, 0.85), rgba(12, 37, 31, 0.95)), url("/images/rooms/room-bed.jpg") center/cover',
        padding: '160px 0 100px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container reveal">
          <p style={{ color: '#cda252', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            Accommodations
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', fontWeight: 700 }}>
            Luxury Serviced Apartments
          </h1>
          <div style={{ width: '60px', height: '2px', background: '#cda252', margin: '0 auto 24px' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.6 }}>
            Explore our 10 fully furnished premium suites in Thiruvalla. Beautiful layouts, A/C, fully equipped kitchen, and warm hospitality.
          </p>
        </div>
      </div>

      {/* Apartments Grid */}
      <section className="section-lg">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {APARTMENTS_DATA.map((apart, idx) => (
              <div key={idx} className="reveal luxury-card" style={{ animationDelay: `${(idx % 3) * 100}ms` }}>
                <div className="luxury-img-container">
                  <img src={apart.img} alt={apart.name} />
                  <div className="apart-badge">
                    {apart.bhk}
                  </div>
                </div>
                
                <div style={{ padding: '32px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#0c251f', marginBottom: '8px' }}>
                    {apart.name}
                  </h3>
                  
                  <p style={{ color: '#cda252', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                    {apart.beds} · {apart.size} SQ FT
                  </p>
                  
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', height: '64px', overflow: 'hidden' }}>
                    {apart.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {FACILITIES.slice(0, 4).map(f => (
                      <span key={f} style={{ background: '#f7f4ee', color: '#0c251f', padding: '4px 10px', fontSize: '11px', fontWeight: 500 }}>
                        {f}
                      </span>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(205, 162, 82, 0.15)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Per Night</p>
                      <p style={{ fontSize: '22px', fontWeight: 700, color: '#0c251f' }}>₹{apart.price.toLocaleString()}</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleViewDetails(apart.name)} className="action-btn action-btn-secondary">
                        Details
                      </button>
                      <button onClick={() => handleBookNow(apart.name)} className="action-btn action-btn-primary">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="reveal" style={{
        background: '#0c251f',
        padding: '100px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #cda252'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(205, 162, 82, 0.08) 0%, transparent 70%)'
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <p style={{ color: '#cda252', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Reservations</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'white', marginBottom: '24px' }}>
            Book Your Serviced Apartment
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', fontSize: '16px', fontWeight: 300 }}>
            Contact our reservations team or book directly online for family, business, or Sabarimala pilgrim stays.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-outline-white" style={{ padding: '16px 32px' }}>
              Contact Us
            </Link>
            <Link to="/booking" className="luxury-btn" style={{ padding: '16px 32px' }}>
              Book Online <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
