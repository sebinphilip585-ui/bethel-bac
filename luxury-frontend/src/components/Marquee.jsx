import React from 'react';

const IMAGES = [
  { src: '/images/media__1782958486604.jpg', label: 'Living Area' },
  { src: '/images/media__1782958486624.jpg', label: 'Entertainment' },
  { src: '/images/media__1782958486674.jpg', label: 'Kitchen' },
  { src: '/images/media__1782958486920.jpg', label: 'Bedroom' },
  { src: '/images/media__1782959875778.jpg', label: 'Building' },
];

export default function Marquee() {
  const allItems = [...IMAGES, ...IMAGES, ...IMAGES];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--color-cards)',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      padding: '20px 0',
      position: 'relative'
    }}>
      {/* Gold accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-gold-border), transparent)'
      }} />

      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          animation: 'marquee 40s linear infinite',
          width: 'fit-content'
        }}
      >
        {allItems.map((item, i) => (
          <React.Fragment key={i}>
            <div style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                style={{
                  height: '70px',
                  width: '110px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border-light)',
                  transition: 'var(--transition-smooth)'
                }}
              />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                color: 'var(--color-text-light)',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: 400
              }}>
                {item.label}
              </span>
              <span style={{
                color: 'var(--color-gold)',
                fontSize: '8px'
              }}>✦</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Gold accent line bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-gold-border), transparent)'
      }} />

      <style>{`
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
