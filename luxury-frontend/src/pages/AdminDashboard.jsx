import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, Home as HomeIcon, Users, Settings, LogOut,
  Bell, Search, ChevronDown, CheckCircle, XCircle, Trash2, Eye,
  TrendingUp, DollarSign, BedDouble, UserCheck, AlertCircle, Volume2,
  Calendar, Phone, Mail, User
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_PASSWORD = 'bethelmeadows2024';

export default function AdminDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBookingAlert, setNewBookingAlert] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthSuccess, setShowAuthSuccess] = useState(false);
  const audioRef = useRef(null);
  const prevBookingCount = useRef(0);

  // Auth
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      setAuthError('');
      setShowAuthSuccess(true);
      setTimeout(() => setShowAuthSuccess(false), 2000);
    } else {
      setAuthError('Incorrect password');
    }
  };

  // Data Fetching
  const fetchData = useCallback(async () => {
    try {
      const [bRes, rRes] = await Promise.all([
        fetch(`${API_BASE}/api/bookings`),
        fetch(`${API_BASE}/api/rooms`)
      ]);
      const [bData, rData] = await Promise.all([bRes.json(), rRes.json()]);
      const bookingsList = Array.isArray(bData) ? bData : bData.bookings || [];
      
      // Check for new bookings
      if (prevBookingCount.current > 0 && bookingsList.length > prevBookingCount.current) {
        setNewBookingAlert(true);
        // Play alarm sound
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1000;
            gain2.gain.value = 0.3;
            osc2.start();
            osc2.stop(ctx.currentTime + 0.5);
          }, 600);
        } catch (e) {}
      }
      prevBookingCount.current = bookingsList.length;
      
      setBookings(bookingsList);
      setRooms(rData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [isAuth, fetchData]);

  // Stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const todayCheckIns = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.check_in?.split('T')[0] === today && b.status === 'confirmed';
  }).length;

  const filteredBookings = bookings.filter(b =>
    !searchQuery ||
    b.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.guest_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Auth Screen
  if (!isAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A1A, #2A2A2A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '24px', marginBottom: '8px', fontWeight: 500 }}>Admin Access</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '32px' }}>Enter your admin password to continue</p>

          {authError && (
            <div style={{ padding: '8px 16px', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 'var(--radius-sm)', color: '#E74C3C', fontSize: '13px', marginBottom: '16px' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%', padding: '14px 20px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)',
                color: '#fff', fontSize: '15px', textAlign: 'center', letterSpacing: '4px'
              }}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'bookings', label: 'Bookings', icon: CalendarDays },
    { key: 'rooms', label: 'Rooms', icon: HomeIcon },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F3EF' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: 'var(--color-dark)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 20
      }}
      className="admin-sidebar"
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🌿</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 500, letterSpacing: '1.5px' }}>Bethel Meadows</h3>
              <p style={{ fontSize: '9px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === item.key ? 'rgba(201,169,110,0.15)' : 'transparent',
                  color: activeTab === item.key ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  marginBottom: '4px',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} />
                {item.label}
                {item.key === 'bookings' && newBookingAlert && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E74C3C', marginLeft: 'auto', animation: 'pulse-gold 1.5s infinite' }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => setIsAuth(false)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '10px 16px', border: 'none', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer'
          }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }} className="admin-main">
        {/* New Booking Alert */}
        <AnimatePresence>
          {newBookingAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-gold)',
                animation: 'pulse-gold 2s infinite'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={24} className="bell-animate" />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600 }}>🔔 New Booking Received!</h4>
                  <p style={{ fontSize: '13px', opacity: 0.9 }}>A new reservation has been placed. Check bookings for details.</p>
                </div>
              </div>
              <button onClick={() => { setNewBookingAlert(false); setActiveTab('bookings'); }} style={{
                padding: '8px 20px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', borderRadius: '2px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                View
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Success Popup */}
        <AnimatePresence>
          {showAuthSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 100, background: 'var(--color-cards)', padding: '48px', borderRadius: 'var(--radius-lg)',
                textAlign: 'center', boxShadow: 'var(--shadow-xl)'
              }}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}
                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(46,204,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={32} color="#2ECC71" />
              </motion.div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '4px' }}>Welcome Back!</h3>
              <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>Admin access granted</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '32px', fontWeight: 500 }}>Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {[
                { icon: DollarSign, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#2ECC71', bg: 'rgba(46,204,113,0.1)' },
                { icon: CalendarDays, label: 'Total Bookings', value: bookings.length, color: 'var(--color-gold)', bg: 'var(--color-gold-glow)' },
                { icon: UserCheck, label: 'Confirmed', value: confirmedBookings, color: '#3498DB', bg: 'rgba(52,152,219,0.1)' },
                { icon: BedDouble, label: "Today's Check-ins", value: todayCheckIns, color: '#9B59B6', bg: 'rgba(155,89,182,0.1)' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: 'var(--color-cards)',
                      padding: '24px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} color={stat.color} />
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 600, color: 'var(--color-text)' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Bookings */}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '16px' }}>Recent Bookings</h3>
            <div style={{ background: 'var(--color-cards)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-light)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-alt)' }}>
                    {['Guest', 'Check-in', 'Check-out', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 8).map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{b.guest_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{b.guest_email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{new Date(b.check_in).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{new Date(b.check_out).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500, color: 'var(--color-gold)' }}>₹{b.total_price?.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                          background: b.status === 'confirmed' ? 'rgba(46,204,113,0.1)' : b.status === 'cancelled' ? 'rgba(231,76,60,0.1)' : 'rgba(243,156,18,0.1)',
                          color: b.status === 'confirmed' ? '#2ECC71' : b.status === 'cancelled' ? '#E74C3C' : '#F39C12'
                        }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 500 }}>All Bookings</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookings..."
                    style={{
                      padding: '10px 16px 10px 36px', background: 'var(--color-cards)',
                      border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-sm)',
                      fontSize: '14px', width: '280px'
                    }}
                  />
                </div>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-cards)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--color-text-light)' }}>No bookings found</p>
              </div>
            ) : (
              <div style={{ background: 'var(--color-cards)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-light)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)' }}>
                      {['ID', 'Guest', 'Contact', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={{ padding: '14px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-gold)' }}>{b.id?.substring(0, 8).toUpperCase()}</td>
                        <td style={{ padding: '14px', fontWeight: 500, fontSize: '14px' }}>{b.guest_name}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{b.guest_email}</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{b.guest_phone}</div>
                        </td>
                        <td style={{ padding: '14px', fontSize: '12px' }}>
                          {new Date(b.check_in).toLocaleDateString('en-IN')} → {new Date(b.check_out).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600, color: 'var(--color-gold)' }}>₹{b.total_price?.toLocaleString()}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
                            background: b.status === 'confirmed' ? 'rgba(46,204,113,0.1)' : b.status === 'cancelled' ? 'rgba(231,76,60,0.1)' : 'rgba(243,156,18,0.1)',
                            color: b.status === 'confirmed' ? '#2ECC71' : b.status === 'cancelled' ? '#E74C3C' : '#F39C12'
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {b.status !== 'confirmed' && (
                              <button onClick={() => handleStatusUpdate(b.id, 'confirmed')} title="Confirm"
                                style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid rgba(46,204,113,0.3)', background: 'rgba(46,204,113,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <CheckCircle size={14} color="#2ECC71" />
                              </button>
                            )}
                            {b.status !== 'cancelled' && (
                              <button onClick={() => handleStatusUpdate(b.id, 'cancelled')} title="Cancel"
                                style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid rgba(231,76,60,0.3)', background: 'rgba(231,76,60,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <XCircle size={14} color="#E74C3C" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '24px', fontWeight: 500 }}>Room Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {rooms.sort((a, b) => a.name.localeCompare(b.name)).map(room => (
                <div key={room.id} style={{
                  background: 'var(--color-cards)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-light)', overflow: 'hidden'
                }}>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 500 }}>{room.name}</h3>
                      <span style={{
                        padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '11px', fontWeight: 600,
                        background: 'var(--color-gold-glow)', color: 'var(--color-gold)'
                      }}>
                        {room.type}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                        {room.type === '1 BHK' ? '1-2 Guests' : room.type === '2 BHK' ? '3-4 Guests' : '5-6 Guests'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: 'var(--color-gold)', fontWeight: 600 }}>
                        ₹{room.price_per_night?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bell-shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-15deg); } }
        .bell-animate { animation: bell-shake 0.5s infinite; }
        @media (max-width: 768px) {
          .admin-sidebar { width: 60px !important; }
          .admin-sidebar span, .admin-sidebar h3, .admin-sidebar p, .admin-sidebar button span { display: none; }
          .admin-main { margin-left: 60px !important; }
        }
      `}</style>
    </div>
  );
}
