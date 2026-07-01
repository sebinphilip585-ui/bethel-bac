import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { MapPin, Search } from 'lucide-react';

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

const APARTMENTS_DATA = [
  { name: 'Beckingham', bhk: '2BHK', price: 4500, img: '/images/rooms/room-living.jpg', size: 600, beds: '2 King Beds', desc: 'A luxurious 2BHK suite designed for elegance and comfort. Enjoy spacious living with premium furnishings, high-speed Wi-Fi, and a fully equipped kitchen.' },
  { name: 'Beverly Hills', bhk: '2BHK', price: 4500, img: '/images/rooms/room-bed.jpg', size: 600, beds: '2 King Beds', desc: 'An exquisite 2BHK apartment offering panoramic views and top-tier hospitality. Perfect for families looking for a premium stay.' },
  { name: 'Belrose', bhk: '1BHK', price: 2500, img: '/images/rooms/room-sofa.jpg', size: 350, beds: '1 King Bed', desc: 'A cozy and elegant 1BHK unit perfect for couples or solo travelers seeking a peaceful retreat with luxury fittings.' },
  { name: 'Blooms Bay', bhk: '2BHK', price: 4500, img: '/images/rooms/room-tv.jpg', size: 600, beds: '2 King Beds', desc: 'A modern 2BHK suite with a spacious living area and premium furnishings for an elevated hospitality experience.' },
  { name: 'Blue Bell', bhk: '1BHK', price: 2500, img: '/images/rooms/room-ac.jpg', size: 350, beds: '1 King Bed', desc: 'A serene 1BHK unit combining simplicity with luxury, offering a restful stay amidst Pathanamthitta\'s greenery.' },
  { name: 'Beehive', bhk: '1BHK', price: 2500, img: '/images/rooms/room-living.jpg', size: 350, beds: '1 King Bed', desc: 'A warm and inviting 1BHK suite equipped with all modern amenities for a comfortable extended stay in Thiruvalla.' },
  { name: 'Belarus', bhk: '3BHK', price: 6500, img: '/images/rooms/room-bed.jpg', size: 900, beds: '3 King Beds', desc: 'Our grandest 3BHK presidential suite offering ultimate luxury, expansive space, and elite amenities for large families.' },
  { name: 'Breeze Garden', bhk: '1BHK', price: 2500, img: '/images/rooms/room-sofa.jpg', size: 380, beds: '1 King Bed', desc: 'A beautiful garden-facing 1BHK apartment filled with natural light, peace, and high-end convenience.' },
  { name: 'Brook Hills', bhk: '1BHK', price: 2500, img: '/images/rooms/room-tv.jpg', size: 360, beds: '1 King Bed', desc: 'Enjoy scenic views and modern amenities in this elegantly designed 1BHK sanctuary in Kerala.' },
  { name: 'Bliss Heaven', bhk: '1BHK', price: 2500, img: '/images/rooms/room-ac.jpg', size: 350, beds: '1 King Bed', desc: 'A heavenly 1BHK retreat featuring modern aesthetic, warm lighting, complete privacy, and standard inclusions.' },
];

