import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/rooms - Get all rooms with their types
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        id, room_number, floor, status, active, room_type_id,
        room_types (
          id, name, description, base_price, capacity, size, bed_type, facilities, images
        )
      `)
      .order('room_number', { ascending: true });

    if (error) throw error;

    const parsedRooms = rooms.map(r => ({
      ...r,
      room_type: r.room_types
    }));

    res.json(parsedRooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rooms/types - Get all room types
router.get('/types', authenticateToken, async (req, res) => {
  try {
    const { data: types, error } = await supabase
      .from('room_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(types);
  } catch (err) {
    console.error('Error fetching room types:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rooms/types - Create room type
router.post('/types', authenticateToken, async (req, res) => {
  try {
    const { name, description, base_price, capacity, size, bed_type, facilities } = req.body;
    
    const { data: newType, error } = await supabase
      .from('room_types')
      .insert([{
        name, description, base_price, capacity, size, bed_type, 
        facilities: facilities || []
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newType);
  } catch (err) {
    console.error('Error creating room type:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rooms - Create a room
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { room_number, room_type_id, floor } = req.body;
    
    // Check existing
    const { data: existing } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_number', room_number)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Room number already exists' });
    }

    const { data: newRoom, error: insertError } = await supabase
      .from('rooms')
      .insert([{ room_number, room_type_id, floor }])
      .select(`
        *,
        room_types (id, name, base_price)
      `)
      .single();

    if (insertError) throw insertError;
    
    newRoom.room_type = newRoom.room_types;
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/rooms/:id/status - Update room status
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  try {
    const { error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating room status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/rooms/:id - Delete a room
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
