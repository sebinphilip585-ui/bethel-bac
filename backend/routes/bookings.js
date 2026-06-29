import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from '../../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

let clients = [];

// GET /api/bookings/stream (Real-time updates)
router.get('/stream', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

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

const formatDate = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

async function getFullBooking(id) {
  const b = await query.get(`
    SELECT b.*,
           json_object('id', g.id, 'name', g.name, 'email', g.email, 'phone', g.phone) as guest,
           json_object('id', rt.id, 'name', rt.name) as room_type_data,
           json_object('id', r.id, 'room_number', r.room_number) as room
    FROM bookings b
    LEFT JOIN guests g ON b.guest_id = g.id
    LEFT JOIN rooms r ON b.room_id = r.id
    LEFT JOIN room_types rt ON b.room_type_id = rt.id
    WHERE b.id = ?
  `, [id]);

  if (!b) return null;
  
  b.guest = b.guest ? JSON.parse(b.guest) : null;
  const rt = b.room_type_data ? JSON.parse(b.room_type_data) : null;
  const rm = b.room ? JSON.parse(b.room) : null;
  if (rm && rt) {
    rm.room_type = rt;
  }
  b.room = rm;
  b.roomType = rt ? rt.name : '';
  b.guests_count = parseInt(b.guests_count) || 1;
  b.total_amount = parseFloat(b.total_amount);
  b.amount_paid = parseFloat(b.amount_paid || 0);
  delete b.room_type_data;
  return b;
}

// GET /api/bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await query.all(`
      SELECT b.*,
             json_object('id', g.id, 'name', g.name, 'email', g.email, 'phone', g.phone) as guest,
             json_object('id', rt.id, 'name', rt.name) as room_type_data,
             json_object('id', r.id, 'room_number', r.room_number) as room
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON b.room_type_id = rt.id
      ORDER BY b.created_at DESC
    `);

    const mapped = rows.map(b => {
      b.guest = b.guest ? JSON.parse(b.guest) : null;
      const rt = b.room_type_data ? JSON.parse(b.room_type_data) : null;
      const rm = b.room ? JSON.parse(b.room) : null;
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
    roomTypeId, checkIn, checkOut, guests, totalAmount, amountPaid,
    paymentStatus, paymentMethod, paymentSource, specialRequests, notes
  } = req.body;

  if (!guestName || !guestEmail || !roomTypeId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  try {
    // Guest
    let guest = await query.get('SELECT * FROM guests WHERE email = ? COLLATE NOCASE', [guestEmail]);
    let guestId;
    if (!guest) {
      guestId = crypto.randomUUID();
      await query.run(
        'INSERT INTO guests (id, name, email, phone, id_type, id_number) VALUES (?, ?, ?, ?, ?, ?)',
        [guestId, guestName, guestEmail, guestPhone, guestIdType, guestIdNumber]
      );
    } else {
      guestId = guest.id;
      await query.run(
        'UPDATE guests SET name = COALESCE(?, name), phone = COALESCE(?, phone), id_type = COALESCE(?, id_type), id_number = COALESCE(?, id_number) WHERE id = ?',
        [guestName, guestPhone, guestIdType, guestIdNumber, guestId]
      );
    }

    // Room Allocation
    const candidateRooms = await query.all(`
      SELECT * FROM rooms 
      WHERE room_type_id = ? AND active = 1 AND status != 'maintenance'
    `, [roomTypeId]);

    let assignedRoomId = null;
    if (candidateRooms.length > 0) {
      for (const r of candidateRooms) {
        const overlapping = await query.get(`
          SELECT id FROM bookings 
          WHERE room_id = ? AND status IN ('confirmed', 'checked_in')
          AND ((check_in <= ? AND check_out > ?) OR (check_in < ? AND check_out >= ?) OR (check_in >= ? AND check_out <= ?))
        `, [r.id, checkOut, checkIn, checkOut, checkIn, checkIn, checkOut]);
        if (!overlapping) {
          assignedRoomId = r.id;
          break;
        }
      }
    }

    if (!assignedRoomId) {
      return res.status(400).json({ error: 'No rooms available for the selected dates and room type' });
    }

    const bookingId = crypto.randomUUID();
    const createdBy = req.user?.id || null;
    const finalAmountPaid = parseFloat(amountPaid) || 0;
    const finalTotalAmount = parseFloat(totalAmount) || 0;
    
    // Auto status
    let finalStatus = 'pending';
    let pStatus = paymentStatus || 'pending';
    if (finalAmountPaid >= finalTotalAmount && finalTotalAmount > 0) {
      pStatus = 'paid';
      finalStatus = 'confirmed';
    } else if (finalAmountPaid > 0) {
      pStatus = 'partial';
      finalStatus = 'confirmed';
    } else if (pStatus === 'paid') {
      finalStatus = 'confirmed';
    }

    const source = req.user ? 'staff' : 'direct';

    await query.run(`
      INSERT INTO bookings (
        id, guest_id, room_id, room_type_id, check_in, check_out, guests_count,
        total_amount, amount_paid, payment_status, payment_method, payment_source,
        special_requests, notes, status, source, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookingId, guestId, assignedRoomId, roomTypeId, checkIn, checkOut, parseInt(guests) || 1,
      finalTotalAmount, finalAmountPaid, pStatus, paymentMethod || null, paymentSource || null,
      specialRequests || null, notes || null, finalStatus, source, createdBy
    ]);

    const finalBooking = await getFullBooking(bookingId);

    // Notification
    try {
      const { createNotification } = await import('./notifications.js');
      createNotification(
        'New Booking Received',
        `Booking ${bookingId.substring(0, 8)} created for ${guestName} (${finalBooking.roomType}).`,
        'high',
        'booking',
        '/admin/reservations'
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
    console.error('Error fetching booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PUT /api/bookings/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { room_id, check_in, check_out, status, notes } = req.body;
    await query.run(
      'UPDATE bookings SET room_id = ?, check_in = ?, check_out = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [room_id || null, check_in, check_out, status, notes || null, req.params.id]
    );

    if (room_id && status === 'checked_in') {
      await query.run('UPDATE rooms SET status = ? WHERE id = ?', ['occupied', room_id]);
    }

    const updated = await getFullBooking(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/bookings/:id/status
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { status, room_id } = req.body;
  const bookingId = req.params.id;

  try {
    const current = await query.get('SELECT status, room_id FROM bookings WHERE id = ?', [bookingId]);
    if (!current) return res.status(404).json({ error: 'Booking not found' });

    let sql = 'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP';
    const params = [status];
    
    if (status === 'checked_in') {
      sql += ', actual_check_in = CURRENT_TIMESTAMP';
    } else if (status === 'checked_out') {
      sql += ', actual_check_out = CURRENT_TIMESTAMP';
    }

    sql += ' WHERE id = ?';
    params.push(bookingId);

    await query.run(sql, params);

    // Update room status
    const targetRoomId = room_id || current.room_id;
    if (targetRoomId) {
      if (status === 'checked_in') {
        await query.run('UPDATE rooms SET status = ? WHERE id = ?', ['occupied', targetRoomId]);
      } else if (status === 'checked_out' || status === 'cancelled') {
        await query.run('UPDATE rooms SET status = ? WHERE id = ?', ['cleaning', targetRoomId]);
      }
    }

    try {
      const { createNotification } = await import('./notifications.js');
      let msg = `Booking ${bookingId.substring(0,8)} status changed to ${status}`;
      createNotification('Booking Update', msg, 'low', 'booking', '/admin/reservations');
    } catch(e) {}

    const updated = await getFullBooking(bookingId);
    res.json(updated);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/bookings/:id/payment
router.put('/:id/payment', authenticateToken, async (req, res) => {
  const { amount_paid, payment_status, payment_method, payment_source } = req.body;
  const bookingId = req.params.id;

  try {
    const booking = await query.get('SELECT total_amount, amount_paid FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const newAmount = (booking.amount_paid || 0) + (parseFloat(amount_paid) || 0);
    const newStatus = payment_status || (newAmount >= booking.total_amount ? 'paid' : (newAmount > 0 ? 'partial' : 'pending'));

    await query.run(
      'UPDATE bookings SET amount_paid = ?, payment_status = ?, payment_method = ?, payment_source = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newAmount, newStatus, payment_method || null, payment_source || null, bookingId]
    );

    const updated = await getFullBooking(bookingId);
    res.json(updated);
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
