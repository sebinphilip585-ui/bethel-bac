require('dotenv').config({ path: '../.env' }); // Load from root
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET all rooms
app.get('/api/rooms', async (req, res) => {
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET specific room
app.get('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET availability
app.get('/api/availability', async (req, res) => {
  const { roomId, checkIn, checkOut } = req.query;
  
  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Check if there are any conflicting bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .not('status', 'eq', 'cancelled')
    .lte('check_in', checkOut)
    .gte('check_out', checkIn);

  if (error) return res.status(500).json({ error: error.message });

  const isAvailable = data.length === 0;
  res.json({ available: isAvailable });
});

// POST create booking
app.post('/api/bookings', async (req, res) => {
  const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut } = req.body;

  if (!roomId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Verify Room Exists & Get Price
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('price_per_night')
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // 2. Check Availability
    const { data: conflicts, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', roomId)
      .not('status', 'eq', 'cancelled')
      .lte('check_in', checkOut)
      .gte('check_out', checkIn);

    if (conflictError) return res.status(500).json({ error: conflictError.message });
    if (conflicts.length > 0) return res.status(400).json({ error: 'Room is not available for these dates' });

    // 3. Calculate Total Price securely
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return res.status(400).json({ error: 'Invalid dates' });

    const totalPrice = diffDays * room.price_per_night;

    // 4. Create Booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          room_id: roomId,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice,
          status: 'confirmed'
        }
      ])
      .select();

    if (bookingError) throw bookingError;

    res.status(201).json({ message: 'Booking confirmed', booking: booking[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
