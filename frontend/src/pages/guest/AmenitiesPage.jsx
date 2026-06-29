import { Link } from 'react-router-dom';
import { 
  Wifi, Car, Coffee, Utensils, Shield, Tv, Wind, Bath, 
  ShowerHead, Shirt, Phone, Clock, Sparkles, Camera,
  Baby, Accessibility, ArrowRight
} from 'lucide-react';

const AMENITIES = [
  { icon: <Wifi size={26} />, name: 'High-Speed WiFi', desc: 'Complimentary high-speed wireless internet available throughout the hotel, including rooms, lobby, and common areas.' },
  { icon: <Wind size={26} />, name: 'Air Conditioning', desc: 'Individual climate control in every room with modern split AC units for your comfort in any weather.' },
  { icon: <Tv size={26} />, name: 'Smart TV', desc: 'Large-screen Smart TVs in every room with cable channels and streaming capabilities for entertainment.' },
  { icon: <Car size={26} />, name: 'Free Parking', desc: 'Spacious parking area with 24/7 security and CCTV surveillance for your vehicle safety.' },
  { icon: <Coffee size={26} />, name: 'Room Service', desc: 'In-room dining service available throughout the day. Enjoy meals in the comfort of your room.' },
  { icon: <Shield size={26} />, name: '24/7 Security', desc: 'Round-the-clock security personnel and CCTV monitoring to ensure your safety and peace of mind.' },
  { icon: <Sparkles size={26} />, name: 'Daily Housekeeping', desc: 'Professional housekeeping services every day to maintain the highest standards of cleanliness.' },
  { icon: <Bath size={26} />, name: 'Hot Water', desc: '24/7 hot water supply in all rooms with modern geyser systems for your comfort.' },
  { icon: <ShowerHead size={26} />, name: 'Premium Toiletries', desc: 'Complimentary premium toiletries including shampoo, conditioner, body wash, and soap.' },
  { icon: <Phone size={26} />, name: 'Intercom System', desc: 'In-room intercom/telephone system for direct communication with the front desk.' },
  { icon: <Shirt size={26} />, name: 'Laundry Service', desc: 'Express laundry and ironing services available on request for your convenience.' },
  { icon: <Utensils size={26} />, name: 'Dining', desc: 'In-house dining options with a variety of cuisines and special dietary accommodations.' },
  { icon: <Clock size={26} />, name: '24/7 Front Desk', desc: 'Our front desk team is available around the clock to assist with any requests or inquiries.' },
  { icon: <Camera size={26} />, name: 'CCTV Coverage', desc: 'Comprehensive CCTV coverage in all common areas and corridors for enhanced security.' },
  { icon: <Baby size={26} />, name: 'Child Friendly', desc: 'Extra beds and cribs available on request. Children under 5 stay free of charge.' },
  { icon: <Accessibility size={26} />, name: 'Accessible', desc: 'Wheelchair-accessible rooms and facilities available for guests with special needs.' },
];

const IN_ROOM = [
  'King-size Bed', 'Air Conditioning', 'Smart TV', 'Free WiFi',
  'Mini Bar', 'Work Desk', 'Wardrobe', 'Hot Water',
  'Room Service', 'Daily Housekeeping', 'Premium Toiletries', 'Intercom',
  'Safe', 'Iron & Board', 'Power Backup', 'Charging Points'
];

export default function AmenitiesPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="section-label">Our Facilities</p>
          <h1 className="page-header-title">Amenities</h1>
          <div className="divider">
            <span className="divider-diamond" />
          </div>
          <p className="page-header-subtitle">
            Every detail is designed to make your stay comfortable and memorable.
          </p>
        </div>
      </div>

      {/* Main Amenities Grid */}
      <section className="section-lg">
        <div className="container">
          <div className="amenities-grid">
            {AMENITIES.map((amenity, i) => (
              <div key={i} className="amenity-card animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="amenity-icon">
                  {amenity.icon}
                </div>
                <div>
                  <h3 className="amenity-name">{amenity.name}</h3>
                  <p className="amenity-desc">{amenity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In Every Room */}
      <section className="section-lg" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div className="text-center">
            <p className="section-label">Standard Inclusions</p>
            <h2 className="section-title">In Every Room</h2>
            <div className="divider">
              <span className="divider-diamond" />
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-8)'
          }}>
            {IN_ROOM.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: 'var(--color-white)',
                border: '1px solid var(--color-gray-200)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-700)',
                transition: 'border-color var(--transition-fast)',
                cursor: 'default'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-gray-200)'}
              >
                <span style={{ 
                  color: 'var(--color-gold)', 
                  fontSize: 'var(--text-lg)',
                  lineHeight: 1 
                }}>✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-lg" style={{ 
        background: 'var(--color-navy)', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(197,164,109,0.06) 0%, transparent 70%)'
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <p className="section-label">Ready to Experience?</p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-white)',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Book Your Stay Today
          </h2>
          <p style={{
            fontFamily: 'var(--font-accent)',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '500px',
            margin: '0 auto var(--space-8)',
            fontSize: 'var(--text-lg)'
          }}>
            Experience all our amenities firsthand and enjoy premium comfort.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rooms" className="btn btn-outline-white">
              View Rooms
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
