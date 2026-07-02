import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ROOM_TYPES, ROOMS as INITIAL_ROOMS, MOCK_BOOKINGS as INITIAL_BOOKINGS, MOCK_GUESTS as INITIAL_GUESTS, SPECIAL_OFFERS as INITIAL_OFFERS, PRICING_RULES as INITIAL_RULES, MOCK_USERS, calculateDynamicPrice, isMockMode, api } from '../lib/api';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

const DataContext = createContext(null);

// Real EmailJS sender helper
const sendRealEmailConfirmation = async (booking) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.log("Real EmailJS credentials not set. Simulated email logged to console for:", booking.guestEmail);
    return;
  }

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          booking_id: booking.id,
          guest_name: booking.guestName,
          guest_email: booking.guestEmail,
          room_type: booking.roomType,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          total_amount: booking.totalAmount,
          payment_method: booking.paymentMethod,
          payment_status: booking.paymentStatus,
          payment_source: booking.paymentSource
        }
      })
    });
    if (res.ok) {
      console.log("Real email confirmation sent successfully to", booking.guestEmail);
    } else {
      console.error("Failed to send real email confirmation. Status:", res.status);
    }
  } catch (error) {
    console.error("Error sending real email confirmation:", error);
  }
};


// LocalStorage keys
const LS_BOOKINGS = 'bm_bookings';
const LS_ROOMS = 'bm_rooms';
const LS_GUESTS = 'bm_guests';
const LS_NOTIFICATIONS = 'bm_notifications';
const LS_PRICING_RULES = 'bm_pricing_rules';
const LS_SPECIAL_OFFERS = 'bm_special_offers';
const LS_USERS = 'bm_users';
const LS_UNACKNOWLEDGED = 'bm_unacknowledged';

// Safe date parser to avoid timezone shifts
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;

  // If it's a timestamp string (like ISO format)
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(dateStr);
  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day);
};

export const formatLocalDate = (date) => {
  if (!date) return '';
  if (!(date instanceof Date)) return date;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Re-hydrate date fields
      if (key === LS_BOOKINGS) {
        return parsed.map(b => ({
          ...b,
          check_in: parseLocalDate(b.check_in),
          check_out: parseLocalDate(b.check_out),
          created_at: new Date(b.created_at),
          room: INITIAL_ROOMS.find(r => r.id === b.room_id) || b.room,
          guest: b.guest
        }));
      }
      return parsed;
    }
  } catch (e) { /* ignore */ }
  // Safe default hydrate for fallback if it's INITIAL_BOOKINGS
  if (key === LS_BOOKINGS && fallback) {
    return fallback.map(b => ({
      ...b,
      check_in: parseLocalDate(b.check_in),
      check_out: parseLocalDate(b.check_out),
      created_at: new Date(b.created_at)
    }));
  }
  return fallback;
}

