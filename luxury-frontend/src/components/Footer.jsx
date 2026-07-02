import React from 'react';
import { MapPin, Phone, Mail, Instagram, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--color-dark)',
      color: 'rgba(255,255,255,0.7)',
      position: 'relative'
    }}>
      {/* Gold Top Line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />

      <div className="container" style={{ padding: '80px 32px 40px' }}>
        <div className="grid grid-cols-4" style={{ gap: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '20px' }}>🌿</span>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  color: '#fff',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  lineHeight: 1.1
                }}>
                  Bethel Meadows
                </h3>
                <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-gold)', marginTop: '2px' }}>
                  Luxury Apartments
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '24px', color: 'rgba(255,255,255,0.5)' }}>
              Premium serviced apartments crafted for families, couples, and discerning travellers seeking comfort and luxury.
            </p>
            <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--color-gold)', fontFamily: 'var(--font-accent)', letterSpacing: '0.5px' }}>
              Rooted in Nature. Built for Life.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)', fontSize: '16px', color: '#fff',
              marginBottom: '24px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase'
            }}>
              Contact
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--color-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  M Square Mall, 3rd Floor<br />
                  Eraviperoor, Thiruvalla<br />
                  Kerala, India
                </span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={16} color="var(--color-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <a href="tel:+918281122009" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', transition: 'var(--transition-smooth)' }}>+91 82811 22009</a>
                  <a href="tel:+918675004400" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>+91 86750 04400</a>
                  <a href="tel:+919645494400" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>+91 96454 94400</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)', fontSize: '16px', color: '#fff',
              marginBottom: '24px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase'
            }}>
              Quick Links
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['About Us', 'Our Apartments', 'Amenities', 'Gallery', 'Reviews', 'Contact'].map(link => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}
                    className="footer-link"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Follow */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)', fontSize: '16px', color: '#fff',
              marginBottom: '24px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase'
            }}>
              Follow Us
            </h4>
            <a
              href="https://www.instagram.com/beth_el_meadows?igsh=aDdvcXB1Ymd0ZXNr"
              target="_blank"
              rel="noreferrer"
              className="footer-social"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                padding: '12px 20px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                transition: 'var(--transition-smooth)',
                marginBottom: '16px'
              }}
            >
              <Instagram size={18} />
              Instagram
              <ArrowUpRight size={14} />
            </a>

            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                Starting from
              </p>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--color-gold)', fontWeight: 500 }}>
                ₹2,500 <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>/ night</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: '60px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            © {currentYear} Bethel Meadows. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--color-gold) !important; }
        .footer-social:hover {
          background: var(--color-gold) !important;
          color: #fff !important;
          border-color: var(--color-gold) !important;
        }
      `}</style>
    </footer>
  );
}
