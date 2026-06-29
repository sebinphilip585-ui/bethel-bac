import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Search, User, CalendarCheck, BedDouble } from 'lucide-react';

export default function GlobalSearch() {
  const { bookings, guests, rooms } = useData();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const searchResults = () => {
    if (query.length < 2) return { bookings: [], guests: [], rooms: [] };
    const q = query.toLowerCase();

    return {
      bookings: bookings.filter(b => b.id.toLowerCase().includes(q) || b.guest?.name.toLowerCase().includes(q)),
      guests: guests.filter(g => g.name.toLowerCase().includes(q) || g.email?.toLowerCase().includes(q) || g.phone?.includes(q)),
      rooms: rooms.filter(r => r.room_number.includes(q))
    };
  };

  const results = searchResults();
  const totalResults = results.bookings.length + results.guests.length + results.rooms.length;

  return (
    <div ref={wrapperRef} style={{ flex: 1, maxWidth: '400px', margin: '0 var(--space-8)', position: 'relative' }}>
      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => { if (query.length > 0) setIsOpen(true); }}
        placeholder="Global Search (Guests, Bookings, Rooms)..." 
        style={{
          width: '100%',
          padding: '10px 10px 10px 36px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-gray-200)',
          background: 'var(--color-gray-50)',
          fontSize: 'var(--text-sm)',
          outline: 'none'
        }} 
      />

      {isOpen && query.length >= 2 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
          background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-gray-200)', zIndex: 100, maxHeight: '400px', overflowY: 'auto'
        }}>
          {totalResults === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
              No results found for "{query}"
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Bookings */}
              {results.bookings.length > 0 && (
                <div style={{ padding: 'var(--space-2)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-gray-400)', fontWeight: 700, padding: 'var(--space-2) var(--space-3)' }}>Bookings</div>
                  {results.bookings.slice(0,3).map(b => (
                    <div key={b.id} onClick={() => { setIsOpen(false); navigate('/admin/reservations'); }} style={{ padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', borderRadius: 'var(--radius-md)' }} className="search-result-item">
                      <div style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)', padding: '6px', borderRadius: '6px' }}><CalendarCheck size={14} /></div>
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-navy)' }}>{b.guest?.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>ID: {b.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Guests */}
              {results.guests.length > 0 && (
                <div style={{ padding: 'var(--space-2)', borderTop: '1px solid var(--color-gray-100)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-gray-400)', fontWeight: 700, padding: 'var(--space-2) var(--space-3)' }}>Guests</div>
                  {results.guests.slice(0,3).map(g => (
                    <div key={g.id} onClick={() => { setIsOpen(false); navigate('/admin/guests'); }} style={{ padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', borderRadius: 'var(--radius-md)' }} className="search-result-item">
                      <div style={{ background: 'rgba(201,169,110,0.15)', color: 'var(--color-gold)', padding: '6px', borderRadius: '6px' }}><User size={14} /></div>
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-navy)' }}>{g.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>{g.email} • {g.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rooms */}
              {results.rooms.length > 0 && (
                <div style={{ padding: 'var(--space-2)', borderTop: '1px solid var(--color-gray-100)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-gray-400)', fontWeight: 700, padding: 'var(--space-2) var(--space-3)' }}>Rooms</div>
                  {results.rooms.slice(0,3).map(r => (
                    <div key={r.id} onClick={() => { setIsOpen(false); navigate('/admin/rooms'); }} style={{ padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', borderRadius: 'var(--radius-md)' }} className="search-result-item">
                      <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '6px', borderRadius: '6px' }}><BedDouble size={14} /></div>
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-navy)' }}>Room {r.room_number}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>{r.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <style>{`
        .search-result-item:hover { background: var(--color-gray-50); }
      `}</style>
    </div>
  );
}
