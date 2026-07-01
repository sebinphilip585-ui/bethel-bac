import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#' },
    { name: 'Apartments', href: '#apartments' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Attractions', href: '#attractions' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isScrolled ? 'var(--color-bg)' : 'transparent',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
        padding: isScrolled ? '15px 0' : '25px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#" style={{ 
          color: isScrolled ? 'var(--color-text)' : '#fff',
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          BETHEL MEADOWS
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {links.map(link => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  style={{
                    color: isScrolled ? 'var(--color-text)' : '#fff',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 500,
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'}
                  onMouseLeave={(e) => e.target.style.color = isScrolled ? 'var(--color-text)' : '#fff'}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#book" className={isScrolled ? 'btn-primary' : 'btn-outline'} style={{ padding: '10px 24px', fontSize: '12px' }}>
                Book Now
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          style={{ background: 'transparent', border: 'none', color: isScrolled ? 'var(--color-text)' : '#fff', cursor: 'pointer', display: 'block' }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: 'var(--color-bg)',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              padding: '100px 24px 24px',
              overflowY: 'auto'
            }}
          >
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
              {links.map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '28px',
                      display: 'block'
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: '24px' }}>
                <a href="#book" className="btn-primary" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
                  Book Now
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: block !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
