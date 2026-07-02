import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/images/media__1782959875778.jpg', category: 'Exterior', caption: 'Bethel Meadows Building' },
  { src: '/images/media__1782958486920.jpg', category: 'Bedroom', caption: 'Premium Bedroom' },
  { src: '/images/media__1782958486604.jpg', category: 'Living', caption: 'Comfortable Living Area' },
  { src: '/images/media__1782958486624.jpg', category: 'Entertainment', caption: 'Smart TV Setup' },
  { src: '/images/media__1782958486674.jpg', category: 'Kitchen', caption: 'Equipped Kitchen' },
  { src: '/images/media__1782958486920.jpg', category: 'Bedroom', caption: 'Cozy Bedroom View' },
  { src: '/images/media__1782958486604.jpg', category: 'Living', caption: 'Sofa Lounge' },
  { src: '/images/media__1782958486624.jpg', category: 'Entertainment', caption: 'Wood Panel Entertainment' },
];

const CATEGORIES = ['All', 'Exterior', 'Bedroom', 'Living', 'Kitchen', 'Entertainment'];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => setSelectedIndex(prev => (prev + 1) % filtered.length);
  const goPrev = () => setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);

  // Masonry height pattern
  const getHeight = (i) => {
    const pattern = [320, 240, 280, 360, 240, 320, 280, 240];
    return pattern[i % pattern.length] + 'px';
  };

  return (
    <section id="gallery" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div className="section-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}
          >
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
            <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '11px', fontWeight: 600 }}>
              Visual Journey
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Photo Gallery
          </motion.h2>
        </div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '48px', flexWrap: 'wrap' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: 'none',
                background: activeCategory === cat ? 'var(--color-gold)' : 'var(--color-bg-alt)',
                color: activeCategory === cat ? '#fff' : 'var(--color-text-light)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          gridAutoRows: '10px'
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src + i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
                className="gallery-item"
                style={{
                  height: getHeight(i),
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: 'var(--radius-sm)',
                  gridRow: `span ${Math.ceil(parseInt(getHeight(i)) / 10)}`
                }}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                />
                {/* Overlay */}
                <div className="gallery-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(26,26,26,0.7) 100%)',
                  opacity: 0,
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  padding: '20px'
                }}>
                  <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>
                    {img.caption}
                  </span>
                  <ZoomIn size={18} color="var(--color-gold)" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.95)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute', top: '24px', right: '24px',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', cursor: 'pointer', transition: 'var(--transition-smooth)'
              }}
              aria-label="Close gallery"
            >
              <X size={20} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              style={{
                position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', cursor: 'pointer', transition: 'var(--transition-smooth)'
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={filtered[selectedIndex]?.src}
              alt={filtered[selectedIndex]?.caption}
              style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px' }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              style={{
                position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', cursor: 'pointer', transition: 'var(--transition-smooth)'
              }}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Counter */}
            <div style={{
              position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.5)', fontSize: '13px', letterSpacing: '2px'
            }}>
              {selectedIndex + 1} / {filtered.length}
            </div>

            {/* Caption */}
            <div style={{
              position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
              color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '18px', letterSpacing: '1px'
            }}>
              {filtered[selectedIndex]?.caption}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-item:hover img {
          transform: scale(1.08);
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
