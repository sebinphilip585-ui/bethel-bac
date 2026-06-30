import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/queue - List queue entries
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: queue, error } = await supabase
      .from('digital_queue')
      .select('*');

    if (error) throw error;
    
    // Custom sort: waiting first, then by joined_at
    const sorted = (queue || []).sort((a, b) => {
      if (a.status === 'waiting' && b.status !== 'waiting') return -1;
      if (a.status !== 'waiting' && b.status === 'waiting') return 1;
      return new Date(a.joined_at) - new Date(b.joined_at);
    });

    res.json(sorted);
  } catch (err) {
    console.error('Error fetching queue:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/queue - Join queue
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { token_number, guest_name, purpose, priority, notes } = req.body;
    
    const { data: newEntry, error } = await supabase
      .from('digital_queue')
      .insert([{
        token_number, guest_name, purpose, priority: priority || 'normal', notes: notes || null
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error joining queue:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/queue/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { token_number, guest_name, purpose, priority, notes } = req.body;
    
    const { data: updatedEntry, error } = await supabase
      .from('digital_queue')
      .update({
        token_number, guest_name, purpose, priority: priority || 'normal', notes: notes || null
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedEntry);
  } catch (err) {
    console.error('Error updating queue item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/queue/:id/status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };
    if (status === 'completed' || status === 'cancelled') {
      updates.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('digital_queue')
      .update(updates)
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating queue status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
