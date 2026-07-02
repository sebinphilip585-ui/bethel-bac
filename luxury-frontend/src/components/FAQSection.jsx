import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What types of apartments are available at Bethel Meadows?',
    a: 'We offer premium 1 BHK, 2 BHK, and 3 BHK fully furnished serviced apartments. Each apartment comes with air conditioning, equipped kitchen, smart TV, high-speed Wi-Fi, attached bathroom, and all modern amenities.'
  },
  {
    q: 'What are the check-in and check-out times?',
    a: 'Standard check-in time is 2:00 PM and check-out is 12:00 PM (noon). Early check-in and late check-out are subject to availability and may incur additional charges.'
  },
  {
    q: 'Is parking available?',
    a: 'Yes, we provide free parking for all our guests at M Square Mall. The parking area is well-lit and under CCTV surveillance for your safety.'
  },
  {
    q: 'Do you offer long-stay discounts?',
    a: 'Yes! We offer special rates for extended stays of 7 nights or more. Please contact us directly for long-stay pricing and special corporate packages.'
  },
  {
    q: 'Is Bethel Meadows suitable for families with children?',
    a: 'Absolutely! Our apartments are designed to be family-friendly with spacious living areas, equipped kitchens for home-cooked meals, and a safe, secure environment for children.'
  },
  {
    q: 'How far is Bethel Meadows from Sabarimala?',
    a: 'Bethel Meadows is approximately 85 km from Sabarimala (about 2.5 hours drive). We are conveniently located near Thiruvalla Railway Station (3 km) and offer a comfortable base for pilgrims.'
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Free cancellation is available up to 48 hours before check-in. Cancellations within 48 hours may be subject to a one-night charge. No-shows will be charged the full booking amount.'
  },
  {
    q: 'How do I make a payment?',
    a: 'Payment can be made at the property during check-in. We accept cash, UPI, debit cards, and credit cards. Online booking confirmation is free with no advance payment required.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}
          >
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
            <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '11px', fontWeight: 600 }}>
              Common Questions
            </span>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{
                border: '1px solid',
                borderColor: openIndex === i ? 'var(--color-gold-border)' : 'var(--color-border-light)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                transition: 'var(--transition-smooth)',
                background: openIndex === i ? 'var(--color-cards)' : 'transparent'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '20px 24px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                aria-expanded={openIndex === i}
              >
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '17px',
                  fontWeight: 500,
                  color: openIndex === i ? 'var(--color-gold)' : 'var(--color-text)',
                  transition: 'var(--transition-smooth)'
                }}>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flexShrink: 0 }}
                >
                  <ChevronDown size={18} color={openIndex === i ? 'var(--color-gold)' : 'var(--color-text-light)'} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{
                      padding: '0 24px 20px',
                      color: 'var(--color-text-light)',
                      fontSize: '15px',
                      lineHeight: 1.8,
                      borderTop: '1px solid var(--color-border-light)',
                      paddingTop: '16px',
                      marginTop: '0'
                    }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