function saveToStorage(key, data) {
  try {
    if (key === LS_BOOKINGS) {
      const serializable = data.map(b => ({
        ...b,
        room_id: b.room?.id || b.room_id,
        check_in: b.check_in instanceof Date ? formatLocalDate(b.check_in) : b.check_in,
        check_out: b.check_out instanceof Date ? formatLocalDate(b.check_out) : b.check_out,
        created_at: b.created_at instanceof Date ? b.created_at.toISOString() : b.created_at,
      }));
      localStorage.setItem(key, JSON.stringify(serializable));
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) { /* ignore */ }
}

export function DataProvider({ children }) {
  const location = useLocation();
  const [bookings, setBookings] = useState(() => loadFromStorage(LS_BOOKINGS, INITIAL_BOOKINGS));
  const [rooms, setRooms] = useState(() => loadFromStorage(LS_ROOMS, INITIAL_ROOMS));
  const [roomTypes, setRoomTypes] = useState(ROOM_TYPES);
  const [guests, setGuests] = useState(() => loadFromStorage(LS_GUESTS, INITIAL_GUESTS));
  const [notifications, setNotifications] = useState(() => loadFromStorage(LS_NOTIFICATIONS, []));
  const [pricingRules, setPricingRules] = useState(() => loadFromStorage(LS_PRICING_RULES, INITIAL_RULES));
  const [specialOffers, setSpecialOffers] = useState(() => loadFromStorage(LS_SPECIAL_OFFERS, INITIAL_OFFERS));
  const [users, setUsers] = useState(() => loadFromStorage(LS_USERS, MOCK_USERS));
  const [unacknowledgedBookings, setUnacknowledgedBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [digitalQueue, setDigitalQueue] = useState([]);
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const alarmIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);

  // Persist to localStorage
  useEffect(() => { saveToStorage(LS_BOOKINGS, bookings); }, [bookings]);
  useEffect(() => { saveToStorage(LS_ROOMS, rooms); }, [rooms]);
  useEffect(() => { saveToStorage(LS_GUESTS, guests); }, [guests]);
  useEffect(() => { saveToStorage(LS_NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(LS_PRICING_RULES, pricingRules); }, [pricingRules]);
  useEffect(() => { saveToStorage(LS_SPECIAL_OFFERS, specialOffers); }, [specialOffers]);
  useEffect(() => { saveToStorage(LS_USERS, users); }, [users]);
  useEffect(() => { saveToStorage(LS_UNACKNOWLEDGED, unacknowledgedBookings); }, [unacknowledgedBookings]);

  // Fetch from custom Express/SQLite backend server on mount / path change
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const token = localStorage.getItem('bm_token');

        // Fetch public data (rooms, room types, special offers)
        const [dbRooms, dbRoomTypes, dbSpecialOffers] = await Promise.all([
          api.getRooms(),
          api.getRoomTypes(),
          api.getSpecialOffers()
        ]);

        let normalizedTypes = [];
        if (dbRoomTypes) {
          normalizedTypes = dbRoomTypes.map(rt => ({
            ...rt,
            facilities: typeof rt.facilities === 'string' ? JSON.parse(rt.facilities || '[]') : rt.facilities,
            images: typeof rt.images === 'string' ? JSON.parse(rt.images || '[]') : rt.images,
            featured: !!rt.featured,
            active: !!rt.active
          }));
          setRoomTypes(normalizedTypes);
        }

        if (dbRooms && normalizedTypes.length > 0) {
          const mappedRooms = dbRooms.map(r => ({
            ...r,
            room_type: normalizedTypes.find(rt => rt.id === r.room_type_id) || null
          }));
          setRooms(mappedRooms);
        }

        if (dbSpecialOffers) {
          setSpecialOffers(dbSpecialOffers);
        }

        // If staff is logged in, fetch admin/staff private data
        if (token) {
          const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');
          if (isAdminPage) {
            const [dbBookings, dbGuests, dbPricingRules, dbUsers, dbExpenses, dbCalendar, dbQueue] = await Promise.all([
              api.getBookings(),
              api.getGuests(),
              api.getPricingRules(),
              api.getUsers().catch(() => null),
              api.getExpenses().catch(() => []),
              api.getCalendarEvents().catch(() => []),
              api.getQueue().catch(() => [])
            ]);

            if (dbBookings) {
              const mappedBookings = dbBookings.map(b => ({
                ...b,
                check_in: parseLocalDate(b.check_in),
                check_out: parseLocalDate(b.check_out),
                created_at: b.created_at ? new Date(b.created_at) : new Date(),
                room: dbRooms ? dbRooms.find(r => r.id === b.room_id) : b.room,
                guest: dbGuests ? dbGuests.find(g => g.id === b.guest_id) : b.guest
              }));
              setBookings(mappedBookings);
            }

            if (dbGuests) {
              setGuests(dbGuests);
            }

            if (dbPricingRules) {
              setPricingRules(dbPricingRules);
            }

            if (dbUsers) {
              setUsers(dbUsers);
            }

            if (dbExpenses) {
              setExpenses(dbExpenses);
            }

            if (dbCalendar) {
              setCalendarEvents(dbCalendar);
            }

            if (dbQueue) {
              setDigitalQueue(dbQueue);
            }

            // Fetch Notifications from DB
            const dbNotifications = await api.getNotifications().catch(() => []);
            if (dbNotifications) {
              setNotifications(dbNotifications);
            }
          }
        }
      } catch (err) {
        console.error("Backend load error:", err);
      }
    };

    fetchBackendData();
  }, [location.pathname]);

  // ========== TOAST NOTIFICATIONS ==========
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ========== NOTIFICATIONS (persistent via Backend) ==========
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    return notification;
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications read", err);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  }, []);

  const clearNotifications = useCallback(async () => {
    try {
      await api.clearNotifications();
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  }, []);

  // ========== REAL-TIME SSE STREAM LISTENER ==========
  useEffect(() => {
    const token = localStorage.getItem('bm_token');
    const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');

    if (!token || !isAdminPage) return;

    // Connect to Notifications SSE stream
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const eventSource = new EventSource(`${baseUrl}/api/notifications/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);

        // Add to state if not exists
        setNotifications(prev => {
          if (prev.some(n => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });

        // Trigger alarm and popup for bookings
        if (notif.type === 'new_booking') {
          addToast(`🔔 ${notif.title}: ${notif.message}`, 'success', 10000);
          setUnacknowledgedBookings(prev => [...prev, notif]);

          // Force a silent background refresh of bookings to get the new booking data
          api.getBookings().then(dbBookings => {
            if (dbBookings) {
              const mappedBookings = dbBookings.map(b => ({
                ...b,
                check_in: parseLocalDate(b.check_in),
                check_out: parseLocalDate(b.check_out),
                created_at: b.created_at ? new Date(b.created_at) : new Date(),
                room: rooms.find(r => r.id === b.room_id) || b.room,
              }));
              setBookings(mappedBookings);
            }
          }).catch(console.error);

        } else if (notif.type === 'booking_update' || notif.type === 'booking') {
          addToast(`📝 ${notif.title}: ${notif.message}`, 'info', 5000);
        } else if (notif.type === 'expense') {
          addToast(`💸 ${notif.title}: ${notif.message}`, 'info', 7000);
          // Refresh expenses
          api.getExpenses().then(dbExpenses => {
            if (dbExpenses) setExpenses(dbExpenses);
          }).catch(console.error);
        } else {
          addToast(`${notif.title}: ${notif.message}`, 'info', 5000);
        }

      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE stream error. Reconnecting...", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [location.pathname, addNotification, addToast, rooms]);

  // ========== SIREN ALARM CONTROLS ==========
  const startAlarmSound = useCallback(() => {
    try {
      if (audioCtxRef.current) return;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);

      osc.start();
      sirenOscRef.current = osc;

      // Auto-resume immediately if interaction already occurred
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
      }

      let toggle = false;
      alarmIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || !sirenOscRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const targetFreq = toggle ? 600 : 1000;
        sirenOscRef.current.frequency.linearRampToValueAtTime(targetFreq, now + 0.3);
        toggle = !toggle;
      }, 350);

    } catch (e) {
      console.log('Audio context blocked by browser:', e);
    }
  }, []);

  const stopAlarmSound = useCallback(() => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (sirenOscRef.current) {
      try { sirenOscRef.current.stop(); } catch (e) { }
      sirenOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) { }
      audioCtxRef.current = null;
    }
  }, []);

  // Global user gesture listener to bypass autoplay restrictions on AudioContext
  useEffect(() => {
    const handleGesture = () => {
      const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');
      if (isAdminPage && unacknowledgedBookings.length > 0) {
        if (!audioCtxRef.current) {
          startAlarmSound();
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().then(() => {
            console.log('AudioContext resumed via user gesture');
          }).catch(() => { });
        }
      }
    };
    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    const handleAcknowledgeAll = () => {
      setUnacknowledgedBookings([]);
      stopAlarmSound();
    };
    window.addEventListener('bm_acknowledge_all', handleAcknowledgeAll);

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('bm_acknowledge_all', handleAcknowledgeAll);
    };
  }, [location.pathname, unacknowledgedBookings, startAlarmSound, stopAlarmSound]);

  // Automatically handle admin/staff-page alarm
  useEffect(() => {
    const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');
    if (isAdminPage && unacknowledgedBookings.length > 0) {
      startAlarmSound();
    } else {
      stopAlarmSound();
    }
    return () => stopAlarmSound();
  }, [location.pathname, unacknowledgedBookings, startAlarmSound, stopAlarmSound]);

  // ========== CROSS-TAB SYNCHRONIZATION & SOUND ==========
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === LS_BOOKINGS) {
        const newBookings = loadFromStorage(LS_BOOKINGS, []);
        const existingIds = new Set(bookings.map(b => b.id));
        const addedBookings = newBookings.filter(b => !existingIds.has(b.id));

        if (addedBookings.length > 0) {
          setBookings(newBookings);
          setRooms(loadFromStorage(LS_ROOMS, INITIAL_ROOMS));
          setGuests(loadFromStorage(LS_GUESTS, INITIAL_GUESTS));
          setNotifications(loadFromStorage(LS_NOTIFICATIONS, []));
          setUnacknowledgedBookings(loadFromStorage(LS_UNACKNOWLEDGED, []));

          addedBookings.forEach(booking => {
            addToast(`🔔 New Booking Received: ${booking.id}!`, 'success', 10000);
          });
        } else {
          setBookings(newBookings);
        }
      } else if (e.key === LS_ROOMS) {
        setRooms(loadFromStorage(LS_ROOMS, INITIAL_ROOMS));
      } else if (e.key === LS_GUESTS) {
        setGuests(loadFromStorage(LS_GUESTS, INITIAL_GUESTS));
      } else if (e.key === LS_NOTIFICATIONS) {
        setNotifications(loadFromStorage(LS_NOTIFICATIONS, []));
      } else if (e.key === LS_PRICING_RULES) {
        setPricingRules(loadFromStorage(LS_PRICING_RULES, INITIAL_RULES));
      } else if (e.key === LS_SPECIAL_OFFERS) {
        setSpecialOffers(loadFromStorage(LS_SPECIAL_OFFERS, INITIAL_OFFERS));
      } else if (e.key === LS_USERS) {
        setUsers(loadFromStorage(LS_USERS, MOCK_USERS));
      } else if (e.key === LS_UNACKNOWLEDGED) {
        setUnacknowledgedBookings(loadFromStorage(LS_UNACKNOWLEDGED, []));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [bookings, addToast]);

  // ========== ROOM INVENTORY OVERLAP CHECKERS (Prevent Double Bookings) ==========
  const isRoomAvailable = useCallback((roomId, checkIn, checkOut, excludeBookingId = null) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || room.status === 'maintenance') return false;

    const reqStart = parseLocalDate(checkIn);
    const reqEnd = parseLocalDate(checkOut);

    // Overlap: A < D && C < B
    const hasOverlap = bookings.some(b => {
      if (b.id === excludeBookingId) return false;
      if (b.status === 'cancelled' || b.status === 'checked_out') return false;
      const bookingRoomId = b.room_id || b.room?.id;
      if (bookingRoomId !== roomId) return false;

      const bStart = parseLocalDate(b.check_in);
      const bEnd = parseLocalDate(b.check_out);

      return reqStart < bEnd && bStart < reqEnd;
    });

    return !hasOverlap;
  }, [bookings, rooms]);

  const isRoomTypeAvailable = useCallback((roomTypeId, checkIn, checkOut) => {
    const matchingRooms = rooms.filter(r => r.room_type_id === roomTypeId);
    return matchingRooms.some(r => isRoomAvailable(r.id, checkIn, checkOut));
  }, [rooms, isRoomAvailable]);

  // ========== BOOKING OPERATIONS ==========
  const createBooking = useCallback(async (bookingData) => {
    try {
      const newBooking = await api.createBooking(bookingData);

      const hydrated = {
        ...newBooking,
        check_in: parseLocalDate(newBooking.check_in),
        check_out: parseLocalDate(newBooking.check_out),
        created_at: newBooking.created_at ? new Date(newBooking.created_at) : new Date()
      };

      setBookings(prev => [hydrated, ...prev]);

      const todayDate = parseLocalDate(new Date().toISOString().split('T')[0]);
      const checkInDate = parseLocalDate(bookingData.checkIn);
      const checkOutDate = parseLocalDate(bookingData.checkOut);
      const isActiveToday = todayDate >= checkInDate && todayDate < checkOutDate;

      if (isActiveToday && hydrated.room) {
        setRooms(prev => prev.map(r => r.id === hydrated.room.id ? { ...r, status: 'reserved' } : r));
      }

      setUnacknowledgedBookings(prev => [...prev, hydrated.id]);

      addNotification({
        type: 'new_booking',
        title: '🔔 New Booking Received!',
        message: `${bookingData.guestName} booked ${hydrated.roomType} — ₹${(hydrated.total_amount || 0).toLocaleString()}`,
        bookingId: hydrated.id,
        priority: 'high'
      });

      addToast(`New booking ${hydrated.id} from ${bookingData.guestName}!`, 'success', 8000);

      sendRealEmailConfirmation({
        id: hydrated.id,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        roomType: hydrated.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalAmount: hydrated.total_amount,
        paymentMethod: bookingData.paymentMethod || 'Pay at Hotel',
        paymentStatus: bookingData.paymentStatus || 'pending',
        paymentSource: bookingData.paymentSource || 'Hotel Desk'
      });

      return { bookingId: hydrated.id, totalAmount: hydrated.total_amount, pricePerNight: hydrated.price_per_night, nights: hydrated.nights, room: hydrated.room };
    } catch (err) {
      console.error("Booking error:", err);
      addToast(`Booking failed: ${err.message}`, 'error');
      throw err;
    }
  }, [addNotification, addToast]);

  const updateBooking = useCallback(async (bookingId, updates) => {
    try {
      const updated = await api.updateBooking(bookingId, updates);
      const hydrated = {
        ...updated,
        check_in: parseLocalDate(updated.check_in),
        check_out: parseLocalDate(updated.check_out),
        created_at: updated.created_at ? new Date(updated.created_at) : new Date()
      };

      setBookings(prev => prev.map(b => b.id === bookingId ? hydrated : b));
      if (hydrated.room) {
        setRooms(prev => prev.map(r => r.id === hydrated.room.id ? hydrated.room : r));
      }
      if (hydrated.guest) {
        setGuests(prev => prev.map(g => g.id === hydrated.guest.id ? hydrated.guest : g));
      }
      addToast(`Booking ${bookingId} updated`, 'info');
    } catch (err) {
      console.error("Error updating booking:", err);
      addToast(`Failed to update booking: ${err.message}`, 'error');
    }
  }, [addToast]);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      const updated = await api.updateBooking(bookingId, { status: 'cancelled' });
      const hydrated = {
        ...updated,
        check_in: parseLocalDate(updated.check_in),
        check_out: parseLocalDate(updated.check_out),
        created_at: updated.created_at ? new Date(updated.created_at) : new Date()
      };

      setBookings(prev => prev.map(b => b.id === bookingId ? hydrated : b));
      if (hydrated.room) {
        setRooms(prev => prev.map(r => r.id === hydrated.room.id ? hydrated.room : r));
      }

      addNotification({
        type: 'booking_cancelled',
        title: '❌ Booking Cancelled',
        message: `Booking ${bookingId} has been cancelled`,
        bookingId,
        priority: 'medium'
      });
      addToast(`Booking ${bookingId} cancelled`, 'warning');
    } catch (err) {
      console.error("Error cancelling booking:", err);
      addToast(`Failed to cancel booking: ${err.message}`, 'error');
    }
  }, [addNotification, addToast]);

  // Acknowledge booking & stop siren if empty
  const acknowledgeBooking = useCallback((bookingId) => {
    setUnacknowledgedBookings(prev => {
      const updated = prev.filter(id => id !== bookingId);
      if (updated.length === 0) {
        stopAlarmSound();
      }
      return updated;
    });
    addToast(`Booking ${bookingId} acknowledged by receptionist`, 'success');
  }, [stopAlarmSound, addToast]);

  // ========== CHECK-IN / CHECK-OUT ==========
  const checkIn = useCallback(async (bookingId) => {
    try {
      const updated = await api.updateBooking(bookingId, { status: 'checked_in' });
      const hydrated = {
        ...updated,
        check_in: parseLocalDate(updated.check_in),
        check_out: parseLocalDate(updated.check_out),
        created_at: updated.created_at ? new Date(updated.created_at) : new Date()
      };

      setBookings(prev => prev.map(b => b.id === bookingId ? hydrated : b));
      if (hydrated.room) {
        setRooms(prev => prev.map(r => r.id === hydrated.room.id ? hydrated.room : r));
      }
      if (hydrated.guest) {
        setGuests(prev => prev.map(g => g.id === hydrated.guest.id ? hydrated.guest : g));
      }

      addNotification({
        type: 'check_in',
        title: '✅ Guest Checked In',
        message: `${hydrated.guest?.name} checked into Room ${hydrated.room?.room_number || 'N/A'}`,
        bookingId,
        priority: 'medium'
      });
      addToast(`${hydrated.guest?.name} checked in successfully`, 'success');
    } catch (err) {
      console.error("Error checking in:", err);
      addToast(`Failed to check in: ${err.message}`, 'error');
    }
  }, [addNotification, addToast]);

  const checkOut = useCallback(async (bookingId, amountPaid = null) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const tax = Math.round(booking.total_amount * 0.12);
      const invoiceTotal = booking.total_amount + tax;
      const finalPaid = amountPaid !== null ? amountPaid : invoiceTotal;

      const updated = await api.updateBooking(bookingId, {
        status: 'checked_out',
        payment_status: 'paid',
        amount_paid: finalPaid
      });

      const hydrated = {
        ...updated,
        check_in: parseLocalDate(updated.check_in),
        check_out: parseLocalDate(updated.check_out),
        created_at: updated.created_at ? new Date(updated.created_at) : new Date()
      };

      setBookings(prev => prev.map(b => b.id === bookingId ? hydrated : b));
      if (hydrated.room) {
        setRooms(prev => prev.map(r => r.id === hydrated.room.id ? hydrated.room : r));
      }

      addNotification({
        type: 'check_out',
        title: '🚪 Guest Checked Out',
        message: `${hydrated.guest?.name} checked out from Room ${hydrated.room?.room_number || 'N/A'}. Room sent for cleaning.`,
        bookingId,
        priority: 'medium'
      });
      addToast(`${hydrated.guest?.name} checked out — room sent for cleaning`, 'info');
    } catch (err) {
      console.error("Error checking out:", err);
      addToast(`Failed to check out: ${err.message}`, 'error');
    }
  }, [bookings, addNotification, addToast]);

  // ========== ROOM OPERATIONS ==========
  const addRoom = useCallback(async (roomData) => {
    try {
      const newRoom = await api.addRoom(roomData);
      setRooms(prev => [...prev, newRoom]);
      addToast(`Room ${roomData.roomNumber} added successfully`, 'success');
    } catch (err) {
      console.error("Error adding room:", err);
      addToast(`Failed to add room: ${err.message}`, 'error');
    }
  }, [addToast]);

  const deleteRoom = useCallback(async (roomId) => {
    try {
      await api.deleteRoom(roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId));
      addToast(`Room deleted`, 'warning');
    } catch (err) {
      console.error("Error deleting room:", err);
      addToast(`Failed to delete room: ${err.message}`, 'error');
    }
  }, [addToast]);

  const updateRoomStatus = useCallback(async (roomId, status) => {
    try {
      await api.updateRoomStatus(roomId, status);
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
      // find the room for the toast
      const room = rooms.find(r => r.id === roomId);
      addToast(`Room ${room?.room_number || ''} status → ${status}`, 'info');
    } catch (err) {
      console.error("Failed to update room status", err);
      addToast("Failed to update room status", "error");
    }
  }, [addToast, rooms]);

  // ========== HOUSEKEEPING ==========
  const markRoomClean = useCallback((roomId) => {
    updateRoomStatus(roomId, 'available').then(() => {
      const room = rooms.find(r => r.id === roomId);
      addNotification({
        type: 'housekeeping',
        title: '🧹 Room Cleaned',
        message: `Room ${room?.room_number || 'N/A'} has been cleaned and is now available`,
        priority: 'low'
      });
    });
  }, [rooms, updateRoomStatus, addNotification]);

  const markRoomMaintenance = useCallback((roomId) => {
    updateRoomStatus(roomId, 'maintenance');
  }, [updateRoomStatus]);

  // ========== PRICING & SPECIAL OFFERS CRUD ==========
  const togglePricingRule = useCallback(async (id) => {
    try {
      const updated = await api.togglePricingRule(id);
      setPricingRules(prev => prev.map(r => r.id === id ? updated : r));
      addToast(`Pricing rule "${updated.name}" ${updated.active ? 'enabled' : 'disabled'}`, 'info');
    } catch (err) {
      console.error("Error toggling pricing rule:", err);
      addToast(`Failed to toggle pricing rule: ${err.message}`, 'error');
    }
  }, [addToast]);

  const addPricingRule = useCallback(async (rule) => {
    try {
      const newRule = await api.addPricingRule(rule);
      setPricingRules(prev => [...prev, newRule]);
      addToast(`Pricing rule "${rule.name}" created`, 'success');
    } catch (err) {
      console.error("Error adding pricing rule:", err);
      addToast(`Failed to create pricing rule: ${err.message}`, 'error');
    }
  }, [addToast]);

  const deletePricingRule = useCallback(async (id) => {
    try {
      await api.deletePricingRule(id);
      setPricingRules(prev => prev.filter(r => r.id !== id));
      addToast(`Pricing rule deleted`, 'warning');
    } catch (err) {
      console.error("Error deleting pricing rule:", err);
      addToast(`Failed to delete pricing rule: ${err.message}`, 'error');
    }
  }, [addToast]);

  // ========== REVENUE CALCULATIONS ==========
  const getRevenueStats = useCallback(() => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const monthStr = format(now, 'yyyy-MM');
    const yearStr = format(now, 'yyyy');

    const activeBookings = bookings.filter(b => b.status !== 'cancelled');

    const todayRevenue = activeBookings
      .filter(b => format(new Date(b.created_at), 'yyyy-MM-dd') === todayStr)
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);

    const monthRevenue = activeBookings
      .filter(b => format(new Date(b.created_at), 'yyyy-MM') === monthStr)
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);

    const yearRevenue = activeBookings
      .filter(b => format(new Date(b.created_at), 'yyyy') === yearStr)
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);

    const totalRevenue = activeBookings
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);

    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const totalRoomsCount = rooms.length;
    const occupancyPercent = totalRoomsCount > 0 ? Math.round((occupiedRooms / totalRoomsCount) * 100) : 0;
    const adr = occupiedRooms > 0 ? Math.round(todayRevenue / occupiedRooms) : 0;
    const revpar = totalRoomsCount > 0 ? Math.round(totalRevenue / totalRoomsCount) : 0;

    return {
      todayRevenue, monthRevenue, yearRevenue, totalRevenue,
      occupiedRooms, totalRooms: totalRoomsCount, occupancyPercent, adr, revpar,
      todayBookingsCount: bookings.filter(b => format(new Date(b.created_at), 'yyyy-MM-dd') === todayStr).length,
    };
  }, [bookings, rooms]);

  // ========== GENERATE INVOICE ==========
  const generateInvoice = useCallback((bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    const nightsCount = booking.nights || Math.max(1, Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24)));
    const basePrice = booking.price_per_night || Math.round(booking.total_amount / nightsCount);
    const subtotal = booking.total_amount;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + tax;
    const amountPaid = (booking.status === 'checked_out' || booking.payment_status === 'paid') ? (booking.amount_paid || total) : (booking.amount_paid || 0);
    const balance = Math.max(0, total - amountPaid);

    return {
      invoiceNumber: `INV-${bookingId}`,
      date: format(new Date(), 'dd/MM/yyyy'),
      hotel: {
        name: 'Bethel Meadows Hotel & Suites',
        address: 'Munnar, Kerala, India',
        phone: '+91 98765 43210',
        email: 'info@bethelmeadows.com',
        gstin: '32AAAAA1111A1Z1'
      },
      guest: booking.guest,
      booking: {
        id: booking.id,
        roomType: booking.room?.room_type?.name || 'Deluxe Room',
        roomNumber: booking.room?.room_number || 'N/A',
        checkIn: format(new Date(booking.check_in), 'dd/MM/yyyy'),
        checkOut: format(new Date(booking.check_out), 'dd/MM/yyyy'),
        nights: nightsCount,
        guests: booking.guests_count,
        pricePerNight: basePrice,
      },
      subtotal,
      tax,
      total,
      amountPaid,
      balance,
      paymentMethod: booking.payment_method || 'Pay at Hotel',
      paymentSource: booking.payment_source || 'Hotel Desk',
      paymentStatus: (booking.status === 'checked_out' || booking.payment_status === 'paid') ? 'paid' : (amountPaid > 0 ? 'partial' : 'pending')
    };
  }, [bookings]);

  // ========== EXPENSES OPERATIONS ==========
  const addExpense = useCallback(async (expenseData) => {
    try {
      const newExpense = await api.addExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      addToast(`Expense for ${expenseData.category} logged successfully`, 'success');
    } catch (err) {
      console.error("Error adding expense:", err);
      addToast(`Failed to add expense: ${err.message}`, 'error');
    }
  }, [addToast]);

  const deleteExpense = useCallback(async (expenseId) => {
    try {
      await api.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      addToast(`Expense deleted`, 'warning');
    } catch (err) {
      console.error("Error deleting expense:", err);
      addToast(`Failed to delete expense: ${err.message}`, 'error');
    }
  }, [addToast]);

  // ========== CALENDAR OPERATIONS ==========
  const addCalendarEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await api.addCalendarEvent(eventData);
      setCalendarEvents(prev => [...prev, newEvent]);
      addToast('Calendar event created', 'success');
    } catch (err) {
      console.error('Error adding event:', err);
      addToast(`Failed to create event: ${err.message}`, 'error');
    }
  }, [addToast]);

  const updateCalendarEvent = useCallback(async (eventId, eventData) => {
    try {
      const updatedEvent = await api.updateCalendarEvent(eventId, eventData);
      setCalendarEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      addToast('Calendar event updated', 'success');
    } catch (err) {
      console.error('Error updating event:', err);
      addToast(`Failed to update event: ${err.message}`, 'error');
    }
  }, [addToast]);

  const deleteCalendarEvent = useCallback(async (eventId) => {
    try {
      await api.deleteCalendarEvent(eventId);
      setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
      addToast('Calendar event deleted', 'info');
    } catch (err) {
      console.error('Error deleting event:', err);
      addToast(`Failed to delete event: ${err.message}`, 'error');
    }
  }, [addToast]);

  // ========== QUEUE OPERATIONS ==========
  const addQueueItem = useCallback(async (queueData) => {
    try {
      const newItem = await api.addQueueItem(queueData);
      setDigitalQueue(prev => [...prev, newItem].sort((a, b) => {
        const priorityScore = { 'urgent': 1, 'high': 2, 'normal': 3, 'low': 4 };
        return (priorityScore[a.priority] || 3) - (priorityScore[b.priority] || 3);
      }));
      addToast('Added to digital queue', 'success');
    } catch (err) {
      console.error('Error adding to queue:', err);
      addToast(`Failed to add to queue: ${err.message}`, 'error');
    }
  }, [addToast]);

  const updateQueueItem = useCallback(async (queueId, queueData) => {
    try {
      const updatedItem = await api.updateQueueItem(queueId, queueData);
      setDigitalQueue(prev => prev.map(q => q.id === queueId ? updatedItem : q));
      addToast('Queue item updated', 'success');
    } catch (err) {
      console.error('Error updating queue item:', err);
      addToast(`Failed to update queue item: ${err.message}`, 'error');
    }
  }, [addToast]);

  const deleteQueueItem = useCallback(async (queueId) => {
    try {
      await api.deleteQueueItem(queueId);
      setDigitalQueue(prev => prev.filter(q => q.id !== queueId));
      addToast('Queue item removed', 'info');
    } catch (err) {
      console.error('Error deleting queue item:', err);
      addToast(`Failed to delete queue item: ${err.message}`, 'error');
    }
  }, [addToast]);


  const value = {
    // Data
    bookings, rooms, guests, notifications, toasts,
    roomTypes, specialOffers,
    pricingRules, users,
    unacknowledgedBookings,
    expenses,
    calendarEvents, digitalQueue,

    // Availability checks
    isRoomAvailable, isRoomTypeAvailable,

    // Booking operations
    createBooking, updateBooking, cancelBooking,
    checkIn, checkOut,
    acknowledgeBooking,

    // Room operations
    addRoom, deleteRoom, updateRoomStatus, markRoomClean, markRoomMaintenance,

    // Pricing rules operations
    addPricingRule, togglePricingRule, deletePricingRule,

    // Expenses operations
    addExpense, deleteExpense,

    // Calendar & Queue operations
    addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
    addQueueItem, updateQueueItem, deleteQueueItem,

    // Notifications
    addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications, deleteNotification,
    addToast, removeToast,

    // Revenue / Invoice
    getRevenueStats, generateInvoice,
    startAlarmSound, stopAlarmSound
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be within DataProvider');
  return ctx;
}
