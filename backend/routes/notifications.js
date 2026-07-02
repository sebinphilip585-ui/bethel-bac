import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
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
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([{
        title, message, priority, type, link
      }])
      .select()
      .single();

    if (error) throw error;

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
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(notifications || []);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
