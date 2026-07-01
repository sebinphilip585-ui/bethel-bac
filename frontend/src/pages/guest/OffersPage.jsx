import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SPECIAL_OFFERS } from '../../lib/api';
import { Calendar, ArrowRight, Tag, Copy, Check, Share2, Coffee, Utensils, Flower2 } from 'lucide-react';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState(null);

  function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }

  // Use the first offer for the hero section
  const heroOffer = SPECIAL_OFFERS[0];
  const otherOffers = SPECIAL_OFFERS.slice(1);

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      
      {/* Immersive Hero Section */}
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '70vh',
        minHeight: '500px',
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%), url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 'var(--space-12)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: 'var(--color-white)',
          fontWeight: 300,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)'
        }}>
          <span style={{ height: '1px', width: '60px', backgroundColor: 'var(--color-white)', display: 'inline-block' }}></span>
          CELEBRATING OUR BOND
          <span style={{ height: '1px', width: '60px', backgroundColor: 'var(--color-white)', display: 'inline-block' }}></span>
        </h1>
      </div>

      {/* Breadcrumbs & Share */}
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          padding: 'var(--space-6) 0',
          borderBottom: '1px solid var(--color-gray-200)',
          fontSize: '12px',
          color: 'var(--color-gray-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <div>Home / Offers / Celebrating Our Bond Offer</div>
            <button style={{ 
              background: 'none', border: 'none', color: 'var(--color-gray-600)', 
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              fontSize: '11px', fontWeight: 600, cursor: 'pointer', letterSpacing: '1px'
            }}>
              <Share2 size={12} /> SHARE
            </button>
          </div>
        </div>

        {/* Exclusive Privileges Section */}
        <div style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: '#333333',
            fontWeight: 300,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-6)'
          }}>
            <span style={{ height: '1px', width: '50px', backgroundColor: '#333333', display: 'inline-block' }}></span>
            EXCLUSIVE PRIVILEGES FOR OUR VALUED MEMBERS
            <span style={{ height: '1px', width: '50px', backgroundColor: '#333333', display: 'inline-block' }}></span>
          </h2>
          
          <p style={{ 
            color: 'var(--color-gray-500)', 
            fontSize: '15px', 
            marginBottom: 'var(--space-12)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300
          }}>
            Check in to exceptional stays, indulgent dining and memorable experiences.
          </p>

          {/* Dates layout */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'var(--space-12)',
            marginBottom: 'var(--space-12)'
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-gray-500)', letterSpacing: '1px', marginBottom: 'var(--space-2)' }}>Validity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '15px', fontWeight: 600, color: '#333333' }}>
                <Calendar size={16} color="var(--color-gray-500)" />
                {heroOffer.valid_from} - {heroOffer.valid_to}
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-gray-300)' }}></div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-gray-500)', letterSpacing: '1px', marginBottom: 'var(--space-2)' }}>Stay Dates</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '15px', fontWeight: 600, color: '#333333' }}>
                <Calendar size={16} color="var(--color-gray-500)" />
                {heroOffer.valid_from} - 31 July 2026
              </div>
            </div>
          </div>

          {/* Package Inclusions Box */}
          <div style={{
            border: '1px solid var(--color-gray-200)',
            padding: 'var(--space-12)',
            margin: '0 auto',
            maxWidth: '900px'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '18px',
              fontWeight: 300,
              color: '#333333',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-10)'
            }}>
              Package Inclusions
            </h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              
              {/* Inclusion 1 */}
              <div style={{ flex: 1, padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tag size={28} color="#555555" strokeWidth={1} style={{ marginBottom: 'var(--space-4)' }} />
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#444444',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  letterSpacing: '0.5px'
                }}>
                  ENJOY {heroOffer.discount_percent}% SAVINGS ON<br/>BREAKFAST INCLUSIVE<br/>STAYS
                </p>
              </div>

              <div style={{ width: '1px', height: '80px', backgroundColor: 'var(--color-gray-200)', alignSelf: 'center' }}></div>

              {/* Inclusion 2 */}
              <div style={{ flex: 1, padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Utensils size={28} color="#555555" strokeWidth={1} style={{ marginBottom: 'var(--space-4)' }} />
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#444444',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  letterSpacing: '0.5px'
                }}>
                  DAILY BREAKFAST AT<br/>DESIGNATED DINING<br/>VENUE
                </p>
              </div>

              <div style={{ width: '1px', height: '80px', backgroundColor: 'var(--color-gray-200)', alignSelf: 'center' }}></div>

              {/* Inclusion 3 */}
              <div style={{ flex: 1, padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Flower2 size={28} color="#555555" strokeWidth={1} style={{ marginBottom: 'var(--space-4)' }} />
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#444444',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  letterSpacing: '0.5px'
                }}>
                  20% SAVINGS ON SPA<br/>THERAPIES & SALON<br/>SERVICES
                </p>
              </div>

            </div>
          </div>
          
          {/* CTA & Code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'var(--space-10)', gap: 'var(--space-4)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              Use Promo Code:
              <button
                onClick={() => copyCode(heroOffer.code)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                  background: 'none',
                  border: '1px dashed var(--color-gray-400)',
                  padding: '4px 12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  cursor: 'pointer',
                }}
              >
                {heroOffer.code}
                {copiedCode === heroOffer.code ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
              </button>
            </div>
            
            <Link to={`/booking?promo=${heroOffer.code}`} className="btn" style={{ 
              backgroundColor: '#A88C51', // Gold from Taj
              color: 'white',
              borderRadius: '0',
              padding: '12px 32px',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '14px'
            }}>
              BOOK A STAY
            </Link>
          </div>
        </div>

        {/* Other Offers Section (Optional, keeping the rest clean) */}
        {otherOffers.length > 0 && (
          <div style={{ marginTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 300,
              color: '#333333',
              letterSpacing: '1px',
              marginBottom: 'var(--space-8)',
              textAlign: 'center'
            }}>
              MORE EXCLUSIVE OFFERS
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 'var(--space-8)'
            }}>
              {otherOffers.map((offer, i) => (
                <div key={offer.id} className="offer-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="offer-card-header">
                    <div className="offer-card-discount">{offer.discount_percent}%</div>
                    <div className="offer-card-discount-label">Discount</div>
                  </div>
                  <div className="offer-card-body">
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-xl)',
                      color: 'var(--color-navy)',
                      marginBottom: 'var(--space-3)',
                      fontWeight: 300
                    }}>
                      {offer.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-gray-500)',
                      lineHeight: '1.6',
                      marginBottom: 'var(--space-6)'
                    }}>
                      {offer.description}
                    </p>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
                      marginBottom: 'var(--space-6)', fontSize: '13px', color: 'var(--color-gray-600)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Tag size={12} color="#A88C51" />
                        <span>Code: <strong>{offer.code}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Calendar size={12} color="#A88C51" />
                        <span>Valid: {offer.valid_from} to {offer.valid_to}</span>
                      </div>
                    </div>
                    <Link to="/booking" className="btn btn-outline" style={{ width: '100%', borderRadius: '0' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
