import express from 'express';
import crypto from 'crypto';
import { query } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/calendar - Get events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const events = await query.all('SELECT * FROM calendar_events ORDER BY start_time ASC');
    res.json(events || []);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/calendar - Create event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, start_time, end_time, type, description, color } = req.body;
    const id = crypto.randomUUID();

    await query.run(
      `INSERT INTO calendar_events (id, title, start_time, end_time, type, description, color, staff_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, start_time, end_time, type || 'meeting', description || null, color || '#3b82f6', req.user.id]
    );

    const newEvent = await query.get('SELECT * FROM calendar_events WHERE id = ?', [id]);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/calendar/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM calendar_events WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
