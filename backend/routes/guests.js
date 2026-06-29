import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/guests - List guests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*, bookings (id, check_in)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Merge computed values
    const processed = guests.map(g => {
      const bks = g.bookings || [];
      let last_stay = null;
      if (bks.length > 0) {
        last_stay = bks.map(b => b.check_in).sort().reverse()[0];
      }
      const bksCount = bks.length;
      
      const gWithoutBookings = { ...g };
      delete gWithoutBookings.bookings;
      
      return {
        ...gWithoutBookings,
        total_stays: Math.max(g.total_stays || 0, bksCount),
        last_stay: last_stay || g.last_stay
      };
    });

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
    
    const { data: newGuest, error } = await supabase
      .from('guests')
      .insert([{
        name, email, phone: phone || null, id_type: id_type || null,
        id_number: id_number || null, address: address || null, notes: notes || null
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newGuest);
  } catch (err) {
    console.error('Error creating guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/guests/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error || !guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (err) {
    console.error('Error fetching guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
