import { Heart, Award, Users, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const numTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
          const duration = 2000;
          const steps = 60;
          const increment = numTarget / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numTarget) {
              current = numTarget;
              clearInterval(timer);
            }
            setCount(current);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = target.includes('.') 
    ? count.toFixed(1)
    : target.includes('+') 
      ? Math.floor(count).toLocaleString() + '+'
      : target.includes('/') 
        ? '24/7'
        : Math.floor(count).toLocaleString();

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="section-label">Our Story</p>
          <h1 className="page-header-title">About Bethel Meadows</h1>
          <div className="divider">
            <span className="divider-diamond" />
          </div>
          <p className="page-header-subtitle">
            A legacy of warm hospitality, classic elegance, and unforgettable experiences.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section-lg">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
            <div>
              <p className="section-label">Est. 2024</p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-4xl)',
                color: 'var(--color-navy)',
                marginBottom: 'var(--space-6)',
                letterSpacing: '-0.02em'
              }}>
                Where Every Stay<br />Tells a Story
              </h2>
              <div className="divider-line" style={{ margin: 'var(--space-4) 0 var(--space-6)' }} />
              <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gray-600)', lineHeight: '1.9', marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
                Bethel Meadows Hotel & Suites was born from a simple yet profound vision — to create 
                a place where guests feel genuinely welcome, where every room tells a story of comfort, 
                and where the warmth of hospitality meets the elegance of design.
              </p>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: '1.8', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                Nestled in the heart of Kerala, our property features beautifully crafted interiors 
                with warm wooden accents, modern amenities, and an atmosphere that invites you to 
                relax and unwind. Each room has been thoughtfully designed with premium furnishings, 
                from the rich wooden headboards to the ambient lighting that creates a cozy retreat.
              </p>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: '1.8', fontSize: 'var(--text-sm)' }}>
                We believe that true hospitality is not just about providing a room — it's about 
                creating moments that become cherished memories. Our dedicated team ensures that 
                every aspect of your stay exceeds expectations.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <img 
                src="/images/rooms/room-bed.jpg" 
                alt="Room Interior" 
                style={{ width: '100%', height: '550px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '180px',
                height: '180px',
                border: '6px solid var(--color-warm-white)',
                overflow: 'hidden'
              }}>
                <img 
                  src="/images/rooms/room-living.jpg" 
                  alt="Living Space" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-lg" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div className="text-center">
            <p className="section-label">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
            <div className="divider">
              <span className="divider-diamond" />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-8)'
          }}>
            {[
              {
                icon: <Heart size={30} />,
                title: 'Warm Hospitality',
                desc: 'We treat every guest like family. Our warm, personalized service ensures you feel at home from the moment you arrive.'
              },
              {
                icon: <Award size={30} />,
                title: 'Excellence in Design',
                desc: 'Every room is a masterpiece of design, blending classic wooden aesthetics with modern functionality and comfort.'
              },
              {
                icon: <Users size={30} />,
                title: 'Guest First',
                desc: 'Your comfort and satisfaction are our top priority. We go above and beyond to make your stay exceptional.'
              },
              {
                icon: <Star size={30} />,
                title: 'Quality & Cleanliness',
                desc: 'We maintain the highest standards of cleanliness and quality in every room, every day, every stay.'
              }
            ].map((v, i) => (
              <div key={i} style={{
                background: 'var(--color-white)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                border: '1px solid var(--color-gray-200)',
                transition: 'all var(--transition-base)',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-gray-200)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '68px', height: '68px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-gold-muted)',
                  color: 'var(--color-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-5)'
                }}>
                  {v.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--color-navy)',
                  marginBottom: 'var(--space-3)'
                }}>
                  {v.title}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-500)',
                  lineHeight: '1.7'
                }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-lg" style={{ background: 'var(--color-navy)', color: 'var(--color-white)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-8)',
            textAlign: 'center'
          }}>
            {[
              { value: '24', label: 'Premium Rooms' },
              { value: '5000+', label: 'Happy Guests' },
              { value: '4.8', label: 'Guest Rating' },
              { value: '24/7', label: 'Service' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 'var(--space-6)',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none'
              }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-5xl)',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  marginBottom: 'var(--space-3)',
                  lineHeight: 1
                }}>
                  <AnimatedCounter target={s.value} />
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  fontWeight: 500
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-lg" style={{ background: 'var(--color-cream)', textAlign: 'center' }}>
        <div className="container">
          <p className="section-label">Experience It Yourself</p>
          <h2 className="section-title">Come Stay With Us</h2>
          <div className="divider">
            <span className="divider-diamond" />
          </div>
          <p className="section-subtitle">
            We'd love to welcome you and show you the Bethel Meadows experience firsthand.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rooms" className="btn btn-secondary btn-lg">
              View Rooms
            </Link>
            <Link to="/booking" className="btn btn-primary btn-lg">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
