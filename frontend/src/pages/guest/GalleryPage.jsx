import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

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

const GALLERY_IMAGES = [
  { src: '/images/rooms/room-living.jpg', label: 'Suite Living Area', category: 'Suites', size: 'large' },
  { src: '/images/rooms/room-bed.jpg', label: 'Premium King Bed', category: 'Rooms', size: 'small' },
  { src: '/images/rooms/room-sofa.jpg', label: 'Lounge Setup', category: 'Suites', size: 'medium' },
  { src: '/images/rooms/room-tv.jpg', label: 'Entertainment System', category: 'Amenities', size: 'small' },
  { src: '/images/rooms/room-ac.jpg', label: 'Climate Control', category: 'Amenities', size: 'small' },
  { src: '/images/rooms/room-living.jpg', label: 'Dining Area', category: 'Common Areas', size: 'medium' },
  { src: '/images/rooms/room-bed.jpg', label: 'Cozy Interiors', category: 'Rooms', size: 'large' },
  { src: '/images/rooms/room-sofa.jpg', label: 'Modern Decor', category: 'Suites', size: 'small' },
];

const CATEGORIES = ['All', 'Suites', 'Rooms', 'Common Areas', 'Amenities'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const containerRef = useReveal();

  const filtered = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  function openLightbox(idx) { 
    setLightbox(idx); 
    document.body.style.overflow = 'hidden'; 
  }
  
  function closeLightbox() { 
    setLightbox(null); 
    document.body.style.overflow = ''; 
  }
  
  function nextImage() { setLightbox(prev => (prev + 1) % filtered.length); }
  function prevImage() { setLightbox(prev => (prev - 1 + filtered.length) % filtered.length); }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, filtered.length]);

  return (
    <div ref={containerRef} style={{ background: '#fcfbfa', minHeight: '100vh' }}>
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

        /* Masonry Layout */
        .masonry-grid {
          column-count: 3;
          column-gap: 24px;
        }
        @media (max-width: 1024px) { .masonry-grid { column-count: 2; } }
        @media (max-width: 640px) { .masonry-grid { column-count: 1; } }

        .masonry-item {
          break-inside: avoid;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .masonry-item img {
          width: 100%;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .masonry-item:hover img {
          transform: scale(1.05);
        }

        .masonry-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(12,26,46,0.8) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.4s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          color: white;
        }

        .masonry-item:hover .masonry-overlay {
          opacity: 1;
        }

        .zoom-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
          transition: all 0.4s;
          color: var(--color-gold);
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          padding: 12px;
        }

        .masonry-item:hover .zoom-icon {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(12, 26, 46, 0.98);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        .category-btn {
          padding: 10px 24px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .category-btn.active {
          background: var(--color-navy);
          color: var(--color-gold);
          border-color: var(--color-navy);
        }
        
        .category-btn:not(.active) {
          background: transparent;
          color: var(--color-gray-600);
          border-color: var(--color-gray-300);
        }
        
        .category-btn:not(.active):hover {
          border-color: var(--color-gold);
          color: var(--color-navy);
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(rgba(12, 26, 46, 0.85), rgba(12, 26, 46, 0.95)), url("/images/rooms/room-tv.jpg") center/cover',
        padding: '160px 0 100px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container reveal">
          <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            Visual Tour
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', fontWeight: 700 }}>
            Gallery
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '0 auto 24px' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.6 }}>
            Explore the elegance of Bethel Meadows. Discover our thoughtfully designed suites, modern amenities, and serene surroundings.
          </p>
        </div>
      </div>

      <section className="section-lg" style={{ padding: '80px 0' }}>
        <div className="container">
          
          {/* Filters */}
          <div className="reveal" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '64px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="masonry-grid">
            {filtered.map((img, i) => (
              <div 
                key={i} 
                className="masonry-item reveal" 
                style={{ animationDelay: `${(i % 5) * 100}ms` }}
                onClick={() => openLightbox(i)}
              >
                <img src={img.src} alt={img.label} loading="lazy" />
                <div className="masonry-overlay">
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '4px' }}>
                    {img.category}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 500, fontFamily: 'var(--font-heading)' }}>
                    {img.label}
                  </span>
                </div>
                <div className="zoom-icon">
                  <ZoomIn size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button 
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10001 }}
          >
            <X size={32} />
          </button>
          
          <button
            onClick={e => { e.stopPropagation(); prevImage(); }}
            style={{ position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '16px', borderRadius: '50%', cursor: 'pointer', zIndex: 10001 }}
          >
            <ChevronLeft size={32} />
          </button>
          
          <div onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '90%', maxHeight: '90vh' }}>
            <img 
              src={filtered[lightbox].src} 
              alt={filtered[lightbox].label} 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} 
            />
            <div style={{ marginTop: '24px' }}>
              <p style={{ color: 'var(--color-gold)', fontSize: '16px', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
                {filtered[lightbox].label}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
                {lightbox + 1} / {filtered.length}
              </p>
            </div>
          </div>
          
          <button
            onClick={e => { e.stopPropagation(); nextImage(); }}
            style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '16px', borderRadius: '50%', cursor: 'pointer', zIndex: 10001 }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
