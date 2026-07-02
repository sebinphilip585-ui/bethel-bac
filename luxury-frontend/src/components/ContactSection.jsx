import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
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
              Get in Touch
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Contact Us
          </motion.h2>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '60px', alignItems: 'start' }}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--color-gold-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <MapPin size={20} color="var(--color-gold)" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '4px' }}>Location</h4>
                  <p style={{ color: 'var(--color-text-light)', fontSize: '14px', lineHeight: 1.6 }}>
                    Bethel Meadows, M Square Mall, 3rd Floor<br />
                    Eraviperoor, Thiruvalla, Kerala
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--color-gold-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Phone size={20} color="var(--color-gold)" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '4px' }}>Phone</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <a href="tel:+918281122009" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>+91 82811 22009</a>
                    <a href="tel:+918675004400" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>+91 86750 04400</a>
                    <a href="tel:+919645494400" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>+91 96454 94400</a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--color-gold-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Mail size={20} color="var(--color-gold)" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '4px' }}>Email</h4>
                  <a href="mailto:info@bethelmeadows.com" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>info@bethelmeadows.com</a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)', height: '250px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.5!2d76.57!3d9.39!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMjMnMjQuMCJOIDc2wrAzNCcxMi4wIkU!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bethel Meadows Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{
              background: 'var(--color-cards)',
              padding: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '8px' }}>Send us a Message</h3>
              <p style={{ color: 'var(--color-text-light)', fontSize: '14px', marginBottom: '32px' }}>
                We'd love to hear from you. Fill out the form below.
              </p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(46, 204, 113, 0.1)',
                    border: '1px solid rgba(46, 204, 113, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#2ECC71',
                    fontSize: '14px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}
                >
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="label-luxury">Full Name</label>
                  <input
                    type="text"
                    className="input-luxury"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Email Address</label>
                  <input
                    type="email"
                    className="input-luxury"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Message</label>
                  <textarea
                    className="input-luxury"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    rows={5}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
