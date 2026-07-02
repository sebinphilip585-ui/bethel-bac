import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  { name: 'Rahul Sharma', location: 'Delhi, India', rating: 5, text: 'The stay was incredibly comfortable. The premium amenities and peaceful environment made our family vacation truly special. The apartments are exactly as shown — fully furnished with top-quality fixtures. Highly recommended!', initials: 'RS' },
  { name: 'Sarah John', location: 'London, UK', rating: 5, text: 'Exceptional service and beautiful apartments. Felt like a 5-star hotel but with the warmth of a home. We stayed for two weeks and loved every minute. The kitchen was fully equipped and perfect for our needs.', initials: 'SJ' },
  { name: 'Anil Kumar', location: 'Kochi, India', rating: 5, text: 'Perfect base for our Sabarimala pilgrimage. The location is very convenient — close to Thiruvalla Railway Station. The 24x7 support staff were extremely helpful and accommodating.', initials: 'AK' },
  { name: 'Priya Menon', location: 'Bangalore, India', rating: 5, text: 'We booked the 2 BHK for a family gathering and it was perfect. Spacious, clean, and beautifully designed. The wood-panel interiors give it a premium feel. Will definitely come back!', initials: 'PM' },
  { name: 'Thomas Kurian', location: 'Dubai, UAE', rating: 5, text: 'Outstanding property! The attention to detail in the apartments is remarkable. From the smart TV to the equipped kitchen, everything was top-notch. Best serviced apartment in Thiruvalla.', initials: 'TK' }
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" className="section-padding" style={{ backgroundColor: 'var(--color-dark)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '200px', fontFamily: 'var(--font-heading)', color: 'rgba(201,169,110,0.03)', lineHeight: 1 }}>
        "
      </div>

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
              Guest Experiences
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            What Our Guests Say
          </motion.h2>
        </div>

        {/* Featured Review */}
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
              {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                <Star key={i} size={18} fill="var(--color-gold)" color="var(--color-gold)" />
              ))}
            </div>

            {/* Quote */}
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '18px',
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              lineHeight: 1.9,
              marginBottom: '32px'
            }}>
              "{reviews[activeIndex].text}"
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 600
              }}>
                {reviews[activeIndex].initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#fff', fontWeight: 500 }}>
                  {reviews[activeIndex].name}
                </h4>
                <p style={{ color: 'var(--color-gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {reviews[activeIndex].location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: activeIndex === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeIndex === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
