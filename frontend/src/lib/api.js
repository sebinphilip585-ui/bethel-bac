// Custom fetch-based API client for our Express backend
const getToken = () => localStorage.getItem('bm_token');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorData = {};
    if (response.status !== 204) {
      errorData = await response.json().catch(() => ({}));
    }
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  login: (email, password) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  signup: (name, email, password, role) => apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  }),
  getMe: () => apiRequest('/api/auth/me'),

  // Rooms & Room Types
  getRooms: () => apiRequest('/api/rooms'),
  getRoomTypes: () => apiRequest('/api/rooms/types'),
  addRoom: (roomData) => apiRequest('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),
  updateRoomStatus: (roomId, status) => apiRequest(`/api/rooms/${roomId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  deleteRoom: (roomId) => apiRequest(`/api/rooms/${roomId}`, {
    method: 'DELETE',
  }),

  // Bookings
  getBookings: () => apiRequest('/api/bookings'),
  createBooking: (bookingData) => apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  updateBooking: (bookingId, updates) => apiRequest(`/api/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),

  // Guests
  getGuests: () => apiRequest('/api/guests'),
  getGuest: (guestId) => apiRequest(`/api/guests/${guestId}`),
  updateGuest: (guestId, updates) => apiRequest(`/api/guests/${guestId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),

  // Pricing & Offers
  getPricingRules: () => apiRequest('/api/pricing/rules'),
  addPricingRule: (rule) => apiRequest('/api/pricing/rules', {
    method: 'POST',
    body: JSON.stringify(rule),
  }),
  togglePricingRule: (ruleId) => apiRequest(`/api/pricing/rules/${ruleId}/toggle`, {
    method: 'PATCH',
  }),
  deletePricingRule: (ruleId) => apiRequest(`/api/pricing/rules/${ruleId}`, {
    method: 'DELETE',
  }),

  getSpecialOffers: () => apiRequest('/api/pricing/offers'),
  addSpecialOffer: (offer) => apiRequest('/api/pricing/offers', {
    method: 'POST',
    body: JSON.stringify(offer),
  }),
  toggleSpecialOffer: (offerId) => apiRequest(`/api/pricing/offers/${offerId}/toggle`, {
    method: 'PATCH',
  }),
  deleteSpecialOffer: (offerId) => apiRequest(`/api/pricing/offers/${offerId}`, {
    method: 'DELETE',
  }),

  // Staff Users
  getUsers: () => apiRequest('/api/users'),
  addUser: (userData) => apiRequest('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  toggleUser: (userId) => apiRequest(`/api/users/${userId}/toggle`, {
    method: 'PATCH',
  }),

  // Expenses
  getExpenses: () => apiRequest('/api/expenses'),
  addExpense: (expenseData) => apiRequest('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  }),
  deleteExpense: (expenseId) => apiRequest(`/api/expenses/${expenseId}`, {
    method: 'DELETE',
  }),

  // Calendar
  getCalendarEvents: () => apiRequest('/api/calendar'),
  addCalendarEvent: (eventData) => apiRequest('/api/calendar', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  updateCalendarEvent: (eventId, eventData) => apiRequest(`/api/calendar/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  deleteCalendarEvent: (eventId) => apiRequest(`/api/calendar/${eventId}`, {
    method: 'DELETE',
  }),

  // Digital Queue
  getQueue: () => apiRequest('/api/queue'),
  addQueueItem: (queueData) => apiRequest('/api/queue', {
    method: 'POST',
    body: JSON.stringify(queueData),
  }),
  updateQueueItem: (queueId, queueData) => apiRequest(`/api/queue/${queueId}`, {
    method: 'PUT',
    body: JSON.stringify(queueData),
  }),
  deleteQueueItem: (queueId) => apiRequest(`/api/queue/${queueId}`, {
    method: 'DELETE',
  }),

  // Notifications
  getNotifications: () => apiRequest('/api/notifications'),
  markNotificationRead: (id) => apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => apiRequest('/api/notifications/read-all', { method: 'PATCH' }),
  deleteNotification: (id) => apiRequest(`/api/notifications/${id}`, { method: 'DELETE' }),
  clearNotifications: () => apiRequest('/api/notifications/clear', { method: 'DELETE' }),
};

export const isMockMode = false;


// ============================================================
// MOCK DATA - Used when Supabase is not configured
// ============================================================

export const ROOM_TYPES = [
  {
    id: 'rt-beckingham',
    name: 'Beckingham',
    slug: 'beckingham',
    description: 'A luxurious 2BHK suite designed for elegance and comfort. Enjoy spacious living with premium amenities.',
    short_description: 'Premium 2BHK luxury suite',
    base_price: 4500,
    max_guests: 4,
    size_sqft: 600,
    bed_type: '2 King Beds',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Equipped Kitchen', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-living.jpg', '/images/rooms/room-bed.jpg', '/images/rooms/room-tv.jpg'],
    featured: true,
    count: 1
  },
  {
    id: 'rt-beverly',
    name: 'Beverly Hills',
    slug: 'beverly-hills',
    description: 'An exquisite 2BHK apartment offering panoramic views and top-tier hospitality for a memorable stay.',
    short_description: 'Exquisite 2BHK apartment',
    base_price: 4500,
    max_guests: 4,
    size_sqft: 600,
    bed_type: '2 King Beds',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Equipped Kitchen', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-sofa.jpg', '/images/rooms/room-bed.jpg', '/images/rooms/room-ac.jpg'],
    featured: true,
    count: 1
  },
  {
    id: 'rt-belrose',
    name: 'Belrose',
    slug: 'belrose',
    description: 'A cozy and elegant 1BHK unit perfect for couples or solo travelers seeking a peaceful retreat.',
    short_description: 'Elegant 1BHK retreat',
    base_price: 2500,
    max_guests: 2,
    size_sqft: 350,
    bed_type: '1 King Bed',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-bed.jpg', '/images/rooms/room-tv.jpg'],
    featured: true,
    count: 1
  },
  {
    id: 'rt-blooms',
    name: 'Blooms Bay',
    slug: 'blooms-bay',
    description: 'A modern 2BHK suite with a spacious living area and premium furnishings for an elevated experience.',
    short_description: 'Modern 2BHK with premium furnishings',
    base_price: 4500,
    max_guests: 4,
    size_sqft: 600,
    bed_type: '2 King Beds',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Equipped Kitchen', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-living.jpg', '/images/rooms/room-ac.jpg'],
    featured: false,
    count: 1
  },
  {
    id: 'rt-bluebell',
    name: 'Blue Bell',
    slug: 'blue-bell',
    description: 'A serene 1BHK unit combining simplicity with luxury, offering a restful stay amidst nature.',
    short_description: 'Serene 1BHK stay',
    base_price: 2500,
    max_guests: 2,
    size_sqft: 350,
    bed_type: '1 King Bed',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-bed.jpg', '/images/rooms/room-sofa.jpg'],
    featured: false,
    count: 1
  },
  {
    id: 'rt-beehive',
    name: 'Beehive',
    slug: 'beehive',
    description: 'A warm and inviting 1BHK suite equipped with all modern amenities for a comfortable extended stay.',
    short_description: 'Inviting 1BHK suite',
    base_price: 2500,
    max_guests: 2,
    size_sqft: 350,
    bed_type: '1 King Bed',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-tv.jpg', '/images/rooms/room-bed.jpg'],
    featured: false,
    count: 1
  },
  {
    id: 'rt-belarus',
    name: 'Belarus',
    slug: 'belarus',
    description: 'Our most expansive 3BHK suite, perfect for large families or groups. Features a massive living area, full kitchen, and premium touches.',
    short_description: 'Expansive 3BHK family suite',
    base_price: 6500,
    max_guests: 6,
    size_sqft: 1200,
    bed_type: '3 King Beds',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Equipped Kitchen', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water', 'Dining Area'],
    images: ['/images/rooms/room-living.jpg', '/images/rooms/room-bed.jpg', '/images/rooms/room-tv.jpg'],
    featured: true,
    count: 1
  },
  {
    id: 'rt-breeze',
    name: 'Breeze Garden',
    slug: 'breeze-garden',
    description: 'A delightful 1BHK with garden views, blending contemporary design with natural tranquility.',
    short_description: '1BHK with tranquil vibes',
    base_price: 2500,
    max_guests: 2,
    size_sqft: 350,
    bed_type: '1 King Bed',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-bed.jpg', '/images/rooms/room-ac.jpg'],
    featured: false,
    count: 1
  },
  {
    id: 'rt-brook',
    name: 'Brook Hills',
    slug: 'brook-hills',
    description: 'A luxurious 1BHK unit featuring premium fittings, comfortable bedding, and dedicated workspace.',
    short_description: 'Luxurious 1BHK unit',
    base_price: 2500,
    max_guests: 2,
    size_sqft: 350,
    bed_type: '1 King Bed',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-bed.jpg', '/images/rooms/room-sofa.jpg'],
    featured: false,
    count: 1
  },
  {
    id: 'rt-bliss',
    name: 'Bliss Heaven',
    slug: 'bliss-heaven',
    description: 'A beautifully curated 1BHK suite for a heavenly stay. Designed to help you relax and rejuvenate.',
    short_description: 'Beautifully curated 1BHK',
    base_price: 2500,
    max_guests: 2,
    size_sqft: 350,
    bed_type: '1 King Bed',
    facilities: ['Air Conditioning', 'Fully Furnished', 'Smart TV', 'Free WiFi', 'Attached Bathroom', 'Hot Water'],
    images: ['/images/rooms/room-tv.jpg', '/images/rooms/room-bed.jpg'],
    featured: false,
    count: 1
  }
];

