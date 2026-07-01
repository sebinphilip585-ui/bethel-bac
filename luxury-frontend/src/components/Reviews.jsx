import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Rahul Sharma', location: 'Delhi, India', rating: 5, text: 'The stay was incredibly comfortable. The premium amenities and peaceful environment made our family vacation truly special. Highly recommended!' },
  { name: 'Sarah John', location: 'London, UK', rating: 5, text: 'Exceptional service and beautiful apartments. Felt like a 5-star hotel but with the warmth of a home. We stayed for two weeks and loved every minute.' },
  { name: 'Anil Kumar', location: 'Kochi, India', rating: 5, text: 'Perfect base for our Sabarimala pilgrimage. The location is very convenient, and the 24x7 support staff were extremely helpful.' }
];

export default function Reviews() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div className="section-title">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}
          >
            Guest Experiences
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            What Our Guests Say
          </motion.h2>
        </div>

        <div className="grid grid-cols-3">
          {reviews.map((rev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: 'var(--color-cards)',
                padding: '40px 32px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-luxury)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                position: 'relative'
              }}
            >
              <div style={{ color: 'var(--color-gold)', opacity: 0.2, position: 'absolute', top: '24px', right: '32px', fontSize: '64px', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                "
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="var(--color-gold)" color="var(--color-gold)" />)}
              </div>
              <p style={{ color: 'var(--color-text)', fontSize: '15px', fontStyle: 'italic', lineHeight: 1.8, flex: 1 }}>
                "{rev.text}"
              </p>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600 }}>{rev.name}</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{rev.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
