import express from 'express';
import crypto from 'crypto';
import { query } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/queue - List queue entries
router.get('/', authenticateToken, async (req, res) => {
  try {
    const queue = await query.all('SELECT * FROM digital_queue ORDER BY CASE WHEN status = \'waiting\' THEN 0 ELSE 1 END, joined_at ASC');
    res.json(queue || []);
  } catch (err) {
    console.error('Error fetching queue:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/queue - Join queue
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { token_number, guest_name, purpose, priority, notes } = req.body;
    const id = crypto.randomUUID();

    await query.run(
      `INSERT INTO digital_queue (id, token_number, guest_name, purpose, priority, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, token_number, guest_name, purpose, priority || 'normal', notes || null]
    );

    const newEntry = await query.get('SELECT * FROM digital_queue WHERE id = ?', [id]);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error joining queue:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/queue/:id/status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    let sql = 'UPDATE digital_queue SET status = ?';
    if (status === 'completed' || status === 'cancelled') {
      sql += ', completed_at = CURRENT_TIMESTAMP';
    }
    sql += ' WHERE id = ?';
    
    await query.run(sql, [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating queue status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
