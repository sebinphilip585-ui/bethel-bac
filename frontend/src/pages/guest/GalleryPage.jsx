import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/images/rooms/room-bed.jpg', label: 'Deluxe Room — King Bed', category: 'Rooms' },
  { src: '/images/rooms/room-ac.jpg', label: 'Room Ambiance — Warm Lighting', category: 'Rooms' },
  { src: '/images/rooms/room-tv.jpg', label: 'Entertainment Center', category: 'Rooms' },
  { src: '/images/rooms/room-living.jpg', label: 'Family Suite — Living Area', category: 'Common Areas' },
  { src: '/images/rooms/room-sofa.jpg', label: 'Premium Suite — Lounge', category: 'Common Areas' },
  { src: '/images/rooms/room-bed.jpg', label: 'Premium Bedding', category: 'Rooms' },
  { src: '/images/rooms/room-tv.jpg', label: 'Smart TV Setup', category: 'Amenities' },
  { src: '/images/rooms/room-living.jpg', label: 'Wooden Partition Design', category: 'Common Areas' },
  { src: '/images/rooms/room-ac.jpg', label: 'Climate Control', category: 'Amenities' },
];

const CATEGORIES = ['All', 'Rooms', 'Common Areas', 'Amenities'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  function openLightbox(idx) { setLightbox(idx); }
  function closeLightbox() { setLightbox(null); }
  function nextImage() { setLightbox(prev => (prev + 1) % filtered.length); }
  function prevImage() { setLightbox(prev => (prev - 1 + filtered.length) % filtered.length); }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="section-label">Visual Tour</p>
          <h1 className="page-header-title">Gallery</h1>
          <div className="divider">
            <span className="divider-diamond" />
          </div>
          <p className="page-header-subtitle">
            Take a visual tour of Bethel Meadows and discover the elegance that awaits you.
          </p>
        </div>
      </div>

      <section className="section-lg">
        <div className="container">
          {/* Category Filter */}
          <div style={{
            display: 'flex', gap: 'var(--space-2)', justifyContent: 'center',
            marginBottom: 'var(--space-12)', flexWrap: 'wrap'
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: 'var(--space-2) var(--space-6)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--color-gold)' : 'var(--color-gray-300)',
                  background: activeCategory === cat ? 'var(--color-gold)' : 'transparent',
                  color: activeCategory === cat ? 'var(--color-navy)' : 'var(--color-gray-500)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  minHeight: '40px'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <div
                key={i}
                className={`gallery-item ${i === 0 ? 'large' : ''}`}
                onClick={() => openLightbox(i)}
              >
                <img src={img.src} alt={img.label} />
                <div className="gallery-item-overlay">
                  <span>{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={28} />
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={e => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft size={24} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <img src={filtered[lightbox].src} alt={filtered[lightbox].label} />
            <p style={{
              color: 'var(--color-white)', marginTop: 'var(--space-4)',
              fontSize: 'var(--text-sm)', letterSpacing: '0.5px'
            }}>
              {filtered[lightbox].label}
            </p>
          </div>
          <button
            className="lightbox-nav lightbox-next"
            onClick={e => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight size={24} />
          </button>
          <div className="lightbox-counter">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}
