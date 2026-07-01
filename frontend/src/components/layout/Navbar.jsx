import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/rooms', label: 'Rooms' },
  { path: '/amenities', label: 'Facilities' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/#attractions', label: 'Nearby Attractions' },
  { path: '/#reviews', label: 'Reviews' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Utility Bar */}
      {isHome && !scrolled && (
        <div className="top-bar">
          <div className="top-bar-inner">
            <div className="top-bar-left">
              <a href="tel:+918281122009" className="top-bar-item">
                <Phone size={12} />
                +91 82811 22009
              </a>
              <a href="mailto:info@bethelmeadows.com" className="top-bar-item">
                <Mail size={12} />
                info@bethelmeadows.com
              </a>
            </div>
            <div className="top-bar-right">
              <span className="top-bar-item">Kerala, India</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className={`navbar ${isHome && !scrolled ? 'has-topbar' : ''} ${scrolled || !isHome ? 'scrolled' : 'transparent'}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">B</div>
            <div>
              <div className="navbar-logo-text">Bethel Meadows</div>
              <div className="navbar-logo-sub">Hotel & Suites</div>
            </div>
          </Link>

          <div className="navbar-links">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/booking" className="btn btn-primary btn-sm navbar-book-btn">
              Book Now
            </Link>
          </div>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`navbar-mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button
          className="navbar-mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ marginTop: 'var(--space-10)' }}>
          <div className="navbar-logo" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="navbar-logo-icon">B</div>
            <div>
              <div className="navbar-logo-text">Bethel Meadows</div>
              <div className="navbar-logo-sub">Hotel & Suites</div>
            </div>
          </div>

          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="navbar-mobile-link"
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/booking"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-8)' }}
          >
            Book Now
          </Link>

          <div style={{
            marginTop: 'var(--space-8)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <a
              href="tel:+918281122009"
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                color: 'var(--color-gold)', fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-3)'
              }}
            >
              <Phone size={14} />
              +91 82811 22009
            </a>
            <a
              href="mailto:info@bethelmeadows.com"
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)'
              }}
            >
              <Mail size={14} />
              info@bethelmeadows.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
