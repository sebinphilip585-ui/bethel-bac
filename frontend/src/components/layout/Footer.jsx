import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Globe, ExternalLink, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter CTA */}
        <div className="footer-newsletter">
          <p className="section-label" style={{ marginBottom: 'var(--space-3)' }}>Stay Connected</p>
          <h3>Subscribe for Exclusive Offers</h3>
          <p>
            Receive the latest deals, events, and travel inspiration directly to your inbox.
          </p>
          {subscribed ? (
            <p style={{ color: 'var(--color-gold)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              Thank you for subscribing! ✓
            </p>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                width: '44px', height: '44px',
                background: 'var(--color-gold)',
                borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 800,
                fontSize: 'var(--text-xl)', color: 'var(--color-navy)'
              }}>B</div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-white)', letterSpacing: '1px' }}>
                  Bethel Meadows
                </div>
                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                  Hotel & Suites
                </div>
              </div>
            </div>
            <p>
              Experience the perfect blend of classic elegance and modern comfort at Bethel Meadows. 
              Nestled in a serene location, we offer an unforgettable stay with warm hospitality.
            </p>
            <div className="footer-social" style={{ marginTop: 'var(--space-6)' }}>
              <a href="#" aria-label="Social Media"><Globe size={16} /></a>
              <a href="#" aria-label="Follow Us"><ExternalLink size={16} /></a>
              <a href="mailto:info@bethelmeadows.com" aria-label="Contact"><Mail size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Explore</h4>
            <Link to="/rooms" className="footer-link">Rooms & Suites</Link>
            <Link to="/gallery" className="footer-link">Gallery</Link>
            <Link to="/amenities" className="footer-link">Amenities</Link>
            <Link to="/offers" className="footer-link">Special Offers</Link>
            <Link to="/booking" className="footer-link">Book Now</Link>
          </div>

          {/* About */}
          <div>
            <h4 className="footer-title">Company</h4>
            <Link to="/about" className="footer-link">Our Story</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms & Conditions</a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-title">Reach Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <a href="https://share.google/mFsAWt66HkAMuOeeO" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Bethel Meadows Hotel & Suites,<br/>Kerala, India</span>
              </a>
              <a href="tel:+919876543210"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
                <Phone size={14} />
                +91 98765 43210
              </a>
              <a href="mailto:info@bethelmeadows.com"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
                <Mail size={14} />
                info@bethelmeadows.com
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
                <Clock size={14} />
                24/7 Front Desk
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Bethel Meadows Hotel & Suites. All rights reserved.</p>
          <p>Crafted with care for exceptional hospitality</p>
        </div>
      </div>
    </footer>
  );
}
