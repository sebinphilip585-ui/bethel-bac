import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/#apartments' },
    { name: 'Amenities', href: '/#facilities' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Attractions', href: '/#attractions' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      if (!isHome) {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    navigate(href);
  };

  const showGlass = isScrolled || !isHome;

  return (
    <>
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
          backgroundColor: showGlass ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: showGlass ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: showGlass ? 'blur(20px)' : 'none',
          borderBottom: showGlass ? '1px solid rgba(232, 226, 216, 0.5)' : '1px solid transparent',
          padding: showGlass ? '12px 0' : '20px 0',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <a 
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: showGlass ? 'var(--color-text)' : '#fff',
              textDecoration: 'none'
            }}
            aria-label="Bethel Meadows Home"
          >
            <span style={{ fontSize: '24px' }}>🌿</span>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                lineHeight: 1.1
              }}>
                Bethel Meadows
              </div>
              <div style={{
                fontSize: '8px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                opacity: 0.7,
                fontWeight: 400,
                marginTop: '2px'
              }}>
                Luxury Apartments
              </div>
            </div>
          </a>

          {/* Desktop Links */}
          <div style={{ display: 'none' }} className="desktop-nav">
            <ul style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
              {links.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      color: showGlass ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.85)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontWeight: 500,
                      transition: 'var(--transition-smooth)',
                      position: 'relative',
                      paddingBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--color-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = showGlass ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.85)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/guest-portal"
                  onClick={(e) => { e.preventDefault(); navigate('/guest-portal'); }}
                  style={{
                    color: showGlass ? 'var(--color-text-light)' : 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: 500,
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'}
                  onMouseLeave={(e) => e.target.style.color = showGlass ? 'var(--color-text-light)' : 'rgba(255,255,255,0.7)'}
                >
                  My Booking
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  onClick={(e) => { e.preventDefault(); navigate('/booking'); }}
                  className="btn-primary"
                  style={{ padding: '10px 28px', fontSize: '11px', borderRadius: '2px' }}
                >
                  Reserve Now
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: showGlass ? 'var(--color-text)' : '#fff',
              cursor: 'pointer',
              display: 'block',
              padding: '8px',
              zIndex: 60
            }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(250, 248, 245, 0.98)',
              backdropFilter: 'blur(20px)',
              zIndex: 45,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px'
            }}
          >
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'center' }}>
              {links.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '28px',
                      fontWeight: 500,
                      display: 'block',
                      letterSpacing: '1px'
                    }}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href="/guest-portal"
                  onClick={(e) => { e.preventDefault(); navigate('/guest-portal'); setIsMobileOpen(false); }}
                  style={{
                    color: 'var(--color-gold)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 500,
                    display: 'block'
                  }}
                >
                  My Booking
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ marginTop: '16px' }}
              >
                <a
                  href="/booking"
                  onClick={(e) => { e.preventDefault(); navigate('/booking'); setIsMobileOpen(false); }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px 40px' }}
                >
                  Reserve Now
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: block !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
}
