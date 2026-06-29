import express from 'express';
import crypto from 'crypto';
import { query } from '../../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

let clients = [];

// GET /api/notifications/stream (Real-time updates)
router.get('/stream', (req, res) => {
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

export const createNotification = async (title, message, priority, type, link) => {
  const id = crypto.randomUUID();
  try {
    await query.run(
      'INSERT INTO notifications (id, title, message, priority, type, link) VALUES (?, ?, ?, ?, ?, ?)',
      [id, title, message, priority, type, link]
    );

    const notification = await query.get('SELECT * FROM notifications WHERE id = ?', [id]);

    // Broadcast to SSE clients
    clients.forEach(c => {
      try {
        c.res.write(`data: ${JSON.stringify(notification)}\n\n`);
      } catch (e) {
        console.error('Error writing notification to client:', e);
      }
    });

    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
    throw err;
  }
};

// GET /api/notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await query.all('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    res.json(notifications || []);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    await query.run('UPDATE notifications SET read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await query.run('UPDATE notifications SET read = 1 WHERE read = 0');
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
