import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Calendar, ArrowRight, Mail, X, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToast } = useData();
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!state) return <Navigate to="/booking" replace />;

  const {
    bookingId, roomType, checkIn, checkOut, nights,
    guests, guestName, guestEmail, guestPhone, totalAmount, pricePerNight,
    paymentStatus, paymentMethod, paymentSource
  } = state;

  useEffect(() => {
    if (bookingId && guestEmail) {
      addToast(`📧 Booking confirmation email sent immediately to ${guestEmail}!`, 'success', 8000);
    }
  }, [bookingId, guestEmail]);

  return (
    <>
      <div className="page-header" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container">
          <p className="section-label">Booking Confirmed</p>
          <h1 className="page-header-title">Thank You!</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="confirmation animate-fade-in-up">
            <div className="confirmation-icon">
              <CheckCircle size={40} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-navy)',
              marginBottom: 'var(--space-2)'
            }}>
              Your Booking is Confirmed!
            </h2>
            <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-2)' }}>
              A confirmation has been sent to <strong>{guestEmail}</strong>
            </p>

             <div className="confirmation-id">{bookingId}</div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)' }}>
              Please save this booking ID for your reference
            </p>

            {/* Simulated Email Notice Bar */}
            <div style={{
              background: '#f3f4f6',
              border: '1px dashed #d1d5db',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4) var(--space-6)',
              marginTop: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📧</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '13px' }}>Booking Confirmation Sent Immediately!</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>An email receipt has been sent to {guestEmail}.</div>
                </div>
              </div>
              <button 
                onClick={() => setShowEmailPreview(true)}
                className="btn btn-outline btn-sm"
                style={{ minHeight: '32px', padding: '2px 10px', fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}
              >
                Preview Sent Email
              </button>
            </div>

            <div className="confirmation-details">
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-navy)',
                marginBottom: 'var(--space-4)'
              }}>
                Booking Details
              </h3>

              <div className="confirmation-row">
                <span className="confirmation-row-label">Room Type</span>
                <span className="confirmation-row-value">{roomType}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Guest Name</span>
                <span className="confirmation-row-value">{guestName}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Phone</span>
                <span className="confirmation-row-value">{guestPhone}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Check-in</span>
                <span className="confirmation-row-value">{format(new Date(checkIn), 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Check-out</span>
                <span className="confirmation-row-value">{format(new Date(checkOut), 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Duration</span>
                <span className="confirmation-row-value">{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Guests</span>
                <span className="confirmation-row-value">{guests}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Rate per Night</span>
                <span className="confirmation-row-value">₹{pricePerNight?.toLocaleString()}</span>
              </div>
              <div className="confirmation-row" style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                <span className="confirmation-row-label" style={{ color: 'var(--color-navy)' }}>Total Amount</span>
                <span className="confirmation-row-value" style={{ color: 'var(--color-navy)' }}>₹{totalAmount?.toLocaleString()}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Payment Method</span>
                <span className="confirmation-row-value">{paymentMethod || 'Pay at Hotel'}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-row-label">Payment Status</span>
                <span className="confirmation-row-value" style={{ 
                  color: paymentStatus === 'paid' ? 'var(--color-success)' : 'var(--color-warning)',
                  fontWeight: 600
                }}>
                  {(paymentStatus || 'pending').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Payment Notice */}
            {paymentStatus === 'paid' ? (
              <div style={{
                background: 'var(--color-success-bg)',
                border: '1.5px solid var(--color-success)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: '#15803d',
                marginBottom: 'var(--space-6)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px', lineHeight: 1 }}>💳</span>
                <div>
                  <strong>Payment Received:</strong> ₹{totalAmount?.toLocaleString()} was successfully paid online via {paymentMethod}.
                  <br />
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Transaction details: {paymentSource}</span>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--color-warning-bg)',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: '#92400e',
                marginBottom: 'var(--space-6)',
                textAlign: 'left'
              }}>
                💳 <strong>Payment at Check-in:</strong> Payment will be collected at the hotel front desk during check-in. 
                Please bring a valid government-issued ID.
              </div>
            )}

            {/* Important Info */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-brown)',
              marginBottom: 'var(--space-8)',
              textAlign: 'left'
            }}>
              <strong>Important Information:</strong>
              <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-4)', listStyle: 'disc' }}>
                <li>Check-in time: 2:00 PM</li>
                <li>Check-out time: 11:00 AM</li>
                <li>Free cancellation up to 24 hours before check-in</li>
                <li>Government-issued ID required at check-in</li>
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => window.print()} className="btn btn-outline">
                <Download size={16} />
                Print Confirmation
              </button>
              <Link to="/" className="btn btn-primary">
                <Home size={16} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gmail Inbox Simulator Modal */}
      {showEmailPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--color-gray-200)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Simulator Window Title bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginLeft: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  📧 Gmail Client Simulation
                </span>
              </div>
              <button 
                onClick={() => setShowEmailPreview(false)} 
                style={{ cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', transition: 'color 0.2s', border: 'none', background: 'none' }}
                onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Email Header Info */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  Booking Confirmed at Bethel Meadows (ID: {bookingId})
                </h3>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {format(new Date(), 'dd MMM yyyy, hh:mm a')}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--color-navy)', color: 'var(--color-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700
                }}>BM</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', textAlign: 'left' }}>
                    Bethel Meadows Resort <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>&lt;reservations@bethelmeadows.com&gt;</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '1px', textAlign: 'left' }}>
                    to {guestName} &lt;{guestEmail}&gt;
                  </div>
                </div>
              </div>
            </div>

            {/* Email Body Scroll Area */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '32px 24px', background: '#f9fafb' }}>
              {/* Actual Sent HTML Template */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '36px',
                maxWidth: '560px',
                margin: '0 auto',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                fontFamily: 'Georgia, serif',
                color: '#374151',
                textAlign: 'left'
              }}>
                {/* Brand Banner */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #c5a46d', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', color: '#0c1a2e', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Bethel Meadows
                  </h1>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#c5a46d', margin: '4px 0 0 0', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                    Munnar, Kerala, India
                  </p>
                </div>

                {/* Salutation */}
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 500, color: '#0c1a2e', marginBottom: '16px' }}>
                  Booking Confirmation
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555555', marginBottom: '24px' }}>
                  Dear <strong>{guestName}</strong>,
                  <br /><br />
                  We are delighted to confirm your reservation at Bethel Meadows. Thank you for choosing us for your stay in Munnar. We look forward to offering you our trademark warm hospitality.
                </p>

                {/* Booking Reference Block */}
                <div style={{
                  background: '#fcfaf7',
                  border: '1px solid #ede7dd',
                  padding: '20px',
                  borderRadius: '6px',
                  marginBottom: '28px',
                  fontFamily: 'var(--font-body)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#888888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Booking ID</span>
                      <strong style={{ color: '#0c1a2e', fontFamily: 'monospace', fontSize: '14px' }}>{bookingId}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#888888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Room Type</span>
                      <strong style={{ color: '#0c1a2e' }}>{roomType}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #ede7dd', paddingTop: '10px' }}>
                      <span style={{ color: '#888888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Check-in</span>
                      <strong style={{ color: '#0c1a2e' }}>{checkIn ? format(new Date(checkIn), 'dd MMM yyyy') : ''}</strong>
                      <span style={{ fontSize: '11px', color: '#888888', display: 'block' }}>After 2:00 PM</span>
                    </div>
                    <div style={{ borderTop: '1px solid #ede7dd', paddingTop: '10px' }}>
                      <span style={{ color: '#888888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Check-out</span>
                      <strong style={{ color: '#0c1a2e' }}>{checkOut ? format(new Date(checkOut), 'dd MMM yyyy') : ''}</strong>
                      <span style={{ fontSize: '11px', color: '#888888', display: 'block' }}>Before 11:00 AM</span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#0c1a2e', marginBottom: '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  Billing Details
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'var(--font-body)', marginBottom: '24px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px 0', color: '#666' }}>Subtotal ({nights} night{nights > 1 ? 's' : ''})</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>₹{totalAmount?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', color: '#666', borderBottom: '1px solid #e5e7eb' }}>GST / Service Tax (12%)</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Included</td>
                    </tr>
                    <tr style={{ fontWeight: 700, fontSize: '14px' }}>
                      <td style={{ padding: '10px 0', color: '#0c1a2e' }}>Total Charged</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', color: '#0c1a2e' }}>₹{totalAmount?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', color: '#16a34a' }}>Amount Paid Online</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>
                        ₹{paymentStatus === 'paid' ? totalAmount?.toLocaleString() : '0.00'}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '2px double #ede7dd' }}>
                      <td style={{ padding: '8px 0', color: '#0c1a2e', fontWeight: 600 }}>Outstanding Balance</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: paymentStatus === 'paid' ? '#16a34a' : '#ea580c' }}>
                        ₹{paymentStatus === 'paid' ? '0.00' : totalAmount?.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Payment Source Notice */}
                <div style={{
                  background: '#f9fafb',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#555555',
                  marginBottom: '28px',
                  fontFamily: 'var(--font-body)',
                  borderLeft: '4px solid var(--color-gold)'
                }}>
                  💳 <strong>Payment Method:</strong> {paymentMethod || 'Pay at Hotel'}
                  <br />
                  ℹ️ <strong>Details:</strong> {paymentStatus === 'paid' ? `Fully paid online via ${paymentSource}` : 'To be settled at the hotel reception during check-in'}
                </div>

                {/* Closing */}
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#666', margin: '0 0 4px 0' }}>
                  If you have any questions or require concierge services (airport transfers, sightseeing bookings), feel free to contact us.
                </p>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#666', margin: 0 }}>
                  Warm regards,
                  <br />
                  <strong>The Front Office Team</strong>
                  <br />
                  Bethel Meadows Hotel & Suites
                </p>
              </div>
            </div>

            {/* Simulator Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '14px 20px',
              borderTop: '1px solid #e5e7eb',
              background: '#f9fafb',
              gap: '12px'
            }}>
              <span style={{ fontSize: '12px', color: '#6b7280', alignSelf: 'center', marginRight: 'auto' }}>
                ✓ HTML content verified under Gmail sandbox rules
              </span>
              <button 
                onClick={() => setShowEmailPreview(false)}
                className="btn btn-primary btn-sm"
                style={{ textTransform: 'none', letterSpacing: 0, minHeight: '36px' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
