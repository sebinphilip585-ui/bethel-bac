import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Wifi, Coffee, Shield, Star, Users, Maximize2, ArrowRight } from 'lucide-react';

export default function RoomsPage() {
  const { roomTypes } = useData();
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <p className="section-label">Accommodation</p>
          <h1 className="page-header-title">Rooms & Suites</h1>
          <div className="divider">
            <span className="divider-diamond" />
          </div>
          <p className="page-header-subtitle">
            Discover our collection of thoughtfully designed rooms, each offering a perfect 
            blend of classic charm and modern luxury.
          </p>
        </div>
      </div>

      {/* Room Showcases — alternating layout */}
      <section className="section-lg">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {roomTypes.map((room, i) => (
            <div key={room.id} className={`room-showcase ${i % 2 === 1 ? 'reversed' : ''}`}>
              <div className="room-showcase-img">
                <img src={room.images[0]} alt={room.name} />
                {room.count <= 4 && (
                  <div className="room-card-badge" style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)' }}>
                    Limited Availability
                  </div>
                )}
              </div>
              <div className="room-showcase-content">
                <p className="room-card-type" style={{ marginBottom: 'var(--space-2)' }}>
                  {room.bed_type} Bed · {room.size_sqft} sq ft
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-3xl)',
                  color: 'var(--color-navy)',
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '-0.01em'
                }}>
                  {room.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-gray-500)',
                  lineHeight: '1.8',
                  marginBottom: 'var(--space-6)'
                }}>
                  {room.description}
                </p>
                
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                  <span className="room-card-amenity"><Users size={14} /> {room.max_guests} Guests</span>
                  <span className="room-card-amenity"><Maximize2 size={14} /> {room.size_sqft} sqft</span>
                  <span className="room-card-amenity"><Wifi size={14} /> WiFi</span>
                  <span className="room-card-amenity"><Shield size={14} /> AC</span>
                  <span className="room-card-amenity"><Star size={14} /> TV</span>
                </div>

                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)',
                  marginBottom: 'var(--space-6)'
                }}>
                  {room.facilities.slice(0, 6).map(f => (
                    <span key={f} style={{
                      padding: '4px 12px',
                      background: 'var(--color-gold-muted)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gold-dark)',
                      letterSpacing: '0.5px'
                    }}>
                      {f}
                    </span>
                  ))}
                  {room.facilities.length > 6 && (
                    <span style={{
                      padding: '4px 12px',
                      background: 'var(--color-gold-muted)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gold-dark)'
                    }}>
                      +{room.facilities.length - 6} more
                    </span>
                  )}
                </div>

                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-gray-200)',
                  flexWrap: 'wrap', gap: 'var(--space-4)'
                }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting from</span>
                    <div className="room-card-price" style={{ marginTop: '2px' }}>
                      ₹{room.base_price.toLocaleString()} <span>/ night</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Link to={`/rooms/${room.slug}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>
                    <Link to={`/booking?room=${room.id}`} className="btn btn-primary btn-sm">
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
      <section style={{
        background: 'var(--color-navy)',
        padding: 'var(--space-20) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(197,164,109,0.06) 0%, transparent 70%)'
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <p className="section-label" style={{ marginBottom: 'var(--space-3)' }}>Need Help?</p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-white)',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Can't Decide? We're Here to Help
          </h2>
          <p style={{
            fontFamily: 'var(--font-accent)',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 'var(--space-8)',
            maxWidth: '500px',
            margin: '0 auto var(--space-8)',
            fontSize: 'var(--text-lg)'
          }}>
            Contact our reservations team and we'll help you find the perfect room for your stay.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-outline-white">
              Contact Us
            </Link>
            <Link to="/booking" className="btn btn-primary">
              Book Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
