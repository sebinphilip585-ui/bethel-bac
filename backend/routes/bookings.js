import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

let clients = [];

// GET /api/bookings/stream (Real-time updates)
router.get('/stream', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Access token required' });

  const JWT_SECRET = process.env.JWT_SECRET || 'bethelmeadows-super-secret-key-987';
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const client = { id: Date.now(), res };
  clients.push(client);

  req.on('close', () => {
    clients = clients.filter(c => c.id !== client.id);
  });
});

const broadcastNewBooking = (booking) => {
  clients.forEach(c => {
    try {
      c.res.write(`data: ${JSON.stringify(booking)}\n\n`);
    } catch (e) {
      console.error('Error writing to client:', e);
    }
  });
};

async function getFullBooking(id) {
  const { data: b, error } = await supabase
    .from('bookings')
    .select(`
      *,
      guest:guests (id, name, email, phone),
      room:rooms (id, room_number, room_types (id, name)),
      room_type_data:room_types (id, name)
    `)
    .eq('id', id)
    .single();

  if (error || !b) return null;

  const rt = b.room_type_data;
  const rm = b.room;
  if (rm && rt) {
    rm.room_type = rt;
  }
  
  return {
    ...b,
    room: rm || null,
    guest: b.guest || null,
    roomType: rt?.name || '',
    guests_count: parseInt(b.guests_count) || 1,
    total_amount: parseFloat(b.total_amount),
    amount_paid: parseFloat(b.amount_paid || 0)
  };
}

