import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/calendar - Get events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;
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
    
    const { data: newEvent, error } = await supabase
      .from('calendar_events')
      .insert([{
        title, start_time, end_time, type: type || 'meeting',
        description: description || null, color: color || '#3b82f6', staff_id: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/calendar/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
