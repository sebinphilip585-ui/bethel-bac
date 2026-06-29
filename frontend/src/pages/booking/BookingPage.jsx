import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROOM_TYPES, ROOMS, calculateDynamicPrice } from '../../lib/api';
import { useData } from '../../contexts/DataContext';
import { format, differenceInDays, addDays } from 'date-fns';
import {
  Calendar, Users, Search, ChevronRight, ChevronLeft,
  Check, Star, Wifi, Wind, Tv, ArrowRight, CreditCard, QrCode, ShieldCheck, Loader2
} from 'lucide-react';

const STEPS = ['Search', 'Select Room', 'Guest Details', 'Confirm'];

export default function BookingPage() {
  const { createBooking, isRoomTypeAvailable, specialOffers } = useData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    guests: parseInt(searchParams.get('guests')) || 2,
    selectedRoom: null,
    selectedRoomType: searchParams.get('room') ? ROOM_TYPES.find(rt => rt.id === searchParams.get('room')) : null,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestIdType: 'Aadhaar',
    guestIdNumber: '',
    specialRequests: '',
    promoCode: '',
    discountPercent: 0
  });

  const [paymentMethod, setPaymentMethod] = useState('hotel'); // 'hotel' or 'online'
  const [onlineProvider, setOnlineProvider] = useState('upi'); // 'upi' or 'card'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const nights = booking.checkIn && booking.checkOut
    ? differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))
    : 0;

  // Auto advance if room preselected
  useEffect(() => {
    if (booking.selectedRoomType && booking.checkIn && booking.checkOut) {
      setStep(1);
    }
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (nights <= 0) return alert('Check-out must be after check-in');
    setStep(1);
  }

  function selectRoom(roomType) {
    setBooking(prev => ({ ...prev, selectedRoomType: roomType }));
    setStep(2);
  }

  function handleGuestSubmit(e) {
    e.preventDefault();
    if (!booking.guestIdNumber.trim()) {
      alert("ID Number is mandatory.");
      return;
    }
    setStep(3);
  }

  function applyPromoCode() {
    const offer = specialOffers.find(o => o.code.toUpperCase() === booking.promoCode.toUpperCase());
    if (offer) {
      setBooking(prev => ({ ...prev, discountPercent: offer.discount_percent }));
      alert(`Promo code applied: ${offer.discount_percent}% off!`);
    } else {
      setBooking(prev => ({ ...prev, discountPercent: 0 }));
      alert('Invalid or expired promo code.');
    }
  }

  function confirmBooking() {
    if (paymentMethod === 'online') {
      if (onlineProvider === 'upi') {
        if (!upiId.trim() || !upiId.includes('@')) {
          alert('Please enter a valid UPI ID (e.g., username@bank)');
          return;
        }
      } else {
        if (!cardNumber.trim() || cardNumber.length < 15) {
          alert('Please enter a valid card number');
          return;
        }
        if (!cardName.trim()) {
          alert('Please enter the name on the card');
          return;
        }
        if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
          alert('Please enter expiry date (MM/YY)');
          return;
        }
        if (!cardCvv.trim() || cardCvv.length < 3) {
          alert('Please enter a valid CVV');
          return;
        }
      }

      setIsProcessingPayment(true);
      
      setTimeout(() => {
        setPaymentSuccess(true);
        setTimeout(() => {
          setIsProcessingPayment(false);
          setPaymentSuccess(false);
          executeBookingCreation();
        }, 1200);
      }, 1800);
    } else {
      executeBookingCreation();
    }
  }

  async function executeBookingCreation() {
    try {
      const isOnline = paymentMethod === 'online';
      const reqCheckIn = `${booking.checkIn}T14:00`;
      const reqCheckOut = `${booking.checkOut}T11:00`;
      
      const result = await createBooking({
        roomTypeId: booking.selectedRoomType.id,
        checkIn: reqCheckIn,
        checkOut: reqCheckOut,
        checkInTime: booking.checkInTime,
        checkOutTime: booking.checkOutTime,
        guests: booking.guests,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        guestIdType: booking.guestIdType,
        guestIdNumber: booking.guestIdNumber,
        specialRequests: booking.specialRequests,
        discountPercent: booking.discountPercent,
        amountPaid: isOnline ? totalAmount : 0,
        totalAmount: totalAmount,
        paymentStatus: isOnline ? 'paid' : 'pending',
        paymentMethod: isOnline ? (onlineProvider === 'upi' ? 'UPI' : 'Card') : 'Pay at Hotel',
        paymentSource: isOnline ? (onlineProvider === 'upi' ? `UPI ID: ${upiId}` : `Card ending in ${cardNumber.slice(-4)}`) : 'Hotel Desk'
      });

      navigate('/booking/confirmation', {
        state: {
          bookingId: result.bookingId,
          roomType: booking.selectedRoomType.name,
          checkIn: reqCheckIn,
          checkOut: reqCheckOut,
          checkInTime: booking.checkInTime,
          checkOutTime: booking.checkOutTime,
          nights: result.nights,
          guests: booking.guests,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.guestPhone,
          totalAmount: result.totalAmount,
          pricePerNight: result.pricePerNight,
          paymentStatus: isOnline ? 'paid' : 'pending',
          paymentMethod: isOnline ? (onlineProvider === 'upi' ? 'UPI' : 'Card') : 'Pay at Hotel',
          paymentSource: isOnline ? (onlineProvider === 'upi' ? `UPI ID: ${upiId}` : `Card ending in ${cardNumber.slice(-4)}`) : 'Hotel Desk'
        }
      });
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes('No rooms available')) {
        alert("Sorry, this room was just booked by someone else. Please select another date or room type.");
      } else {
        alert(`Booking failed: ${err.message}. Please check your connection to the server.`);
      }
      setStep(1); // Go back to room selection
    }
  }

  const pricePerNight = booking.selectedRoomType
    ? calculateDynamicPrice(booking.selectedRoomType.base_price, booking.checkIn || today)
    : 0;
  const subtotal = pricePerNight * nights;
  const discountAmount = subtotal * (booking.discountPercent / 100);
  const totalAmount = subtotal - discountAmount;

  return (
    <>
      <div className="page-header" style={{ paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <p className="section-label">Direct Booking</p>
          <h1 className="page-header-title">Book Your Stay</h1>
          <div className="divider" />

          {/* Steps */}
          <div className="booking-steps" style={{ marginTop: 'var(--space-8)', marginBottom: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className={`booking-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
                  <div className="booking-step-number">
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span className="booking-step-label">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`booking-step-line ${i < step ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container" style={{ maxWidth: '960px' }}>

          {/* Step 0: Search */}
          {step === 0 && (
            <div className="animate-fade-in-up">
              <div style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-10)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-gray-200)'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  color: 'var(--color-navy)',
                  marginBottom: 'var(--space-6)'
                }}>
                  When would you like to stay?
                </h2>
                <form onSubmit={handleSearch}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Check-in
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="date"
                          className="form-input"
                          value={booking.checkIn}
                          onChange={e => setBooking(prev => ({ ...prev, checkIn: e.target.value }))}
                          min={today}
                          required
                        />
                        <input
                          type="time"
                          className="form-input"
                          value={booking.checkInTime}
                          onChange={e => setBooking(prev => ({ ...prev, checkInTime: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Check-out
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="date"
                          className="form-input"
                          value={booking.checkOut}
                          onChange={e => setBooking(prev => ({ ...prev, checkOut: e.target.value }))}
                          min={booking.checkIn || today}
                          required
                        />
                        <input
                          type="time"
                          className="form-input"
                          value={booking.checkOutTime}
                          onChange={e => setBooking(prev => ({ ...prev, checkOutTime: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Guests
                      </label>
                      <select
                        className="form-select"
                        value={booking.guests}
                        onChange={e => setBooking(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                    <Search size={18} />
                    Search Available Rooms
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step 1: Select Room */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 'var(--space-6)'
              }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-navy)' }}>
                    Available Rooms
                  </h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-1)' }}>
                    {format(new Date(booking.checkIn), 'MMM dd')} — {format(new Date(booking.checkOut), 'MMM dd, yyyy')} · {nights} night{nights > 1 ? 's' : ''} · {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </p>
                </div>
                <button onClick={() => setStep(0)} className="btn btn-ghost btn-sm">
                  <ChevronLeft size={16} /> Change Dates
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {ROOM_TYPES.filter(rt => rt.max_guests >= booking.guests).map(rt => {
                  const isAvailable = booking.checkIn && booking.checkOut
                    ? isRoomTypeAvailable(rt.id, booking.checkIn, booking.checkOut)
                    : true;
                  const dynamicPrice = calculateDynamicPrice(rt.base_price, booking.checkIn);
                  const total = dynamicPrice * nights;
                  return (
                    <div key={rt.id} style={{
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      display: 'grid',
                      gridTemplateColumns: '300px 1fr',
                      border: booking.selectedRoomType?.id === rt.id ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-200)',
                      opacity: isAvailable ? 1 : 0.75
                    }}>
                      <img src={rt.images[0]} alt={rt.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '220px' }} />
                      <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              {rt.name}
                              {!isAvailable && (
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  color: 'var(--color-error)',
                                  background: 'var(--color-error-bg)',
                                  border: '1px solid var(--color-error)',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Fully Booked
                                </span>
                              )}
                            </h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                              {rt.bed_type} · {rt.size_sqft} sqft · Up to {rt.max_guests} guests
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-navy)' }}>
                              ₹{dynamicPrice.toLocaleString()}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>per night</div>
                          </div>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-3)', lineHeight: '1.6' }}>
                          {rt.short_description}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                          {rt.facilities.slice(0, 5).map(f => (
                            <span key={f} style={{
                              padding: '2px 8px', background: 'var(--color-cream)',
                              borderRadius: 'var(--radius-full)', fontSize: '11px', color: 'var(--color-brown)'
                            }}>{f}</span>
                          ))}
                        </div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)',
                          borderTop: '1px solid var(--color-gray-200)'
                        }}>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                            {isAvailable ? (
                              <>Total: <strong style={{ fontSize: 'var(--text-lg)', color: 'var(--color-navy)' }}>₹{total.toLocaleString()}</strong> for {nights} night{nights > 1 ? 's' : ''}</>
                            ) : (
                              <span style={{ color: 'var(--color-error)', fontWeight: 500 }}>No rooms available for these dates</span>
                            )}
                          </div>
                          <button
                            onClick={() => selectRoom(rt)}
                            className="btn btn-primary"
                            disabled={!isAvailable}
                            style={!isAvailable ? { background: 'var(--color-gray-300)', color: 'var(--color-gray-500)', cursor: 'not-allowed' } : {}}
                          >
                            {isAvailable ? <>Select <ArrowRight size={16} /></> : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Guest Details */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 'var(--space-6)'
              }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-navy)' }}>
                  Guest Details
                </h2>
                <button onClick={() => setStep(1)} className="btn btn-ghost btn-sm">
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
                <div style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-gray-200)'
                }}>
                  <form onSubmit={handleGuestSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Full Name *</label>
                        <input
                          className="form-input"
                          value={booking.guestName}
                          onChange={e => setBooking(prev => ({ ...prev, guestName: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-input"
                          value={booking.guestEmail}
                          onChange={e => setBooking(prev => ({ ...prev, guestEmail: e.target.value }))}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          className="form-input"
                          value={booking.guestPhone}
                          onChange={e => setBooking(prev => ({ ...prev, guestPhone: e.target.value }))}
                          placeholder="e.g. 9876543210"
                          pattern="[6-9][0-9]{9}"
                          title="Please enter a valid 10-digit Indian phone number starting with 6-9."
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ID Type</label>
                        <select
                          className="form-select"
                          value={booking.guestIdType}
                          onChange={e => setBooking(prev => ({ ...prev, guestIdType: e.target.value }))}
                        >
                          <option>Aadhaar</option>
                          <option>Passport</option>
                          <option>Driving License</option>
                          <option>Voter ID</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">ID Number *</label>
                        <input
                          className="form-input"
                          value={booking.guestIdNumber}
                          onChange={e => setBooking(prev => ({ ...prev, guestIdNumber: e.target.value }))}
                          placeholder="Enter ID number"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Special Requests</label>
                        <textarea
                          className="form-input"
                          value={booking.specialRequests}
                          onChange={e => setBooking(prev => ({ ...prev, specialRequests: e.target.value }))}
                          placeholder="Any special requests for your stay..."
                          style={{ minHeight: '80px' }}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      Continue to Confirmation <ArrowRight size={18} />
                    </button>
                  </form>
                </div>

                {/* Booking Summary Sidebar */}
                <div style={{
                  background: 'var(--color-cream)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  alignSelf: 'start',
                  position: 'sticky',
                  top: '100px'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-navy)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Booking Summary
                  </h3>
                  <img
                    src={booking.selectedRoomType?.images[0]}
                    alt={booking.selectedRoomType?.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}
                  />
                  <div style={{ fontSize: 'var(--text-sm)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 'var(--space-3)' }}>
                      {booking.selectedRoomType?.name}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gray-600)' }}>
                      <span>Check-in</span>
                      <span style={{ fontWeight: 500 }}>{booking.checkIn ? format(new Date(booking.checkIn), 'MMM dd, yyyy') : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gray-600)' }}>
                      <span>Check-out</span>
                      <span style={{ fontWeight: 500 }}>{booking.checkOut ? format(new Date(booking.checkOut), 'MMM dd, yyyy') : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gray-600)' }}>
                      <span>Nights</span>
                      <span style={{ fontWeight: 500 }}>{nights}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gray-600)' }}>
                      <span>Guests</span>
                      <span style={{ fontWeight: 500 }}>{booking.guests}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gray-600)' }}>
                      <span>Rate/Night</span>
                      <span style={{ fontWeight: 500 }}>₹{pricePerNight.toLocaleString()}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: 'var(--space-3) 0', marginTop: 'var(--space-2)',
                      borderTop: '2px solid var(--color-gold)',
                      fontWeight: 700, color: 'var(--color-navy)', fontSize: 'var(--text-lg)'
                    }}>
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 'var(--space-6)'
              }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-navy)' }}>
                  Review & Confirm
                </h2>
                <button onClick={() => setStep(2)} className="btn btn-ghost btn-sm">
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              <div style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-gray-200)',
                position: 'relative'
              }}>
                {/* Room Info */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-6)',
                  marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)',
                  borderBottom: '1px solid var(--color-gray-200)'
                }}>
                  <img
                    src={booking.selectedRoomType?.images[0]}
                    alt={booking.selectedRoomType?.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
                      {booking.selectedRoomType?.name}
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                      {booking.selectedRoomType?.bed_type} · {booking.selectedRoomType?.size_sqft} sqft
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                      <span>{format(new Date(booking.checkIn), 'MMM dd')} → {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</span>
                      <span>·</span>
                      <span>{nights} night{nights > 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Guest Info */}
                <div style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-gray-200)' }}>
                  <h4 style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 'var(--space-3)' }}>Guest Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                    <div><span style={{ color: 'var(--color-gray-500)' }}>Name:</span> <strong>{booking.guestName}</strong></div>
                    <div><span style={{ color: 'var(--color-gray-500)' }}>Email:</span> <strong>{booking.guestEmail}</strong></div>
                    <div><span style={{ color: 'var(--color-gray-500)' }}>Phone:</span> <strong>{booking.guestPhone}</strong></div>
                    <div><span style={{ color: 'var(--color-gray-500)' }}>ID:</span> <strong>{booking.guestIdType} - {booking.guestIdNumber || 'Not provided'}</strong></div>
                  </div>
                </div>

                {/* Promo Code & Price Breakdown */}
                <div style={{ marginBottom: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-8)' }}>
                  
                  {/* Promo Code */}
                  <div style={{ background: 'var(--color-cream)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 'var(--space-3)' }}>Have a Promo Code?</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Enter code" 
                        value={booking.promoCode}
                        onChange={e => setBooking(prev => ({ ...prev, promoCode: e.target.value }))}
                        style={{ textTransform: 'uppercase' }}
                      />
                      <button type="button" onClick={applyPromoCode} className="btn btn-primary">Apply</button>
                    </div>
                    {booking.discountPercent > 0 && (
                      <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-success)' }}>
                        ✓ {booking.discountPercent}% discount applied
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h4 style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 'var(--space-3)' }}>Price Details</h4>
                    <div style={{ fontSize: 'var(--text-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gray-600)' }}>
                        <span>₹{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      
                      {booking.discountPercent > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', color: 'var(--color-gold-dark)' }}>
                          <span>Promo Discount ({booking.discountPercent}%)</span>
                          <span>- ₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: 'var(--space-3) 0', marginTop: 'var(--space-2)',
                        borderTop: '2px solid var(--color-gold)',
                        fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-navy)'
                      }}>
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Selection Section */}
                <div style={{ marginBottom: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-gray-200)' }}>
                  <h4 style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>Select Payment Method</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    {/* Option 1: Pay at Hotel */}
                    <div 
                      onClick={() => setPaymentMethod('hotel')}
                      style={{
                        border: paymentMethod === 'hotel' ? '2.5px solid var(--color-gold)' : '1px solid var(--color-gray-200)',
                        background: paymentMethod === 'hotel' ? 'rgba(197, 164, 109, 0.05)' : 'var(--color-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🏨 Pay at Hotel
                        </span>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: '2px solid var(--color-gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {paymentMethod === 'hotel' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-gold)' }} />}
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: '1.5' }}>
                        No online payment required now. Pay during check-in using Cash, Card, or UPI.
                      </p>
                    </div>

                    {/* Option 2: Online Payment */}
                    <div 
                      onClick={() => setPaymentMethod('online')}
                      style={{
                        border: paymentMethod === 'online' ? '2.5px solid var(--color-gold)' : '1px solid var(--color-gray-200)',
                        background: paymentMethod === 'online' ? 'rgba(197, 164, 109, 0.05)' : 'var(--color-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          💳 Pay Online Now
                        </span>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: '2px solid var(--color-gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {paymentMethod === 'online' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-gold)' }} />}
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: '1.5' }}>
                        Pay immediately online with UPI or Card. Instant booking validation.
                      </p>
                    </div>
                  </div>

                  {/* Online Payment Details Form */}
                  {paymentMethod === 'online' && (
                    <div style={{
                      border: '1px solid var(--color-gold-light)',
                      background: 'var(--color-warm-white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-6)',
                      marginBottom: 'var(--space-6)',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      {/* Sub-tab selection */}
                      <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                        <button
                          type="button"
                          onClick={() => setOnlineProvider('upi')}
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: onlineProvider === 'upi' ? 'var(--color-gold-dark)' : 'var(--color-gray-400)',
                            borderBottom: onlineProvider === 'upi' ? '2px solid var(--color-gold-dark)' : 'none',
                            paddingBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <QrCode size={16} /> UPI Option
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineProvider('card')}
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: onlineProvider === 'card' ? 'var(--color-gold-dark)' : 'var(--color-gray-400)',
                            borderBottom: onlineProvider === 'card' ? '2px solid var(--color-gold-dark)' : 'none',
                            paddingBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <CreditCard size={16} /> Credit/Debit Card
                        </button>
                      </div>

                      {/* Provider 1: UPI Form */}
                      {onlineProvider === 'upi' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 'var(--space-6)', alignItems: 'center' }}>
                          {/* QR Code Graphic */}
                          <div style={{
                            background: 'var(--color-white)',
                            border: '1px solid var(--color-gray-200)',
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            {/* SVG Mock QR Code */}
                            <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100" height="100" rx="6" fill="#f8f5f0"/>
                              <rect x="8" y="8" width="24" height="24" rx="2" stroke="var(--color-navy)" strokeWidth="4" fill="none"/>
                              <rect x="14" y="14" width="12" height="12" fill="var(--color-navy)"/>
                              <rect x="68" y="8" width="24" height="24" rx="2" stroke="var(--color-navy)" strokeWidth="4" fill="none"/>
                              <rect x="74" y="14" width="12" height="12" fill="var(--color-navy)"/>
                              <rect x="8" y="68" width="24" height="24" rx="2" stroke="var(--color-navy)" strokeWidth="4" fill="none"/>
                              <rect x="14" y="74" width="12" height="12" fill="var(--color-navy)"/>
                              <rect x="42" y="14" width="8" height="8" fill="var(--color-gold)"/>
                              <rect x="54" y="8" width="8" height="8" fill="var(--color-navy)"/>
                              <rect x="42" y="26" width="16" height="8" fill="var(--color-navy)"/>
                              <rect x="8" y="42" width="16" height="8" fill="var(--color-gold)"/>
                              <rect x="28" y="42" width="8" height="16" fill="var(--color-navy)"/>
                              <rect x="42" y="42" width="12" height="12" fill="var(--color-navy)"/>
                              <rect x="58" y="42" width="8" height="8" fill="var(--color-gold)"/>
                              <rect x="68" y="42" width="16" height="8" fill="var(--color-navy)"/>
                              <rect x="80" y="54" width="12" height="12" fill="var(--color-gold)"/>
                              <rect x="42" y="58" width="12" height="12" fill="var(--color-gold)"/>
                              <rect x="68" y="68" width="8" height="8" fill="var(--color-navy)"/>
                              <rect x="58" y="74" width="8" height="18" fill="var(--color-navy)"/>
                              <rect x="74" y="80" width="18" height="8" fill="var(--color-gold)"/>
                            </svg>
                            <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', fontWeight: 600 }}>SCAN TO PAY</span>
                          </div>

                          {/* UPI Input fields */}
                          <div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ marginBottom: '4px' }}>Enter UPI ID *</label>
                              <input 
                                type="text"
                                className="form-input"
                                placeholder="username@bank / mobile@upi"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                style={{ textTransform: 'lowercase' }}
                              />
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--color-gray-500)', lineHeight: '1.4', marginTop: 'var(--space-3)', marginBottom: 0 }}>
                              🔒 <strong>Secure UPI Transaction:</strong> Simply scan the QR code with your BHIM, Google Pay, PhonePe, or Paytm app, or enter your UPI ID above to verify and complete the booking immediately.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Provider 2: Card Form */}
                      {onlineProvider === 'card' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', animation: 'fadeIn 0.2s ease' }}>
                          <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 'var(--space-3)' }}>
                            <label className="form-label">Name on Card *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="John Doe"
                              value={cardName}
                              onChange={e => setCardName(e.target.value)}
                            />
                          </div>
                          <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 'var(--space-3)' }}>
                            <label className="form-label">Card Number *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="4111 2222 3333 4444"
                              maxLength="19"
                              value={cardNumber}
                              onChange={e => {
                                const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                const matches = val.match(/\d{4,16}/g);
                                const match = (matches && matches[0]) || '';
                                const parts = [];
                                for (let i=0, len=match.length; i<len; i+=4) {
                                  parts.push(match.substring(i, i+4));
                                }
                                if (parts.length > 0) {
                                  setCardNumber(parts.join(' '));
                                } else {
                                  setCardNumber(val);
                                }
                              }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Expiry Date *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="MM/YY"
                              maxLength="5"
                              value={cardExpiry}
                              onChange={e => {
                                let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                if (val.length >= 2) {
                                  val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                }
                                setCardExpiry(val);
                              }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">CVV *</label>
                            <input 
                              type="password" 
                              className="form-input" 
                              placeholder="123"
                              maxLength="3"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Button */}
                <button 
                  onClick={confirmBooking} 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Check size={18} />
                  {paymentMethod === 'online' ? `Pay ₹${totalAmount.toLocaleString()} & Confirm` : 'Confirm Booking (Pay at Hotel)'}
                </button>

                {/* Loading/Success Overlay */}
                {isProcessingPayment && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255, 255, 255, 0.96)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-xl)',
                    backdropFilter: 'blur(2px)'
                  }}>
                    {paymentSuccess ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto var(--space-4)', border: '2px solid var(--color-success)' }}>✓</div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-navy)', fontWeight: 700 }}>Payment Successful!</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '4px' }}>Confirming your reservation...</p>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-gold)', margin: '0 auto var(--space-4)' }} />
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--color-navy)', fontWeight: 600 }}>Processing Secure Payment</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '4px' }}>Please do not close or refresh this page.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
