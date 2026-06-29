import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // In production, this would send to Supabase or an API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="section-label">Get In Touch</p>
          <h1 className="page-header-title">Contact Us</h1>
          <div className="divider">
            <span className="divider-diamond" />
          </div>
          <p className="page-header-subtitle">
            We'd love to hear from you. Reach out for reservations, inquiries, or any assistance.
          </p>
        </div>
      </div>

      {/* Map Full Width */}
      <div style={{ height: '350px', width: '100%' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31307.72895696568!2d77.042738!3d10.091176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0799794d099a6d%3A0x63250e5813c7c8e!2sMunnar%2C%20Kerala!5e0!3m2!1sen!2sin!4v1719408453412!5m2!1sen!2sin"
          style={{ width: '100%', height: '100%', border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Location"
        />
      </div>

      <section className="section-lg">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-12)' }}>
            {/* Contact Info */}
            <div>
              <p className="section-label">Hotel Information</p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-3xl)',
                color: 'var(--color-navy)',
                marginBottom: 'var(--space-6)',
                letterSpacing: '-0.02em'
              }}>
                We're Here For You
              </h2>
              <div className="divider-line" style={{ margin: 'var(--space-4) 0 var(--space-8)', marginRight: 'auto' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {[
                  {
                    icon: <MapPin size={20} />,
                    title: 'Address',
                    content: (
                      <>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', lineHeight: '1.6' }}>
                          Bethel Meadows Hotel & Suites<br />
                          Kerala, India
                        </p>
                        <a
                          href="https://share.google/mFsAWt66HkAMuOeeO"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-gold)',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            display: 'inline-block',
                            marginTop: 'var(--space-2)'
                          }}
                        >
                          View on Maps →
                        </a>
                      </>
                    )
                  },
                  {
                    icon: <Phone size={20} />,
                    title: 'Phone',
                    content: (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a href="tel:+919876543210" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                          +91 98765 43210
                        </a>
                        <a href="tel:+919876543211" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                          +91 98765 43211
                        </a>
                      </div>
                    )
                  },
                  {
                    icon: <Mail size={20} />,
                    title: 'Email',
                    content: (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a href="mailto:info@bethelmeadows.com" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                          info@bethelmeadows.com
                        </a>
                        <a href="mailto:reservations@bethelmeadows.com" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                          reservations@bethelmeadows.com
                        </a>
                      </div>
                    )
                  },
                  {
                    icon: <Clock size={20} />,
                    title: 'Front Desk',
                    content: (
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                        24/7 — Always available for you
                      </p>
                    )
                  }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div style={{
                      width: '48px', height: '48px',
                      background: 'var(--color-gold-muted)',
                      color: 'var(--color-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ 
                        fontWeight: 600, 
                        color: 'var(--color-navy)', 
                        marginBottom: 'var(--space-1)',
                        fontSize: 'var(--text-sm)',
                        letterSpacing: '0.5px'
                      }}>
                        {item.title}
                      </h4>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-gray-200)',
                padding: 'var(--space-10)',
                boxShadow: 'var(--shadow-card)'
              }}>
                <p className="section-label">Send a Message</p>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  color: 'var(--color-navy)',
                  marginBottom: 'var(--space-2)'
                }}>
                  How Can We Help?
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--space-8)'
                }}>
                  Fill out the form and we'll respond within 24 hours.
                </p>

                {submitted && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    background: 'var(--color-success-bg)',
                    border: '1px solid #bbf7d0',
                    padding: 'var(--space-4)',
                    marginBottom: 'var(--space-6)',
                    color: '#166534',
                    fontSize: 'var(--text-sm)'
                  }}>
                    <CheckCircle size={20} />
                    Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        className="form-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        className="form-input"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-input"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <select
                        className="form-select"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="reservation">Reservation Inquiry</option>
                        <option value="general">General Inquiry</option>
                        <option value="feedback">Feedback</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-input"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
