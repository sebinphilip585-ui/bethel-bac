import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { Search, MapPin, Calendar, Clock, User, CreditCard, Info } from 'lucide-react';

export default function GuestPanel() {
  const { bookings } = useData();
  const [bookingId, setBookingId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    setError('');
    
    // Attempt to find booking
    // Note: In a real environment, we'd fetch from an API endpoint accessible to guests.
    // Since this is a demo, we rely on the context which might not have ALL bookings if not admin,
    // but we can assume for demo purposes it works or we'd fetch directly via API.
    const found = bookings.find(b => b.id.toLowerCase() === bookingId.toLowerCase());
    
    if (found) {
      setResult(found);
    } else {
      setResult(null);
      setError('Booking not found. Please check your Booking ID.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '60px 20px', background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Guest Portal
          </h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Enter your Booking ID to view real-time reservation details and status.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="e.g. BKG-123456" 
            value={bookingId}
            onChange={e => setBookingId(e.target.value)}
            className="form-input"
            style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', fontSize: '16px', border: '1px solid var(--color-gray-300)' }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} /> Find
          </button>
        </form>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {result && (
          <div className="card animate-fade-in-up" style={{ padding: '32px', borderRadius: '16px', borderTop: '4px solid var(--color-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '4px' }}>Reservation Details</h2>
                <div style={{ fontFamily: 'monospace', color: 'var(--color-gray-500)', fontSize: '14px' }}>ID: {result.id}</div>
              </div>
              <span className="badge" style={{ 
                background: result.status === 'checked_in' ? '#dcfce7' : result.status === 'confirmed' ? '#e0f2fe' : '#f3f4f6',
                color: result.status === 'checked_in' ? '#16a34a' : result.status === 'confirmed' ? '#0284c7' : '#4b5563',
                fontSize: '12px', padding: '6px 12px', textTransform: 'uppercase'
              }}>
                {result.status.replace('_', ' ')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Guest Name</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><User size={16} color="var(--color-gold)"/> {result.guest?.name || 'Guest'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Room</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><MapPin size={16} color="var(--color-gold)"/> {result.roomType || result.room?.room_type?.name}</div>
              </div>
            </div>

            <div style={{ background: 'var(--color-gray-50)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Scheduled Check-in</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><Calendar size={16} color="var(--color-navy)"/> {format(new Date(result.check_in), 'dd MMM yyyy')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Scheduled Check-out</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><Calendar size={16} color="var(--color-navy)"/> {format(new Date(result.check_out), 'dd MMM yyyy')}</div>
                </div>
              </div>
            </div>

            {/* Real-time System Timestamps requested by User */}
            <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> Automated System Logs
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: result.actual_check_in ? '#22c55e' : 'var(--color-gray-300)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Actual Check-In Time</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                      {result.actual_check_in ? format(new Date(result.actual_check_in), 'dd MMM yyyy, hh:mm:ss a') : 'Awaiting check-in'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: result.actual_check_out ? '#3b82f6' : 'var(--color-gray-300)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Actual Check-Out Time</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                      {result.actual_check_out ? format(new Date(result.actual_check_out), 'dd MMM yyyy, hh:mm:ss a') : 'Awaiting check-out'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '24px', marginTop: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} /> Financial Overview
              </h3>
              <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-gray-600)' }}>Total Booking Amount</span>
                  <span style={{ fontWeight: 600 }}>₹{result.total_amount?.toLocaleString() || '0'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-gray-600)' }}>Amount Paid</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>₹{result.amount_paid?.toLocaleString() || '0'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed var(--color-gray-200)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-gray-600)' }}>Balance Due</span>
                  <span style={{ fontWeight: 700, color: result.total_amount - (result.amount_paid || 0) > 0 ? '#ef4444' : '#10b981' }}>
                    ₹{Math.max(0, result.total_amount - (result.amount_paid || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {result.special_requests && (
              <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '24px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} /> Special Requests
                </h3>
                <div style={{ background: '#fffbeb', color: '#b45309', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontStyle: 'italic' }}>
                  "{result.special_requests}"
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
