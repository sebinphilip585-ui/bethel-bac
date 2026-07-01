import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, ArrowRight, 
  ChevronLeft, ChevronRight, Star, Shield, Users, Maximize2, 
  Coffee, Wifi, Wind, Tv, Car, Sparkles, Utensils, Heart, Info, Award
} from 'lucide-react';

// Custom Reveal Hook
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = ref.current?.querySelectorAll('.reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

const HERO_IMAGES = [
  '/images/rooms/room-living.jpg',
  '/images/rooms/room-bed.jpg',
  '/images/rooms/room-sofa.jpg',
];

const ATTRACTIONS = [
  { name: 'Thiruvalla Railway Station', distance: '4 km', time: '10 mins', desc: 'Main railway connectivity link to Eraviperoor.' },
  { name: 'Chengannur Railway Station', distance: '11 km', time: '20 mins', desc: 'Major transit station for Sabarimala pilgrims.' },
  { name: 'Maramon Convention Ground', distance: '6 km', time: '12 mins', desc: 'Asia\'s largest Christian convention ground.' },
  { name: 'Aranmula Parthasarathy Temple', distance: '10 km', time: '20 mins', desc: 'Historic temple famous for Aranmula Uthrattathi Boat Race.' },
  { name: 'Niranam St. Mary\'s Church', distance: '12 km', time: '25 mins', desc: 'One of the oldest churches in India, founded by St. Thomas.' },
  { name: 'Pamba River', distance: '10 km', time: '20 mins', desc: 'Holy river flowing through the heart of Pathanamthitta.' },
  { name: 'Kottayam', distance: '26 km', time: '50 mins', desc: 'Major commercial city nearby.' },
  { name: 'Sabarimala', distance: '85 km', time: '2.5 hrs', desc: 'Famous hilltop pilgrimage shrine.' },
];

const REVIEWS = [
  { name: 'Renjith Thomas', role: 'Family Stay', text: 'Stunning luxury apartments. The kitchen was fully equipped which made our 2-week family stay extremely comfortable.', rating: 5 },
  { name: 'Dr. Priya Nair', role: 'Business Traveller', text: 'Very quiet and peaceful environment, high-speed Wi-Fi worked flawlessly. Highly recommended for work trips.', rating: 5 },
  { name: 'Sajith Kumar', role: 'Sabarimala Pilgrim', text: 'Perfect stopover location. Clean rooms, hot water, and close proximity to Chengannur station.', rating: 5 },
];

const GALLERY_IMAGES = [
  { src: '/images/rooms/room-living.jpg', label: 'Spacious Suite Living Area' },
  { src: '/images/rooms/room-bed.jpg', label: 'Premium King Bedroom' },
  { src: '/images/rooms/room-sofa.jpg', label: 'Luxury Lounge Area' },
  { src: '/images/rooms/room-tv.jpg', label: 'Modern Entertainment System' },
];

export default function HomePage() {
  const { roomTypes } = useData();
  const navigate = useNavigate();
  const containerRef = useReveal();
  
  // Hero Image Slider
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Quick Search Form State
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/booking?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`);
  };

  return (
    <div ref={containerRef} style={{ background: '#fdfcf9', color: '#222222', overflowX: 'hidden' }}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Hero Slideshow */
        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .hero-slide.active {
          opacity: 1;
        }
        
        /* Gold Frame Decoration */
        .luxury-frame {
          position: absolute;
          border: 1px solid rgba(205, 162, 82, 0.3);
          pointer-events: none;
          z-index: 2;
        }
        .luxury-frame-tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; width: 60px; height: 60px; }
        .luxury-frame-br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; width: 60px; height: 60px; }

        /* Custom Cards */
        .apart-card {
          background: white;
          border: 1px solid rgba(205, 162, 82, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .apart-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(12, 37, 31, 0.08);
          border-color: rgba(205, 162, 82, 0.4);
        }
        
        .facility-badge {
          background: #f7f4ee;
          color: #0c251f;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          border: 1px solid rgba(205, 162, 82, 0.1);
        }
        
        .luxury-btn {
          background: #0c251f;
          color: #cda252;
          border: 1px solid #cda252;
          padding: 14px 28px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .luxury-btn:hover {
          background: #cda252;
          color: #0c251f;
          box-shadow: 0 8px 24px rgba(205, 162, 82, 0.2);
        }
        
        .luxury-btn-outline {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.4);
          padding: 14px 28px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .luxury-btn-outline:hover {
          border-color: #cda252;
          color: #cda252;
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      {/* Hero Section */}
      <section style={{ height: '95vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {HERO_IMAGES.map((img, i) => (
          <div key={i} className={`hero-slide ${i === heroIndex ? 'active' : ''}`}>
            <img src={img} alt="Bethel Meadows" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(12,37,31,0.5), rgba(12,37,31,0.85))' }} />
          </div>
        ))}
        
        <div className="luxury-frame luxury-frame-tl" />
        <div className="luxury-frame luxury-frame-br" />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', maxWidth: '850px' }}>
          <p style={{ color: '#cda252', letterSpacing: '6px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '24px' }}>
            Welcome to Bethel Meadows
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, marginBottom: '24px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Experience Comfort at Bethel Meadows
          </h1>
          <p style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', fontWeight: 300 }}>
            Premium Serviced Apartments in Eraviperoor, Thiruvalla.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" className="luxury-btn">
              Book Now <ArrowRight size={16} />
            </Link>
            <a href="#apartments" className="luxury-btn-outline">
              Explore Apartments
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-lg" style={{ background: '#fdfcf9', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div className="reveal">
              <span className="section-label">Luxury Living</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0c251f', marginBottom: '24px', fontWeight: 600 }}>
                A Sanctuary in Thiruvalla
              </h2>
              <p style={{ color: '#555555', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', fontWeight: 300 }}>
                Nestled in the serene locale of Eraviperoor, Pathanamthitta, Bethel Meadows offers premium serviced apartments crafted for families, couples, business travellers, pilgrims visiting Sabarimala, and those looking for peaceful vacation stays.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#0c251f', marginBottom: '8px' }}>Prime Location</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Centrally connected to major transit hubs and historic temples.</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#0c251f', marginBottom: '8px' }}>Modern Security</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>24/7 guest support, CCTV coverage, and safe parking.</p>
                </div>
              </div>
            </div>
            
            <div className="reveal" style={{ position: 'relative' }}>
              <div style={{ border: '1px solid #cda252', padding: '16px', background: '#fdfcf9' }}>
                <img src="/images/rooms/room-living.jpg" alt="Living Room" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-30px', left: '30px', background: '#0c251f', color: 'white', padding: '24px 32px', border: '1px solid #cda252' }}>
                <p style={{ color: '#cda252', fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>10</p>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)' }}>Luxury Suites</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartments List */}
      <section id="apartments" className="section-lg" style={{ background: '#f7f4ee', borderTop: '1px solid rgba(205, 162, 82, 0.1)' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: '64px' }}>
            <span className="section-label">Suites & Accommodations</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0c251f', fontWeight: 600 }}>
              Our Serviced Apartments
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#cda252', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {roomTypes.map((room) => (
              <div key={room.id} className="reveal apart-card">
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img src={room.images[0] || '/images/rooms/room-bed.jpg'} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#0c251f', color: '#cda252', padding: '6px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>
                    {room.name.includes('3BHK') ? '3BHK' : room.name.includes('2BHK') || room.max_guests >= 4 ? '2BHK' : '1BHK'}
                  </div>
                </div>
                <div style={{ padding: '32px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#0c251f', marginBottom: '8px' }}>
                    {room.name}
                  </h3>
                  <p style={{ color: '#cda252', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                    {room.bed_type} Bed · {room.size_sqft} SQ FT
                  </p>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', height: '64px', overflow: 'hidden' }}>
                    {room.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {room.facilities.slice(0, 3).map(f => (
                      <span key={f} className="facility-badge">{f}</span>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(205, 162, 82, 0.15)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Per Night</p>
                      <p style={{ fontSize: '20px', fontWeight: 700, color: '#0c251f' }}>₹{room.base_price.toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/rooms/${room.slug}`} className="btn btn-outline btn-sm">
                        Details
                      </Link>
                      <Link to={`/booking?room=${room.id}`} className="btn btn-primary btn-sm" style={{ background: '#0c251f', color: '#cda252' }}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-lg" style={{ background: '#fdfcf9' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: '64px' }}>
            <span className="section-label">Amenities</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0c251f', fontWeight: 600 }}>
              Premium Amenities
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#cda252', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Wind size={24} />, name: 'Air Conditioning' },
              { icon: <Award size={24} />, name: 'Fully Furnished' },
              { icon: <Utensils size={24} />, name: 'Equipped Kitchen' },
              { icon: <Coffee size={24} />, name: 'Refrigerator' },
              { icon: <Tv size={24} />, name: 'Smart TV' },
              { icon: <Wifi size={24} />, name: 'High-Speed Wi-Fi' },
              { icon: <Shield size={24} />, name: 'Attached Bathroom' },
              { icon: <Sparkles size={24} />, name: 'Hot Water' },
              { icon: <Clock size={24} />, name: 'Wardrobe' },
              { icon: <Utensils size={24} />, name: 'Dining Area' },
              { icon: <Car size={24} />, name: 'Power Backup' },
              { icon: <Car size={24} />, name: 'Free Parking' },
              { icon: <Shield size={24} />, name: 'CCTV Security' },
              { icon: <Phone size={24} />, name: '24×7 Guest Support' },
              { icon: <Users size={24} />, name: 'Family Friendly' }
            ].map((facility, i) => (
              <div key={i} className="reveal text-center" style={{ padding: '32px 24px', background: '#f7f4ee', border: '1px solid rgba(205, 162, 82, 0.15)' }}>
                <div style={{ color: '#cda252', marginBottom: '16px', display: 'inline-block' }}>
                  {facility.icon}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0c251f' }}>{facility.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="section-lg" style={{ background: '#f7f4ee' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: '64px' }}>
            <span className="section-label">Travel Guide</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0c251f', fontWeight: 600 }}>
              Nearby Attractions
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#cda252', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {ATTRACTIONS.map((attract, i) => (
              <div key={i} className="reveal" style={{ background: 'white', padding: '32px', border: '1px solid rgba(205, 162, 82, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#cda252', letterSpacing: '1px' }}>
                    {attract.distance}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666' }}>{attract.time}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#0c251f', marginBottom: '12px' }}>
                  {attract.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{attract.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-lg" style={{ background: '#fdfcf9' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: '64px' }}>
            <span className="section-label">Gallery</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0c251f', fontWeight: 600 }}>
              Visual Tour
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#cda252', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {GALLERY_IMAGES.map((img, i) => (
              <div key={i} className="reveal" style={{ overflow: 'hidden', height: '250px' }}>
                <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-lg" style={{ background: '#0c251f', color: 'white' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: '64px' }}>
            <span style={{ color: '#cda252', letterSpacing: '4px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>Reviews</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'white', marginTop: '12px' }}>
              What Our Guests Say
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#cda252', margin: '24px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {REVIEWS.map((review, i) => (
              <div key={i} className="reveal" style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', border: '1px solid rgba(205, 162, 82, 0.2)' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', color: '#cda252' }}>
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'white' }}>{review.name}</h4>
                  <p style={{ fontSize: '11px', color: '#cda252', textTransform: 'uppercase', letterSpacing: '1px' }}>{review.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal text-center" style={{ marginTop: '48px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              * Reviews marked as sample content for illustration.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-lg" style={{ background: '#fdfcf9' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px' }}>
            <div className="reveal">
              <span className="section-label">Connect</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#0c251f', marginBottom: '24px', fontWeight: 600 }}>
                Get In Touch
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <MapPin color="#cda252" />
                  <div>
                    <h4 style={{ fontWeight: 600, color: '#0c251f' }}>Address</h4>
                    <p style={{ fontSize: '14px', color: '#666' }}>Bethel Meadows, Eraviperoor, Thiruvalla, Kerala</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Phone color="#cda252" />
                  <div>
                    <h4 style={{ fontWeight: 600, color: '#0c251f' }}>Phone Numbers</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                      <a href="tel:+918281122009" style={{ fontSize: '14px', color: '#666' }}>+91 82811 22009</a>
                      <a href="tel:+918675004400" style={{ fontSize: '14px', color: '#666' }}>+91 86750 04400</a>
                      <a href="tel:+919645494400" style={{ fontSize: '14px', color: '#666' }}>+91 96454 94400</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <div style={{ background: 'white', padding: '40px', border: '1px solid rgba(205, 162, 82, 0.15)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#0c251f', marginBottom: '24px' }}>Send Us a Message</h3>
                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input placeholder="Your Name" className="form-input" required />
                  <input placeholder="Email Address" type="email" className="form-input" required />
                  <textarea placeholder="Message" className="form-input" style={{ minHeight: '100px' }} required />
                  <button type="submit" className="luxury-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
