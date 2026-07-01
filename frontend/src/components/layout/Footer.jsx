import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-bg-alt)', padding: '80px 0 40px', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div className="grid grid-cols-4">
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '24px', color: 'var(--color-gold)' }}>BETHEL MEADOWS</h3>
            <p style={{ color: 'var(--color-text-light)', fontSize: '14px', marginBottom: '24px' }}>
              Premium Serviced Apartments perfectly crafted for families, couples, and discerning travellers.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '24px' }}>Contact Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--color-gold)" style={{ marginTop: '2px' }} />
                <span style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>
                  Bethel Meadows<br />
                  Eraviperoor, Thiruvalla<br />
                  Kerala
                </span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={18} color="var(--color-gold)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <a href="tel:+918281122009" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>+91 82811 22009</a>
                  <a href="tel:+918675004400" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>+91 86750 04400</a>
                  <a href="tel:+919645494400" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>+91 96454 94400</a>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '24px' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="/#about" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>About Us</Link></li>
              <li><Link to="/#apartments" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>Our Apartments</Link></li>
              <li><Link to="/#facilities" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>Facilities</Link></li>
              <li><Link to="/#gallery" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '24px' }}>Follow Us</h4>
            <a 
              href="https://www.instagram.com/beth_el_meadows?igsh=aDdvcXB1Ymd0ZXNr" 
              target="_blank" 
              rel="noreferrer"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'var(--color-text-light)',
                fontSize: '14px',
                padding: '12px 24px',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-gold)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg> Instagram
            </a>
          </div>
        </div>
        
        <div style={{ marginTop: '80px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>&copy; {new Date().getFullYear()} Bethel Meadows. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
