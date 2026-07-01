import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

const attractions = [
  { name: 'Thiruvalla Railway Station', distance: '3 km', time: '10 mins', desc: 'Major transit hub connecting to all major cities.', image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80' },
  { name: 'Sabarimala', distance: '85 km', time: '2.5 hrs', desc: 'A prominent Hindu pilgrimage center located in the Periyar Tiger Reserve.', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80' },
  { name: 'Aranmula Parthasarathy Temple', distance: '12 km', time: '25 mins', desc: 'Ancient temple dedicated to Lord Krishna, famous for the Aranmula boat race.', image: 'https://images.unsplash.com/photo-1621847468516-1ed15220c4d5?auto=format&fit=crop&q=80' },
  { name: 'Maramon Convention', distance: '10 km', time: '20 mins', desc: 'One of the largest Christian gatherings in Asia, held on the banks of Pamba.', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80' },
  { name: "Niranam St. Mary's Church", distance: '9 km', time: '18 mins', desc: 'One of the oldest churches in India, believed to be founded by St. Thomas.', image: 'https://images.unsplash.com/photo-1548625361-ec853c02ca32?auto=format&fit=crop&q=80' },
  { name: 'Pamba River', distance: '10 km', time: '20 mins', desc: 'The third longest river in Kerala, known as the Dakshina Ganga.', image: 'https://images.unsplash.com/photo-1623057199589-98308d98d25d?auto=format&fit=crop&q=80' },
  { name: 'Chengannur Railway Station', distance: '14 km', time: '30 mins', desc: 'The Gateway to Sabarimala, a major railway stop.', image: 'https://images.unsplash.com/photo-1534068305047-9759d57a9579?auto=format&fit=crop&q=80' },
  { name: 'Kottayam', distance: '28 km', time: '50 mins', desc: 'The city of letters, lakes, and latex.', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80' }
];

export default function Attractions() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="section-title">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}
          >
            Explore The Region
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Nearby Attractions
          </motion.h2>
        </div>

        <div className="grid grid-cols-4">
          {attractions.map((attr, index) => (
            <motion.div
              key={attr.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="attraction-card"
              style={{
                backgroundColor: 'var(--color-cards)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={attr.image} 
                  alt={attr.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  className="attr-img"
                />
              </div>
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '12px' }}>{attr.name}</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '13px', marginBottom: '16px', minHeight: '40px' }}>{attr.desc}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold)', fontSize: '13px', fontWeight: 600 }}>
                    <MapPin size={14} /> {attr.distance}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-light)', fontSize: '13px' }}>
                    <Navigation size={14} /> {attr.time}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .attraction-card:hover {
          box-shadow: var(--shadow-hover);
        }
        .attraction-card:hover .attr-img {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
