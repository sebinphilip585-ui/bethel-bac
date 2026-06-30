import { useState } from 'react';
import { useData, parseLocalDate } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { Search, Filter, Plus, Eye, Edit, Trash2, X as XIcon, FileText, CheckCircle, Clock } from 'lucide-react';
import InvoiceModal from '../../components/ui/InvoiceModal';

export default function ReservationList() {
  const { bookings, rooms, roomTypes, createBooking, updateBooking, cancelBooking, checkIn, checkOut } = useData();
  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations', 'paymentStatus', 'paymentDetails', 'reports'
  const [collectPaymentBookingId, setCollectPaymentBookingId] = useState(null);
  const [collectMethod, setCollectMethod] = useState('UPI');
  const [collectSource, setCollectSource] = useState('');
  const [autoCheckInAfterPayment, setAutoCheckInAfterPayment] = useState(false);

  // Early Checkout Admin Verification State
  const [earlyCheckoutBookingId, setEarlyCheckoutBookingId] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Modal states
  const [invoiceBookingId, setInvoiceBookingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editBookingId, setEditBookingId] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestIdType: 'Aadhaar',
    guestIdNumber: '',
    roomTypeId: 'rt-1',
    roomId: '',
    checkIn: '',
    checkInTime: '14:00',
    checkOut: '',
    checkOutTime: '11:00',
    guests: 2,
    specialRequests: '',
    status: 'confirmed',
    totalAmount: '',
    notes: ''
  });

  const filtered = bookings.filter(b => {
    const guestName = b.guest?.name || '';
    const guestEmail = b.guest?.email || '';
    const bookingId = b.id || '';
    const matchesSearch = guestName.toLowerCase().includes(search.toLowerCase()) ||
      guestEmail.toLowerCase().includes(search.toLowerCase()) ||
      bookingId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const checkInDateStr = b.check_in ? format(parseLocalDate(b.check_in), 'yyyy-MM-dd') : '';
    const checkOutDateStr = b.check_out ? format(parseLocalDate(b.check_out), 'yyyy-MM-dd') : '';
    
    let matchesTime = true;
    if (timeFilter === 'today') {
      matchesTime = (checkInDateStr === todayStr) || (b.status === 'checked_in');
    } else if (timeFilter === 'upcoming') {
      matchesTime = checkInDateStr > todayStr && b.status !== 'cancelled' && b.status !== 'checked_out';
    } else if (timeFilter === 'past') {
      matchesTime = checkOutDateStr < todayStr || b.status === 'checked_out' || b.status === 'cancelled';
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  // Calculate pricing when form checkIn/checkOut/roomType changes
  function getCalculatedPrice() {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const rt = roomTypes.find(type => type.id === formData.roomTypeId);
    if (!rt) return 0;
    const nights = Math.max(1, Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)));
    return rt.base_price * nights;
  }

  function handleOpenNew() {
    setEditBookingId(null);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestIdType: 'Aadhaar',
      guestIdNumber: '',
      roomTypeId: roomTypes[0]?.id || 'rt-1',
      roomId: rooms.find(r => r.room_type_id === (roomTypes[0]?.id || 'rt-1') && r.status === 'available')?.id || '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      guests: 2,
      specialRequests: '',
      status: 'confirmed',
      totalAmount: '',
      notes: ''
    });
    setIsFormOpen(true);
  }

  function handleOpenEdit(b) {
    setEditBookingId(b.id);
    const getCheckInStr = b.check_in instanceof Date ? b.check_in.toISOString() : (typeof b.check_in === 'string' ? b.check_in : new Date(b.check_in).toISOString());
    const getCheckOutStr = b.check_out instanceof Date ? b.check_out.toISOString() : (typeof b.check_out === 'string' ? b.check_out : new Date(b.check_out).toISOString());

    setFormData({
      guestName: b.guest.name,
      guestEmail: b.guest.email,
      guestPhone: b.guest.phone,
      guestIdType: b.guest.id_type || 'Aadhaar',
      guestIdNumber: b.guest.id_number || '',
      roomTypeId: b.room?.room_type_id || b.room_type_id || 'rt-1',
      roomId: b.room?.id || b.room_id || '',
      checkIn: getCheckInStr.split('T')[0],
      checkInTime: getCheckInStr.includes('T') ? getCheckInStr.split('T')[1].slice(0, 5) : '14:00',
      checkOut: getCheckOutStr.split('T')[0],
      checkOutTime: getCheckOutStr.includes('T') ? getCheckOutStr.split('T')[1].slice(0, 5) : '11:00',
      guests: b.guests_count || 2,
      specialRequests: b.special_requests || '',
      status: b.status,
      totalAmount: b.total_amount,
      notes: b.notes || ''
    });
    setIsFormOpen(true);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const finalAmount = formData.totalAmount ? parseInt(formData.totalAmount) : getCalculatedPrice();
    const reqCheckIn = `${formData.checkIn}T${formData.checkInTime || '14:00'}`;
    const reqCheckOut = `${formData.checkOut}T${formData.checkOutTime || '11:00'}`;
    const nights = Math.max(1, Math.ceil((new Date(reqCheckOut) - new Date(reqCheckIn)) / (1000 * 60 * 60 * 24)));
    
    try {
      if (editBookingId) {
        // Perform update
        updateBooking(editBookingId, {
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          guestIdType: formData.guestIdType,
          guestIdNumber: formData.guestIdNumber,
          check_in: new Date(reqCheckIn),
          check_out: new Date(reqCheckOut),
          guests_count: parseInt(formData.guests),
          room_id: formData.roomId,
          status: formData.status,
          total_amount: finalAmount,
          nights,
          special_requests: formData.specialRequests,
          notes: formData.notes
        });
        // Sync room status manually if checked_in / checked_out / cancelled changed
        if (formData.status === 'checked_in') {
          checkIn(editBookingId);
        } else if (formData.status === 'checked_out') {
          checkOut(editBookingId, finalAmount);
        } else if (formData.status === 'cancelled') {
          cancelBooking(editBookingId);
        }
      } else {
        // Create new booking
        await createBooking({
          roomTypeId: formData.roomTypeId,
          checkIn: reqCheckIn,
          checkOut: reqCheckOut,
          guests: parseInt(formData.guests),
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          guestIdType: formData.guestIdType,
          guestIdNumber: formData.guestIdNumber,
          specialRequests: formData.specialRequests
        });
      }
      setIsFormOpen(false);
    } catch (err) {
      alert(err.message);
    }
  }

  // Filter available rooms matching selected room type
  const matchingRooms = rooms.filter(r => r.room_type_id === formData.roomTypeId);

  // Calculations for payment status tab
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalInvoiced = activeBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalCollected = activeBookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0);
  const totalPending = Math.max(0, totalInvoiced - totalCollected);

  // Calculations for payment details tab
  const upiTotal = bookings.filter(b => b.status !== 'cancelled' && b.payment_method === 'UPI').reduce((sum, b) => sum + (b.amount_paid || 0), 0);
  const cardTotal = bookings.filter(b => b.status !== 'cancelled' && b.payment_method === 'Card').reduce((sum, b) => sum + (b.amount_paid || 0), 0);
  const cashTotal = bookings.filter(b => b.status !== 'cancelled' && (b.payment_method === 'Cash' || b.payment_method === 'Pay at Hotel' || b.payment_method === 'Hotel Desk')).reduce((sum, b) => sum + (b.amount_paid || 0), 0);

  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Guest Name',
      'Guest Email',
      'Guest Phone',
      'ID Type',
      'ID Number',
      'Room Number',
      'Room Type',
      'Scheduled Check-In',
      'Actual Check-In',
      'Scheduled Check-Out',
      'Actual Check-Out',
      'Total Amount (INR)',
      'Amount Paid (INR)',
      'Payment Status',
      'Payment Method',
      'Payment Reference',
      'Status'
    ];

    const rows = bookings.map(b => {
      const getCheckInStr = b.check_in instanceof Date ? b.check_in.toISOString() : (typeof b.check_in === 'string' ? b.check_in : new Date(b.check_in).toISOString());
      const getCheckOutStr = b.check_out instanceof Date ? b.check_out.toISOString() : (typeof b.check_out === 'string' ? b.check_out : new Date(b.check_out).toISOString());

      const actualIn = b.actual_check_in ? format(new Date(b.actual_check_in), 'yyyy-MM-dd HH:mm:ss') : 'Not Checked In';
      const actualOut = b.actual_check_out ? format(new Date(b.actual_check_out), 'yyyy-MM-dd HH:mm:ss') : 'Not Checked Out';

      return [
        b.id,
        b.guest?.name || 'N/A',
        b.guest?.email || 'N/A',
        b.guest?.phone || 'N/A',
        b.guest?.id_type || 'N/A',
        b.guest?.id_number || 'N/A',
        b.room?.room_number || 'Pending Assignment',
        b.room?.room_type?.name || b.roomType || 'N/A',
        getCheckInStr.replace('T', ' '),
        actualIn,
        getCheckOutStr.replace('T', ' '),
        actualOut,
        b.total_amount,
        b.amount_paid || 0,
        b.payment_status?.toUpperCase() || 'PENDING',
        b.payment_method || 'N/A',
        b.payment_source || 'N/A',
        b.status?.toUpperCase()
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bethel_meadows_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">Reservations</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Manage and edit guest bookings or create direct walk-in reservations
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenNew}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Tab System Navigation */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        borderBottom: '1px solid var(--color-gray-200)',
        marginBottom: 'var(--space-6)',
        marginTop: 'var(--space-4)'
      }}>
        <button
          onClick={() => setActiveTab('reservations')}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: activeTab === 'reservations' ? 'var(--color-gold-dark)' : 'var(--color-gray-400)',
            borderBottom: activeTab === 'reservations' ? '2.5px solid var(--color-gold)' : 'none',
            padding: '12px 20px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          📋 Bookings List
        </button>
        <button
          onClick={() => setActiveTab('paymentStatus')}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: activeTab === 'paymentStatus' ? 'var(--color-gold-dark)' : 'var(--color-gray-400)',
            borderBottom: activeTab === 'paymentStatus' ? '2.5px solid var(--color-gold)' : 'none',
            padding: '12px 20px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          💳 Payment Status Board
        </button>
        <button
          onClick={() => setActiveTab('paymentDetails')}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: activeTab === 'paymentDetails' ? 'var(--color-gold-dark)' : 'var(--color-gray-400)',
            borderBottom: activeTab === 'paymentDetails' ? '2.5px solid var(--color-gold)' : 'none',
            padding: '12px 20px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          🔍 Payment Details & Sources
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: activeTab === 'reports' ? 'var(--color-gold-dark)' : 'var(--color-gray-400)',
            borderBottom: activeTab === 'reports' ? '2.5px solid var(--color-gold)' : 'none',
            padding: '12px 20px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          📊 Reports & Audit Logs
        </button>
      </div>

      {/* Tab 1: Bookings List */}
      {activeTab === 'reservations' && (
        <>
          {/* Filters */}
          <div style={{
            display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)',
            alignItems: 'center', flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '360px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search name, email, or booking ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div style={{ display: 'flex', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
              <button 
                className={`btn btn-sm ${timeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setTimeFilter('all')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >All</button>
              <button 
                className={`btn btn-sm ${timeFilter === 'today' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setTimeFilter('today')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >Today</button>
              <button 
                className={`btn btn-sm ${timeFilter === 'upcoming' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setTimeFilter('upcoming')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >Upcoming</button>
              <button 
                className={`btn btn-sm ${timeFilter === 'past' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setTimeFilter('past')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >Past</button>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginLeft: 'auto' }}>
              Showing {filtered.length} of {bookings.length} reservations
            </div>
          </div>

          {/* Table */}
          <div className="table-container animate-fade-in">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID / Time</th>
                  <th>Guest</th>
                  <th>Room Type / Room No.</th>
                  <th>Check-in & Out</th>
                  <th>Nights</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)' }}>
                      No reservations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const todayStr = format(new Date(), 'yyyy-MM-dd');
                    const tomorrowDate = new Date();
                    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                    const tomorrowStr = format(tomorrowDate, 'yyyy-MM-dd');

                    const todaysCheckIns = [];
                    const tomorrowsArrivals = [];
                    const upcomingStays = [];
                    const todaysCheckOuts = [];
                    const activeStays = [];
                    const otherBookings = [];

                    filtered.forEach(b => {
                      const checkInDateStr = format(parseLocalDate(b.check_in), 'yyyy-MM-dd');
                      const checkOutDateStr = format(parseLocalDate(b.check_out), 'yyyy-MM-dd');
                      if (b.status === 'checked_in') {
                        if (checkOutDateStr === todayStr) {
                          todaysCheckOuts.push(b);
                        } else {
                          activeStays.push(b);
                        }
                      } else if (b.status === 'confirmed' || b.status === 'pending') {
                        if (checkInDateStr === todayStr) todaysCheckIns.push(b);
                        else if (checkInDateStr === tomorrowStr) tomorrowsArrivals.push(b);
                        else if (checkInDateStr > todayStr) upcomingStays.push(b);
                        else otherBookings.push(b);
                      } else {
                        otherBookings.push(b);
                      }
                    });

                    const renderGroup = (title, items, bgColor = 'var(--color-gray-50)', badgeColor = 'badge-navy') => {
                      if (items.length === 0) return null;
                      return (
                        <>
                          <tr>
                            <td colSpan="8" style={{ background: bgColor, fontWeight: 600, color: 'var(--color-navy)', padding: '12px 16px' }}>
                              {title} <span className={`badge ${badgeColor}`} style={{ marginLeft: '8px' }}>{items.length}</span>
                            </td>
                          </tr>
                          {items.map(b => {
                            const checkInDateStr = format(parseLocalDate(b.check_in), 'yyyy-MM-dd');
                            const isFuture = checkInDateStr > todayStr;
                            let daysUntil = 0;
                            if (isFuture) {
                              const diffTime = Math.abs(new Date(b.check_in) - new Date());
                              daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            }

                            return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-navy)' }}>
                          {b.id}
                        </div>
                        {b.created_at && (
                          <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={10} style={{ color: 'var(--color-gold)' }} /> {format(new Date(b.created_at), 'dd MMM yy HH:mm')}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{b.guest?.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                          {b.guest?.email} | {b.guest?.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.room?.room_type?.name || 'Deluxe Room'}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', fontWeight: 600 }}>
                          Room {b.room?.room_number || 'Pending Assignment'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {format(new Date(b.check_in), 'dd MMM yy')} → {format(new Date(b.check_out), 'dd MMM yy')}
                        </div>
                        {isFuture && b.status === 'confirmed' && (
                          <div style={{ fontSize: '10px', color: 'var(--color-warning)', marginTop: '2px', fontWeight: 600 }}>
                            Arriving in {daysUntil} day{daysUntil > 1 ? 's' : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 500 }}>{b.nights || 1}</td>
                      <td>
                        <span className={`badge ${
                          b.status === 'confirmed' ? 'badge-info' :
                          b.status === 'checked_in' ? 'badge-success' :
                          b.status === 'checked_out' ? 'badge-navy' : 'badge-error'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                        ₹{b.total_amount?.toLocaleString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
                          <button className="btn btn-icon btn-ghost" title="Print Invoice" onClick={() => setInvoiceBookingId(b.id)}>
                            <FileText size={16} />
                          </button>
                          <button className="btn btn-icon btn-ghost" title="Edit booking details" onClick={() => handleOpenEdit(b)}>
                            <Edit size={16} />
                          </button>
                          {(b.status === 'confirmed' || b.status === 'pending') && (
                            <button className="btn btn-icon btn-ghost" title="Cancel booking" style={{ color: 'var(--color-error)' }} onClick={() => cancelBooking(b.id)}>
                              <XIcon size={16} />
                            </button>
                          )}
                          {(b.status === 'confirmed' || b.status === 'pending') && (
                            isFuture ? (
                              <button 
                                className="btn btn-secondary btn-sm" 
                                disabled
                                style={{ padding: '2px 8px', fontSize: '11px', opacity: 0.6 }}
                                title={`Check-in Available on ${format(new Date(b.check_in), 'MMM d')}`}
                              >
                                Check In
                              </button>
                            ) : (
                              b.payment_status === 'paid' ? (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  style={{ padding: '2px 8px', fontSize: '11px' }}
                                  title="Check In Guest"
                                  onClick={() => checkIn(b.id)}
                                >
                                  Check In
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  style={{ padding: '2px 8px', fontSize: '11px', background: 'var(--color-success)', color: 'white', border: 'none' }}
                                  title="Collect payment and automatically check in"
                                  onClick={() => {
                                    setCollectPaymentBookingId(b.id);
                                    setCollectSource('');
                                    setAutoCheckInAfterPayment(true);
                                  }}
                                >
                                  💳 Pay & Check In
                                </button>
                              )
                            )
                          )}
                          {b.status === 'checked_in' && (
                            <button className="btn btn-primary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => {
                              const checkOutDateStr = format(parseLocalDate(b.check_out), 'yyyy-MM-dd');
                              const todayStr = format(new Date(), 'yyyy-MM-dd');
                              if (checkOutDateStr > todayStr) {
                                // Early check-out requires admin password
                                setEarlyCheckoutBookingId(b.id);
                                setAdminPassword('');
                                setAdminPasswordError('');
                              } else {
                                checkOut(b.id);
                              }
                            }}>
                              Check Out
                            </button>
                          )}
                          {b.payment_status !== 'paid' && b.status !== 'cancelled' && (
                            <button 
                              className="btn btn-sm" 
                              style={{ padding: '2px 8px', fontSize: '11px', background: 'var(--color-gold)', color: 'var(--color-navy)', border: 'none', fontWeight: 600 }} 
                              onClick={() => {
                                setCollectPaymentBookingId(b.id);
                                setCollectSource('');
                                setAutoCheckInAfterPayment(false);
                              }}
                              title="Record Payment Details"
                            >
                              <CheckCircle size={12} style={{ marginRight: '4px', display: 'inline' }}/> Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                            );
                          })}
                        </>
                      );
                    };

                    return (
                      <>
                        {renderGroup("Priority Check-Outs (Today)", todaysCheckOuts, 'rgba(239, 68, 68, 0.1)', 'badge-error')}
                        {renderGroup("Today's Check-ins", todaysCheckIns, 'rgba(16, 185, 129, 0.1)', 'badge-success')}
                        {renderGroup("Tomorrow's Arrivals", tomorrowsArrivals, 'rgba(59, 130, 246, 0.1)', 'badge-info')}
                        {renderGroup("Upcoming Stays", upcomingStays, 'rgba(245, 158, 11, 0.1)', 'badge-warning')}
                        {renderGroup("Active / In-House", activeStays, 'var(--color-gray-100)', 'badge-navy')}
                        {renderGroup("Other Bookings", otherBookings, 'var(--color-gray-50)', 'badge-gray')}
                      </>
                    );
                  })()
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tab 2: Payment Status Board */}
      {activeTab === 'paymentStatus' && (
        <div className="animate-fade-in">
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--color-gold)' }}>
              <div className="stat-card-value">₹{totalInvoiced.toLocaleString()}</div>
              <div className="stat-card-label">Total Invoiced Amount</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
              <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>₹{totalCollected.toLocaleString()}</div>
              <div className="stat-card-label">Total Collected (Paid)</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
              <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>₹{totalPending.toLocaleString()}</div>
              <div className="stat-card-label">Total Pending (Outstanding)</div>
            </div>
          </div>

          {/* Payment Status Grid */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Details</th>
                  <th>Total Due</th>
                  <th>Amount Paid</th>
                  <th>Payment Status</th>
                  <th>Payment Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.filter(b => b.status !== 'cancelled').map(b => {
                  const outstanding = b.total_amount - (b.amount_paid || 0);
                  const isPaid = b.payment_status === 'paid' || outstanding <= 0;
                  return (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{b.guest?.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>{b.guest?.email}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{b.total_amount?.toLocaleString()}</td>
                      <td style={{ fontWeight: 600, color: isPaid ? 'var(--color-success)' : 'var(--color-gray-700)' }}>
                        ₹{(b.amount_paid || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${
                          isPaid ? 'badge-success' : 
                          (b.amount_paid > 0 ? 'badge-warning' : 'badge-error')
                        }`}>
                          {isPaid ? 'PAID' : (b.amount_paid > 0 ? 'PARTIAL' : 'PENDING')}
                        </span>
                      </td>
                      <td>
                        {b.payment_method ? (
                          <div style={{ fontSize: '13px' }}>
                            <strong>{b.payment_method}</strong>
                            <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '2px' }}>{b.payment_source}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-gray-400)', fontSize: '12px' }}>Not Recorded</span>
                        )}
                      </td>
                      <td>
                        {!isPaid ? (
                          <button
                            onClick={() => {
                              setCollectPaymentBookingId(b.id);
                              setCollectSource('');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ minHeight: '30px', padding: '2px 12px', fontSize: '11px' }}
                          >
                            Collect ₹{outstanding.toLocaleString()}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ✓ Fully Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Details & Sources */}
      {activeTab === 'paymentDetails' && (
        <div className="animate-fade-in">
          {/* Source Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div className="stat-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="stat-card-value" style={{ color: '#16a34a' }}>₹{upiTotal.toLocaleString()}</div>
              <div className="stat-card-label" style={{ color: '#15803d', fontWeight: 600 }}>Total Collected via UPI</div>
            </div>
            <div className="stat-card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="stat-card-value" style={{ color: '#2563eb' }}>₹{cardTotal.toLocaleString()}</div>
              <div className="stat-card-label" style={{ color: '#1d4ed8', fontWeight: 600 }}>Total Collected via Card</div>
            </div>
            <div className="stat-card" style={{ background: '#fafaf9', border: '1px solid #e7e5e4' }}>
              <div className="stat-card-value" style={{ color: 'var(--color-navy)' }}>₹{cashTotal.toLocaleString()}</div>
              <div className="stat-card-label" style={{ color: 'var(--color-gray-600)', fontWeight: 600 }}>Total via Desk / Cash</div>
            </div>
          </div>

          {/* Sources Logs Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking Ref / Time</th>
                  <th>Guest Name</th>
                  <th>Invoiced Amount</th>
                  <th>Amount Paid</th>
                  <th>Method</th>
                  <th>Source & Reference Details</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.filter(b => (b.amount_paid || 0) > 0 && b.status !== 'cancelled').map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.id}</div>
                      {b.created_at && (
                        <div style={{ fontSize: '9px', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                          {format(new Date(b.created_at), 'dd MMM yy HH:mm')}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{b.guest?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>{b.guest?.email}</div>
                    </td>
                    <td>₹{b.total_amount?.toLocaleString()}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>₹{b.amount_paid?.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-gold" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        {b.payment_method || 'Desk Cash'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--color-navy)', fontSize: '13px' }}>
                        {b.payment_source || 'Hotel Desk / Cash'}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>
                        {b.created_at ? format(new Date(b.created_at), 'dd MMM yyyy') : 'Check-in Settlement'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reports & Audit Logs */}
      {activeTab === 'reports' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Export Action Card */}
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-gray-200)',
            padding: 'var(--space-6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>
                📅 Complete Hotel Audit Report
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '4px', margin: 0 }}>
                Download the complete guest ledger database including automated check-in/out timestamps and financial records.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} /> Export Audit Ledger (CSV)
            </button>
          </div>

          {/* Audit Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
            <div className="stat-card">
              <div className="stat-card-value">{bookings.length}</div>
              <div className="stat-card-label">Total Reservations</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
              <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
                {bookings.filter(b => b.status === 'checked_in').length}
              </div>
              <div className="stat-card-label">Currently Checked In</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--color-navy)' }}>
              <div className="stat-card-value" style={{ color: 'var(--color-navy)' }}>
                {bookings.filter(b => b.status === 'checked_out').length}
              </div>
              <div className="stat-card-label">Completed Stays</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
              <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <div className="stat-card-label">Cancelled Bookings</div>
            </div>
          </div>

          {/* Real-time Timestamps Log */}
          <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>
                ⏰ Automated Operations Timeline (Audit Log)
              </h3>
            </div>
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Booking Ref</th>
                    <th>Guest</th>
                    <th>Scheduled Check-in</th>
                    <th>Actual Check-in (Auto-Logged)</th>
                    <th>Scheduled Check-out</th>
                    <th>Actual Check-out (Auto-Logged)</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.id}</td>
                      <td>
                        <strong style={{ color: 'var(--color-navy)' }}>{b.guest?.name}</strong>
                      </td>
                      <td>{format(new Date(b.check_in), 'dd MMM yyyy')}</td>
                      <td style={{ color: b.actual_check_in ? 'var(--color-success)' : 'var(--color-gray-400)', fontWeight: b.actual_check_in ? '600' : '400' }}>
                        {b.actual_check_in ? format(new Date(b.actual_check_in), 'dd MMM yyyy HH:mm:ss') : 'Not Checked In'}
                      </td>
                      <td>{format(new Date(b.check_out), 'dd MMM yyyy')}</td>
                      <td style={{ color: b.actual_check_out ? 'var(--color-navy)' : 'var(--color-gray-400)', fontWeight: b.actual_check_out ? '600' : '400' }}>
                        {b.actual_check_out ? format(new Date(b.actual_check_out), 'dd MMM yyyy HH:mm:ss') : 'Not Checked Out'}
                      </td>
                      <td>
                        <span className={`badge ${b.payment_status === 'paid' ? 'badge-success' : 'badge-error'}`}>
                          {b.payment_status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Overlay */}
      {invoiceBookingId && (
        <InvoiceModal bookingId={invoiceBookingId} onClose={() => setInvoiceBookingId(null)} />
      )}

      {/* Add / Edit Form Modal Overlay */}
      {isFormOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '640px',
            boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--color-gray-200)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editBookingId ? `✏️ Edit Reservation: ${editBookingId}` : '➕ Create Direct Walk-In Booking'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)' }}>
                <XIcon size={20} />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleFormSubmit} style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Guest Full Name *</label>
                  <input
                    className="form-input"
                    value={formData.guestName}
                    onChange={e => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                    placeholder="Enter guest's full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Guest Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.guestEmail}
                    onChange={e => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
                    placeholder="guest@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Guest Phone *</label>
                  <input
                    className="form-input"
                    value={formData.guestPhone}
                    onChange={e => setFormData(prev => ({ ...prev, guestPhone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ID Type</label>
                  <select
                    className="form-select"
                    value={formData.guestIdType}
                    onChange={e => setFormData(prev => ({ ...prev, guestIdType: e.target.value }))}
                  >
                    <option>Aadhaar</option>
                    <option>Passport</option>
                    <option>Driving License</option>
                    <option>Voter ID</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ID Document Number</label>
                  <input
                    className="form-input"
                    value={formData.guestIdNumber}
                    onChange={e => setFormData(prev => ({ ...prev, guestIdNumber: e.target.value }))}
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', gridColumn: 'span 2' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Check-in Date & Time *</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.checkIn}
                        onChange={e => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                        style={{ flex: 2 }}
                        required
                      />
                      <input
                        type="time"
                        className="form-input"
                        value={formData.checkInTime}
                        onChange={e => setFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
                        style={{ flex: 1 }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Check-out Date & Time *</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.checkOut}
                        onChange={e => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                        style={{ flex: 2 }}
                        required
                      />
                      <input
                        type="time"
                        className="form-input"
                        value={formData.checkOutTime}
                        onChange={e => setFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                        style={{ flex: 1 }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Room Type *</label>
                  <select
                    className="form-select"
                    value={formData.roomTypeId}
                    onChange={e => {
                      const firstAvailable = rooms.find(r => r.room_type_id === e.target.value && r.status === 'available');
                      setFormData(prev => ({
                        ...prev,
                        roomTypeId: e.target.value,
                        roomId: firstAvailable ? firstAvailable.id : rooms.find(r => r.room_type_id === e.target.value)?.id || ''
                      }));
                    }}
                  >
                    {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name} (₹{rt.base_price}/night)</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Assign Room *</label>
                  <select
                    className="form-select"
                    value={formData.roomId}
                    onChange={e => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
                    required
                  >
                    <option value="">-- Choose Room --</option>
                    {matchingRooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.room_number} ({r.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Guests Count</label>
                  <select
                    className="form-select"
                    value={formData.guests}
                    onChange={e => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>

                {editBookingId ? (
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Booking Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="checked_in">Checked In</option>
                      <option value="checked_out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                ) : (
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '28px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                      New direct booking is automatically marked Confirmed
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Custom Charge Amount (₹) - Leave blank to auto-calculate</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalAmount}
                    onChange={e => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                    placeholder={`Auto-calculate: ₹${getCalculatedPrice().toLocaleString()}`}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '28px' }}>
                  <div style={{ background: 'var(--color-cream)', width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gold)', fontSize: 'var(--text-sm)', color: 'var(--color-brown)', fontWeight: 600 }}>
                    Estimated pricing: ₹{getCalculatedPrice().toLocaleString()}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Special Requests</label>
                  <textarea
                    className="form-input"
                    value={formData.specialRequests}
                    onChange={e => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Extra bedding, allergies, request details..."
                    style={{ minHeight: '60px' }}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Internal Staff Notes</label>
                  <textarea
                    className="form-input"
                    value={formData.notes}
                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Staff notes for operations..."
                    style={{ minHeight: '60px' }}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px',
                paddingTop: '16px', borderTop: '1px solid var(--color-gray-200)'
              }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editBookingId ? 'Save Changes' : 'Confirm Walk-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Modal Overlay */}
      {collectPaymentBookingId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '420px',
            boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--color-gray-200)', overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--color-navy)', margin: 0 }}>
                💳 Collect Payment: {collectPaymentBookingId}
              </h3>
              <button onClick={() => setCollectPaymentBookingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)' }}>
                <XIcon size={18} />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const bookingToPay = bookings.find(b => b.id === collectPaymentBookingId);
              if (bookingToPay) {
                await updateBooking(collectPaymentBookingId, {
                  payment_status: 'paid',
                  amount_paid: bookingToPay.total_amount,
                  payment_method: collectMethod,
                  payment_source: collectSource.trim() || (collectMethod === 'Cash' ? 'Hotel Desk' : 'Front Desk Direct')
                });
                
                if (autoCheckInAfterPayment) {
                  await checkIn(collectPaymentBookingId);
                  setAutoCheckInAfterPayment(false);
                }
                setCollectPaymentBookingId(null);
              }
            }} style={{ padding: '20px' }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={collectMethod}
                  onChange={(e) => setCollectMethod(e.target.value)}
                >
                  <option value="UPI">UPI (QR Scan / Mobile App)</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Cash">Cash at Hotel Desk</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Payment Source / Reference Info</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={
                    collectMethod === 'UPI' ? 'Enter UPI ID or Transaction ID' :
                    collectMethod === 'Card' ? 'Enter Card Type or Last 4 Digits' :
                    'e.g. Received Cash'
                  }
                  value={collectSource}
                  onChange={(e) => setCollectSource(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline btn-sm" style={{ minHeight: '32px' }} onClick={() => setCollectPaymentBookingId(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: '32px' }}>
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Early Check-Out Admin Password Modal Overlay */}
      {earlyCheckoutBookingId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '420px',
            boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--color-gray-200)', overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--color-gray-200)', background: '#fffbeb'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: '#d97706', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} /> Admin Verification Required
              </h3>
              <button onClick={() => setEarlyCheckoutBookingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)' }}>
                <XIcon size={18} />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (adminPassword === 'admin123') {
                await checkOut(earlyCheckoutBookingId);
                setEarlyCheckoutBookingId(null);
              } else {
                setAdminPasswordError('Incorrect admin password.');
              }
            }} style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '16px' }}>
                This guest is checking out <strong>early</strong> (before their scheduled check-out date). 
                Please enter the admin password to authorize this action.
              </p>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Admin Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter admin password (admin123)"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAdminPasswordError('');
                  }}
                  required
                />
                {adminPasswordError && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{adminPasswordError}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline btn-sm" style={{ minHeight: '32px' }} onClick={() => setEarlyCheckoutBookingId(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: '32px' }}>
                  Authorize & Check Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
