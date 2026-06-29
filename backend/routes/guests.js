import express from 'express';
import crypto from 'crypto';
import { query } from '../../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/guests - List guests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const guests = await query.all(`
      SELECT g.*, 
        COUNT(b.id) as computed_stays, 
        MAX(b.check_in) as computed_last_stay
      FROM guests g
      LEFT JOIN bookings b ON g.id = b.guest_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);
    
    // Merge computed values
    const processed = guests.map(g => ({
      ...g,
      total_stays: Math.max(g.total_stays || 0, g.computed_stays || 0),
      last_stay: g.computed_last_stay || g.last_stay
    }));

    res.json(processed);
  } catch (err) {
    console.error('Error fetching guests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/guests - Create guest
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, id_type, id_number, address, notes } = req.body;
    const id = crypto.randomUUID();

    await query.run(
      `INSERT INTO guests (id, name, email, phone, id_type, id_number, address, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, phone || null, id_type || null, id_number || null, address || null, notes || null]
    );

    const newGuest = await query.get('SELECT * FROM guests WHERE id = ?', [id]);
    res.status(201).json(newGuest);
  } catch (err) {
    console.error('Error creating guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/guests/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await query.get('SELECT * FROM guests WHERE id = ?', [req.params.id]);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (err) {
    console.error('Error fetching guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