export default function RoomsPage() {
  const { roomTypes } = useData();
  const navigate = useNavigate();
  const containerRef = useReveal();

  const [bhkFilter, setBhkFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApartments = APARTMENTS_DATA.filter(apart => {
    const matchesBhk = bhkFilter === 'All' || apart.bhk === bhkFilter;
    const matchesSearch = apart.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBhk && matchesSearch;
  });

  const handleBookNow = (apartName) => {
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
    <div ref={containerRef} style={{ background: '#fdfcf9', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
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
        
        .classic-title-container {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .classic-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 4vw, 2.75rem);
          color: #0c251f;
          text-transform: uppercase;
          letter-spacing: 4px;
          display: inline-flex;
          align-items: center;
          gap: 24px;
          font-weight: 400;
        }
        
        .classic-title::before,
        .classic-title::after {
          content: '';
          display: inline-block;
          width: 80px;
          height: 1px;
          background: #cda252;
        }
        
        .classic-subtitle {
          max-width: 750px;
          margin: 20px auto 0;
          font-family: var(--font-accent);
          font-size: 16px;
          color: #555;
          line-height: 1.8;
          font-style: italic;
        }
        
        /* Filter Bar */
        .filter-bar {
          display: grid;
          grid-template-columns: 1fr 1fr 1.5fr;
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto 64px;
          padding: 0 24px;
        }
        @media (max-width: 768px) {
          .filter-bar {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        
        .filter-select {
          width: 100%;
          border: none;
          border-bottom: 1px solid rgba(12, 37, 31, 0.2);
          background: transparent;
          padding: 12px 0;
          font-size: 14px;
          color: #0c251f;
          outline: none;
          cursor: pointer;
        }
        .filter-select:focus {
          border-bottom-color: #cda252;
        }
        
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input {
          width: 100%;
          border: none;
          border-bottom: 1px solid rgba(12, 37, 31, 0.2);
          background: transparent;
          padding: 12px 0 12px 28px;
          font-size: 14px;
          color: #0c251f;
          outline: none;
        }
        .search-input:focus {
          border-bottom-color: #cda252;
        }
        
        /* Horizontal Luxury Card */
        .luxury-row-card {
          display: flex;
          background: white;
          border: 1px solid rgba(205, 162, 82, 0.15);
          margin-bottom: 32px;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .luxury-row-card:hover {
          box-shadow: 0 20px 40px rgba(12, 37, 31, 0.05);
          border-color: rgba(205, 162, 82, 0.4);
        }
        @media (max-width: 900px) {
          .luxury-row-card {
            flex-direction: column;
          }
        }
        
        .card-left-img {
          width: 40%;
          min-height: 320px;
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 900px) {
          .card-left-img {
            width: 100%;
            height: 250px;
            min-height: auto;
          }
        }
        
        .card-left-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }
        .luxury-row-card:hover .card-left-img img {
          transform: scale(1.03);
        }
        
        .card-right-content {
          width: 60%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (max-width: 900px) {
          .card-right-content {
            width: 100%;
            padding: 32px 24px;
          }
        }

        .gold-book-btn {
          background: #cda252;
          color: #0c251f;
          border: 1px solid #cda252;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .gold-book-btn:hover {
          background: #0c251f;
          color: #cda252;
        }
      `}</style>

      {/* Title section */}
      <div className="container reveal">
        <div className="classic-title-container">
          <h1 className="classic-title">Apartments in Eraviperoor</h1>
          <p className="classic-subtitle">
            Eraviperoor, a serene and historic village in Pathanamthitta, Kerala, is home to Bethel Meadows serviced apartments. Enjoy fully furnished spaces designed for modern comfort and timeless luxury.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar reveal">
        <select value={bhkFilter} onChange={e => setBhkFilter(e.target.value)} className="filter-select">
          <option value="All">All BHK Types</option>
          <option value="1BHK">1 BHK Suites</option>
          <option value="2BHK">2 BHK Suites</option>
          <option value="3BHK">3 BHK Suites</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>10 Serviced Apartments</span>
        </div>
        <div className="search-wrapper">
          <Search size={16} color="#cda252" style={{ position: 'absolute', left: 0 }} />
          <input 
            placeholder="Search by name..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="search-input" 
          />
        </div>
      </div>

      {/* Apartments list */}
      <div className="container" style={{ maxWidth: '1000px' }}>
        {filteredApartments.map((apart, idx) => (
          <div key={idx} className="reveal luxury-row-card">
            <div className="card-left-img">
              <img src={apart.img} alt={apart.name} />
            </div>
            
            <div className="card-right-content">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#0c251f', fontWeight: 500 }}>
                    {apart.name.toUpperCase()} APARTMENT, ERAVIPEROOR
                  </h2>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block' }}>Starting Rate/Night</span>
                    <span style={{ fontSize: '22px', fontWeight: 600, color: '#0c251f', fontFamily: 'var(--font-heading)' }}>
                      ₹{apart.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <MapPin size={14} color="#cda252" />
                  <span style={{ fontSize: '12px', color: '#666' }}>Bethel Meadows, Eraviperoor, Thiruvalla, Kerala, 689542</span>
                </div>

                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px', fontWeight: 300 }}>
                  {apart.desc}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(205, 162, 82, 0.15)', paddingTop: '20px' }}>
                <span style={{ fontSize: '12px', color: '#cda252', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {apart.bhk} · {apart.beds} · {apart.size} SQ FT
                </span>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleViewDetails(apart.name)} style={{ background: 'transparent', border: 'none', color: '#0c251f', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
                    View Details &raquo;
                  </button>
                  <button onClick={() => handleBookNow(apart.name)} className="gold-book-btn">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
