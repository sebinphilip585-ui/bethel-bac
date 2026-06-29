import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { 
  ChevronLeft, ChevronRight, Check, Users, Maximize2, 
  BedDouble, ArrowRight, X 
} from 'lucide-react';

export default function RoomDetailPage() {
  const { slug } = useParams();
  const { roomTypes } = useData();
  const room = roomTypes.find(r => r.slug === slug);
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!room) {
    return (
      <div style={{ padding: 'var(--space-32) 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>Room Not Found</h1>
        <Link to="/rooms" className="btn btn-primary">Back to Rooms</Link>
      </div>
    );
  }

  const otherRooms = roomTypes.filter(r => r.id !== room.id).slice(0, 3);

  function nextImage() {
    setCurrentImage(prev => (prev + 1) % room.images.length);
  }
  function prevImage() {
    setCurrentImage(prev => (prev - 1 + room.images.length) % room.images.length);
  }

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <Link to="/rooms" style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            color: 'var(--color-gold)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-6)',
            letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 500
          }}>
            <ChevronLeft size={14} /> Back to Rooms
          </Link>
          <p className="section-label">{room.bed_type} Bed · {room.size_sqft} sq ft</p>
          <h1 className="page-header-title">{room.name}</h1>
        </div>
      </div>

      {/* Image Gallery */}
      <section style={{ padding: 'var(--space-8) 0 var(--space-16)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--space-3)',
            overflow: 'hidden'
          }}>
            <div
              style={{
                position: 'relative',
                height: '500px',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={room.images[currentImage]}
                alt={room.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              />
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); prevImage(); }}
                    className="lightbox-nav lightbox-prev"
                    style={{ left: 'var(--space-4)' }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); nextImage(); }}
                    className="lightbox-nav lightbox-next"
                    style={{ right: 'var(--space-4)' }}
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div style={{
                    position: 'absolute', bottom: 'var(--space-4)', left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 'var(--text-xs)', letterSpacing: '2px'
                  }}>
                    {currentImage + 1} / {room.images.length}
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {room.images.slice(1, 3).map((img, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => { setCurrentImage(i + 1); setLightboxOpen(true); }}
                >
                  <img
                    src={img}
                    alt={`${room.name} view ${i + 2}`}
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.6s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--space-12)',
            marginTop: 'var(--space-12)'
          }}>
            {/* Left - Info */}
            <div>
              <p className="section-label">Overview</p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-3xl)',
                color: 'var(--color-navy)',
                marginBottom: 'var(--space-4)',
                letterSpacing: '-0.02em'
              }}>
                About This Room
              </h2>
              <div className="divider-line" style={{ margin: 'var(--space-4) 0 var(--space-6)', marginRight: 'auto' }} />
              <p style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-gray-600)',
                lineHeight: '1.9',
                marginBottom: 'var(--space-8)',
                fontSize: 'var(--text-lg)'
              }}>
                {room.description}
              </p>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-10)'
              }}>
                {[
                  { icon: <Users size={22} />, value: `${room.max_guests} Guests`, label: 'Maximum' },
                  { icon: <Maximize2 size={22} />, value: `${room.size_sqft} sqft`, label: 'Room Size' },
                  { icon: <BedDouble size={22} />, value: room.bed_type, label: 'Bed Type' },
                ].map((stat, i) => (
                  <div key={i} style={{
                    padding: 'var(--space-5)',
                    background: 'var(--color-cream)',
                    textAlign: 'center',
                    border: '1px solid var(--color-cream-dark)'
                  }}>
                    <div style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-2)', display: 'flex', justifyContent: 'center' }}>
                      {stat.icon}
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}>{stat.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Facilities */}
              <p className="section-label">Facilities</p>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                color: 'var(--color-navy)',
                marginBottom: 'var(--space-5)'
              }}>
                Room Amenities
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-10)'
              }}>
                {room.facilities.map(f => (
                  <div key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)',
                    padding: 'var(--space-2) 0'
                  }}>
                    <Check size={16} color="var(--color-gold)" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Policies */}
              <p className="section-label">Information</p>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                color: 'var(--color-navy)',
                marginBottom: 'var(--space-5)'
              }}>
                Policies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  'Check-in: 2:00 PM — Check-out: 11:00 AM',
                  'Free cancellation up to 24 hours before check-in',
                  'Children under 5 stay free',
                  'Extra bed available on request (₹500/night)',
                  'Government-issued ID required at check-in'
                ].map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                    fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)'
                  }}>
                    <span style={{ color: 'var(--color-gold)', flexShrink: 0, fontSize: '8px', marginTop: '6px' }}>◆</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Booking Card */}
            <div>
              <div style={{
                position: 'sticky',
                top: 'calc(80px + var(--space-6))',
                background: 'var(--color-white)',
                border: '1px solid var(--color-gray-200)',
                padding: 'var(--space-8)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-400)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 'var(--space-1)'
                }}>
                  Starting from
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-4xl)',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: 'var(--space-6)'
                }}>
                  ₹{room.base_price.toLocaleString()}
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 400,
                    color: 'var(--color-gray-500)'
                  }}> / night</span>
                </div>

                <div style={{
                  background: 'var(--color-cream)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-6)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-brown)',
                  lineHeight: '1.6'
                }}>
                  <strong>Price includes:</strong> WiFi, Breakfast, Parking, Daily Housekeeping
                </div>

                <Link
                  to={`/booking?room=${room.id}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                >
                  Book This Room
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  Contact for Inquiry
                </Link>

                <p style={{
                  textAlign: 'center',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-400)',
                  marginTop: 'var(--space-4)',
                  letterSpacing: '0.5px'
                }}>
                  Best price guaranteed when booking direct
                </p>
              </div>
            </div>
          </div>

          {/* Similar Rooms */}
          {otherRooms.length > 0 && (
            <div style={{ marginTop: 'var(--space-24)' }}>
              <div className="text-center">
                <p className="section-label">More Options</p>
                <h2 className="section-title">You May Also Like</h2>
                <div className="divider">
                  <span className="divider-diamond" />
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 'var(--space-8)',
                marginTop: 'var(--space-8)'
              }}>
                {otherRooms.map(r => (
                  <div key={r.id} className="room-card">
                    <div className="room-card-img">
                      <img src={r.images[0]} alt={r.name} />
                    </div>
                    <div className="room-card-body">
                      <p className="room-card-type">{r.bed_type} Bed</p>
                      <h3 className="room-card-name">{r.name}</h3>
                      <p className="room-card-desc">{r.short_description}</p>
                      <div className="room-card-footer">
                        <div className="room-card-price">
                          ₹{r.base_price.toLocaleString()} <span>/ night</span>
                        </div>
                        <Link to={`/rooms/${r.slug}`} className="btn btn-outline btn-sm">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={28} />
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={e => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft size={24} />
          </button>
          <img
            src={room.images[currentImage]}
            alt={room.name}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="lightbox-nav lightbox-next"
            onClick={e => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight size={24} />
          </button>
          <div className="lightbox-counter">
            {currentImage + 1} / {room.images.length}
          </div>
        </div>
      )}
    </>
  );
}