// GET /api/bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('bookings')
      .select(`
        *,
        guest:guests (id, name, email, phone),
        room:rooms (id, room_number, room_types (id, name)),
        room_type_data:room_types (id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = rows.map(b => {
      const rt = b.room_type_data;
      const rm = b.room;
      if (rm && rt) {
        rm.room_type = rt;
      }
      return {
        ...b,
        guests_count: parseInt(b.guests_count) || 1,
        total_amount: parseFloat(b.total_amount),
        amount_paid: parseFloat(b.amount_paid || 0),
        room: rm || null,
        guest: b.guest || null,
        roomType: rt?.name || ''
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  const {
    guestName, guestEmail, guestPhone, guestIdType, guestIdNumber,
    roomTypeId, checkIn, checkOut, checkInTime, checkOutTime, guests, totalAmount, amountPaid,
    paymentStatus, paymentMethod, paymentSource, specialRequests, notes,
    identity_card, card_details
  } = req.body;

  if (!guestName || !guestEmail || !roomTypeId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  try {
    // Guest
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('email', guestEmail)
      .maybeSingle();

    let guestId;
    if (!existingGuest) {
      guestId = crypto.randomUUID();
      
      const idTypeMap = {
        'aadhaar': 'Aadhaar',
        'passport': 'Passport',
        'driving_license': 'Driving License',
        'voter_id': 'Voter ID'
      };
      const mappedIdType = idTypeMap[guestIdType] || 'Other';
      
      const { error: guestError } = await supabase.from('guests').insert([{
        id: guestId, name: guestName, email: guestEmail, phone: guestPhone,
        id_type: mappedIdType, id_number: guestIdNumber
      }]);
      if (guestError) throw guestError;
    } else {
      guestId = existingGuest.id;
      
      const idTypeMap = {
        'aadhaar': 'Aadhaar',
        'passport': 'Passport',
        'driving_license': 'Driving License',
        'voter_id': 'Voter ID'
      };
      const mappedIdType = idTypeMap[guestIdType] || 'Other';
      
      const { error: updateError } = await supabase.from('guests').update({
        name: guestName, phone: guestPhone, id_type: mappedIdType, id_number: guestIdNumber
      }).eq('id', guestId);
      if (updateError) throw updateError;
    }

    // Room Allocation
    const { data: candidateRooms } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_type_id', roomTypeId)
      .eq('active', true)
      .neq('status', 'maintenance');

    let assignedRoomId = null;
    if (candidateRooms && candidateRooms.length > 0) {
      for (const r of candidateRooms) {
        const { data: overlapping } = await supabase
          .from('bookings')
          .select('id')
          .eq('room_id', r.id)
          .in('status', ['confirmed', 'checked_in'])
          .or(`and(check_in.lte.${checkOut},check_out.gt.${checkIn}),and(check_in.lt.${checkOut},check_out.gte.${checkIn}),and(check_in.gte.${checkIn},check_out.lte.${checkOut})`)
          .limit(1);
          
        if (!overlapping || overlapping.length === 0) {
          assignedRoomId = r.id;
          break;
        }
      }
    }

    if (!assignedRoomId) {
      return res.status(400).json({ error: 'No rooms available for the selected dates and room type' });
    }

    const finalAmountPaid = parseFloat(amountPaid) || 0;
    const finalTotalAmount = parseFloat(totalAmount) || 0;
    
    let finalStatus = 'confirmed';
    let pStatus = paymentStatus || 'pending';
    if (finalAmountPaid >= finalTotalAmount && finalTotalAmount > 0) {
      pStatus = 'paid';
    } else if (finalAmountPaid > 0) {
      pStatus = 'partial';
    }

    const source = req.user ? 'staff' : 'direct';

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const bookingId = `BM-${dateStr}-${randomHex}`;

    let maskedCard = null;
    if (card_details) {
      const digits = card_details.replace(/\D/g, '');
      if (digits.length >= 4) {
        maskedCard = '**** **** **** ' + digits.slice(-4);
      } else {
        maskedCard = '**** **** **** ' + digits;
      }
    }

    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert([{
        id: bookingId, guest_id: guestId, room_id: assignedRoomId, room_type_id: roomTypeId,
        check_in: checkIn, check_in_time: checkInTime || null, check_out: checkOut, check_out_time: checkOutTime || null, guests_count: parseInt(guests) || 1,
        total_amount: finalTotalAmount, amount_paid: finalAmountPaid,
        payment_status: pStatus, special_requests: specialRequests || null, notes: notes || null,
        status: finalStatus, source, created_by: req.user?.id || null,
        identity_card: identity_card || null,
        card_details: maskedCard
      }])
      .select('id')
      .single();

    if (insertError) throw insertError;

    const finalBooking = await getFullBooking(newBooking.id);

    try {
      const { createNotification } = await import('./notifications.js');
      createNotification(
        'New Booking Received',
        `Booking ${newBooking.id} created for ${guestName}. Room: ${finalBooking.roomType}, Dates: ${checkIn} to ${checkOut}, Total: ₹${finalTotalAmount}`,
        'high', 'new_booking', '/admin/reservations'
      );
    } catch (e) {
      console.error('Notification failed', e);
    }

    if (source === 'direct') {
      broadcastNewBooking(finalBooking);
    }

    res.status(201).json(finalBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bookings/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await getFullBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id (Comprehensive update used by frontend)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const updates = { ...req.body };
    const bookingId = req.params.id;
    
    // Fetch current booking state to handle side-effects like room status
    const { data: current } = await supabase.from('bookings').select('status, room_id, total_amount, amount_paid').eq('id', bookingId).single();
    if (!current) return res.status(404).json({ error: 'Booking not found' });

    // Handle timestamps for status changes
    if (updates.status) {
      if (updates.status === 'checked_in' && current.status !== 'checked_in') {
        updates.actual_check_in = new Date().toISOString();
      } else if (updates.status === 'checked_out' && current.status !== 'checked_out') {
        updates.actual_check_out = new Date().toISOString();
      }
    }

    // Handle payment status auto-calc if not explicitly provided but amount_paid is updated
    if (updates.amount_paid !== undefined && !updates.payment_status) {
       const newTotal = updates.total_amount !== undefined ? updates.total_amount : current.total_amount;
       if (updates.amount_paid >= newTotal && newTotal > 0) updates.payment_status = 'paid';
       else if (updates.amount_paid > 0) updates.payment_status = 'partial';
       else updates.payment_status = 'pending';
    }

    // Remove any undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    if (Object.keys(updates).length > 0) {
      await supabase.from('bookings').update(updates).eq('id', bookingId);
    }

    // Handle Room Status side-effects
    const targetRoomId = updates.room_id || current.room_id;
    if (targetRoomId && updates.status && updates.status !== current.status) {
      if (updates.status === 'checked_in') {
        await supabase.from('rooms').update({ status: 'occupied' }).eq('id', targetRoomId);
      } else if (updates.status === 'checked_out' || updates.status === 'cancelled') {
        await supabase.from('rooms').update({ status: 'cleaning' }).eq('id', targetRoomId);
      }
    }

    if (updates.status && updates.status !== current.status) {
      try {
        const { createNotification } = await import('./notifications.js');
        createNotification('Booking Update', `Booking ${bookingId.substring(0,8)} status changed to ${updates.status}`, 'low', 'booking_update', '/admin/reservations');
      } catch(e) {}
    }

    const updated = await getFullBooking(bookingId);
    res.json(updated);
  } catch (err) {
    console.error('Error updating booking (PATCH):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/bookings/:id/status
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { status, room_id } = req.body;
  const bookingId = req.params.id;

  try {
    const { data: current } = await supabase.from('bookings').select('status, room_id').eq('id', bookingId).single();
    if (!current) return res.status(404).json({ error: 'Booking not found' });

    const updates = { status };
    if (status === 'checked_in') updates.actual_check_in = new Date().toISOString();
    else if (status === 'checked_out') updates.actual_check_out = new Date().toISOString();

    await supabase.from('bookings').update(updates).eq('id', bookingId);

    const targetRoomId = room_id || current.room_id;
    if (targetRoomId) {
      if (status === 'checked_in') {
        await supabase.from('rooms').update({ status: 'occupied' }).eq('id', targetRoomId);
      } else if (status === 'checked_out' || status === 'cancelled') {
        await supabase.from('rooms').update({ status: 'cleaning' }).eq('id', targetRoomId);
      }
    }

    try {
      const { createNotification } = await import('./notifications.js');
      createNotification('Booking Update', `Booking ${bookingId.substring(0,8)} status changed to ${status}`, 'low', 'booking_update', '/admin/reservations');
    } catch(e) {}

    const updated = await getFullBooking(bookingId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/bookings/:id/payment
router.put('/:id/payment', authenticateToken, async (req, res) => {
  const { amount_paid, payment_status, payment_method, payment_source } = req.body;
  const bookingId = req.params.id;

  try {
    const { data: booking } = await supabase.from('bookings').select('total_amount, amount_paid').eq('id', bookingId).single();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const newAmount = (booking.amount_paid || 0) + (parseFloat(amount_paid) || 0);
    const newStatus = payment_status || (newAmount >= booking.total_amount ? 'paid' : (newAmount > 0 ? 'partial' : 'pending'));

    await supabase.from('bookings').update({
      amount_paid: newAmount, payment_status: newStatus, payment_method: payment_method || null, payment_source: payment_source || null
    }).eq('id', bookingId);

    const updated = await getFullBooking(bookingId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
