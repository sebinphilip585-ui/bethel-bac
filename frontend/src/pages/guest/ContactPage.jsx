import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Camera } from 'lucide-react';

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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useReveal();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

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
        
        .contact-info-card {
          background: white;
          padding: 40px;
          border: 1px solid rgba(197, 164, 109, 0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
        }

        .contact-icon-wrapper {
          width: 56px;
          height: 56px;
          background: var(--color-gold-muted);
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          margin-bottom: 24px;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--color-gold-muted);
          color: var(--color-gold-dark);
          font-weight: 600;
          font-size: 14px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .social-link:hover {
          background: var(--color-gold);
          color: white;
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(rgba(12, 26, 46, 0.85), rgba(12, 26, 46, 0.95)), url("/images/rooms/room-ac.jpg") center/cover',
        padding: '160px 0 100px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container reveal">
          <p style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            Get In Touch
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', fontWeight: 700 }}>
            Contact Us
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '0 auto 24px' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.6 }}>
            We'd love to hear from you. Reach out for reservations, inquiries, or any assistance regarding your stay at Bethel Meadows.
          </p>
        </div>
      </div>

      <section className="section-lg" style={{ padding: '80px 0' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {/* Address */}
            <div className="reveal contact-info-card">
              <div className="contact-icon-wrapper">
                <MapPin size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Location</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: 1.6, marginBottom: '16px' }}>
                Bethel Meadows<br />
                Eraviperoor, Thiruvalla<br />
                Pathanamthitta, Kerala
              </p>
              <a href="https://maps.app.goo.gl/qIp370fRVyGLMOoHd" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Get Directions &rarr;
              </a>
            </div>

            {/* Phone */}
            <div className="reveal contact-info-card" style={{ animationDelay: '100ms' }}>
              <div className="contact-icon-wrapper">
                <Phone size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Reservations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="tel:+918281122009" style={{ fontSize: '15px', color: 'var(--color-gray-600)', fontWeight: 500 }}>+91 82811 22009</a>
                <a href="tel:+918675004400" style={{ fontSize: '15px', color: 'var(--color-gray-600)', fontWeight: 500 }}>+91 86750 04400</a>
                <a href="tel:+919645494400" style={{ fontSize: '15px', color: 'var(--color-gray-600)', fontWeight: 500 }}>+91 96454 94400</a>
              </div>
            </div>

            {/* Social & Email */}
            <div className="reveal contact-info-card" style={{ animationDelay: '200ms' }}>
              <div className="contact-icon-wrapper">
                <Camera size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Connect</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: 1.6, marginBottom: '24px' }}>
                Follow us on Instagram for updates and offers.
              </p>
              <a href="https://www.instagram.com/beth_el_meadows?igsh=aDdvcXB1Ymd0ZXNr" target="_blank" rel="noopener noreferrer" className="social-link">
                <Camera size={18} /> @beth_el_meadows
              </a>
            </div>
          </div>

          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'stretch' }}>
            {/* Form */}
            <div style={{ background: 'white', padding: '48px', border: '1px solid rgba(197, 164, 109, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                Send a Message
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', marginBottom: '32px' }}>
                Fill out the form below and our team will get back to you shortly.
              </p>

              {submitted && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-success-bg)', border: '1px solid #bbf7d0', padding: '16px', marginBottom: '24px', color: '#166534', fontSize: '14px' }}>
                  <CheckCircle size={20} />
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gray-500)', marginBottom: '8px' }}>Full Name *</label>
                    <input className="form-input" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', background: '#fcfbfa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gray-500)', marginBottom: '8px' }}>Email Address *</label>
                    <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', background: '#fcfbfa' }} />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gray-500)', marginBottom: '8px' }}>Phone Number</label>
                    <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', background: '#fcfbfa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gray-500)', marginBottom: '8px' }}>Subject *</label>
                    <select className="form-select" name="subject" value={formData.subject} onChange={handleChange} required style={{ width: '100%', background: '#fcfbfa' }}>
                      <option value="">Select a topic</option>
                      <option value="reservation">Reservation Inquiry</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gray-500)', marginBottom: '8px' }}>Message *</label>
                  <textarea className="form-input" name="message" value={formData.message} onChange={handleChange} required style={{ width: '100%', minHeight: '120px', background: '#fcfbfa' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '16px', marginTop: '8px' }}>
                  <Send size={18} style={{ marginRight: '8px' }} /> Send Message
                </button>
              </form>
            </div>

            {/* Map */}
            <div style={{ background: '#eee', height: '100%', minHeight: '400px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31481.569420659616!2d76.5599540866085!3d9.395724502551523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0622c1cecf6f1b%3A0x6e8e50b10be5d409!2sEraviperoor%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                style={{ width: '100%', height: '100%', border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bethel Meadows Location"
              />
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