export const ROOMS = [];
let roomNum = 101;
ROOM_TYPES.forEach(rt => {
  for (let i = 0; i < rt.count; i++) {
    ROOMS.push({
      id: `room-${roomNum}`,
      room_number: String(roomNum),
      room_type_id: rt.id,
      room_type: rt,
      floor: Math.floor(roomNum / 100),
      status: 'available',
      price: rt.base_price
    });
    roomNum++;
  }
});

// Generate some mock bookings
const today = new Date();
export const MOCK_BOOKINGS = [
  {
    id: 'BM-20260626-0001',
    guest: { id: 'g-1', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 98765 43210', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-1234' },
    room: ROOMS[0],
    check_in: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    check_out: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    guests_count: 2,
    status: 'confirmed',
    total_amount: 10500,
    amount_paid: 0,
    payment_status: 'pending',
    payment_method: 'Pay at Hotel',
    payment_source: 'Hotel Desk',
    created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    source: 'direct',
    notes: ''
  },
  {
    id: 'BM-20260626-0002',
    guest: { id: 'g-2', name: 'Priya Menon', email: 'priya@email.com', phone: '+91 87654 32109', id_type: 'Passport', id_number: 'M1234567' },
    room: ROOMS[6],
    check_in: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    check_out: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    guests_count: 2,
    status: 'checked_in',
    total_amount: 11000,
    amount_paid: 11000,
    payment_status: 'paid',
    payment_method: 'UPI',
    payment_source: 'UPI ID: priya@okaxis',
    created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
    source: 'direct',
    notes: 'Anniversary celebration'
  },
  {
    id: 'BM-20260625-0003',
    guest: { id: 'g-3', name: 'Amit Sharma', email: 'amit@email.com', phone: '+91 76543 21098', id_type: 'Driving License', id_number: 'DL-12345' },
    room: ROOMS[12],
    check_in: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    check_out: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    guests_count: 3,
    status: 'checked_in',
    total_amount: 7500,
    amount_paid: 7500,
    payment_status: 'paid',
    payment_method: 'Card',
    payment_source: 'Visa card ending in 8901',
    created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
    source: 'direct',
    notes: ''
  },
  {
    id: 'BM-20260627-0004',
    guest: { id: 'g-4', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+91 65432 10987', id_type: 'Passport', id_number: 'US12345678' },
    room: ROOMS[3],
    check_in: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    check_out: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
    guests_count: 1,
    status: 'confirmed',
    total_amount: 10500,
    amount_paid: 10500,
    payment_status: 'paid',
    payment_method: 'UPI',
    payment_source: 'UPI ID: sarah.j@okaxis',
    created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    source: 'direct',
    notes: 'Late check-in expected'
  },
  {
    id: 'BM-20260624-0005',
    guest: { id: 'g-5', name: 'Mohammed Ali', email: 'mali@email.com', phone: '+91 54321 09876', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-5678' },
    room: ROOMS[10],
    check_in: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    check_out: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    guests_count: 2,
    status: 'checked_out',
    total_amount: 9000,
    amount_paid: 9000,
    payment_status: 'paid',
    payment_method: 'Cash',
    payment_source: 'Hotel Desk',
    created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
    source: 'direct',
    notes: ''
  }
];

export const MOCK_GUESTS = MOCK_BOOKINGS.map(b => ({
  ...b.guest,
  bookings: [b],
  total_stays: 1 + Math.floor(Math.random() * 5),
  last_stay: b.check_out
}));

export const SPECIAL_OFFERS = [
  {
    id: 'offer-1',
    title: 'Early Bird Special',
    description: 'Book 30 days in advance and save 20% on all room types. Plan ahead for the perfect getaway!',
    discount_percent: 20,
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
    code: 'EARLYBIRD20',
    min_stay: 2,
    active: true
  },
  {
    id: 'offer-2',
    title: 'Weekend Escape',
    description: 'Enjoy a special weekend package with complimentary breakfast and late checkout at 2 PM.',
    discount_percent: 15,
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
    code: 'WEEKEND15',
    min_stay: 2,
    active: true
  },
  {
    id: 'offer-3',
    title: 'Extended Stay Offer',
    description: 'Stay 5 nights or more and get the 5th night absolutely free. Perfect for long vacations!',
    discount_percent: 20,
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
    code: 'STAY5FREE',
    min_stay: 5,
    active: true
  },
  {
    id: 'offer-4',
    title: 'Monsoon Magic',
    description: 'Experience the beauty of monsoon season with 25% off on all suites. Let the rain be your backdrop.',
    discount_percent: 25,
    valid_from: '2026-06-01',
    valid_to: '2026-09-30',
    code: 'MONSOON25',
    min_stay: 1,
    active: true
  }
];

export const PRICING_RULES = [
  { id: 'pr-1', name: 'Weekend Rate', type: 'weekend', multiplier: 1.2, description: '20% increase on Fri-Sat-Sun', active: true },
  { id: 'pr-2', name: 'Peak Season', type: 'season', multiplier: 1.35, start_date: '2026-10-01', end_date: '2027-01-31', description: '35% increase Oct-Jan', active: true },
  { id: 'pr-3', name: 'Off Season', type: 'season', multiplier: 0.85, start_date: '2026-06-01', end_date: '2026-09-30', description: '15% discount Jun-Sep', active: true },
  { id: 'pr-4', name: 'High Occupancy', type: 'occupancy', threshold: 80, multiplier: 1.25, description: '25% increase above 80% occupancy', active: true },
  { id: 'pr-5', name: 'Low Occupancy', type: 'occupancy', threshold: 30, multiplier: 0.8, description: '20% discount below 30% occupancy', active: true }
];

// Helper function to calculate dynamic price
export function calculateDynamicPrice(basePrice, checkIn, occupancyPercent = 50) {
  let price = basePrice;
  const checkInDate = new Date(checkIn);
  const dayOfWeek = checkInDate.getDay();
  const month = checkInDate.getMonth();

  // Weekend pricing (Fri=5, Sat=6, Sun=0)
  if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
    price *= 1.2;
  }

  // Seasonal pricing
  if (month >= 9 || month === 0) { // Oct-Jan peak
    price *= 1.35;
  } else if (month >= 5 && month <= 8) { // Jun-Sep off season
    price *= 0.85;
  }

  // Occupancy-based pricing
  if (occupancyPercent > 80) {
    price *= 1.25;
  } else if (occupancyPercent < 30) {
    price *= 0.8;
  }

  return Math.round(price);
}

// Mock staff users
export const MOCK_USERS = [
  { id: 'u-1', name: 'Admin User', email: 'admin@bethelmeadows.com', role: 'admin', active: true },
  { id: 'u-2', name: 'Manager One', email: 'manager@bethelmeadows.com', role: 'manager', active: true },
  { id: 'u-3', name: 'Reception Staff', email: 'reception@bethelmeadows.com', role: 'receptionist', active: true }
];
