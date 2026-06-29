import express from 'express';
import crypto from 'crypto';
import { query } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/rooms - Get all rooms with their types
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rooms = await query.all(`
      SELECT 
        r.id, r.room_number, r.floor, r.status, r.active, r.room_type_id,
        json_object(
          'id', rt.id,
          'name', rt.name,
          'description', rt.description,
          'base_price', rt.base_price,
          'capacity', rt.capacity,
          'size', rt.size,
          'bed_type', rt.bed_type,
          'facilities', rt.facilities,
          'images', rt.images
        ) as room_type
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY r.room_number ASC
    `);

    // Parse the JSON string from sqlite json_object
    const parsedRooms = rooms.map(r => ({
      ...r,
      room_type: r.room_type ? JSON.parse(r.room_type) : null
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
    const types = await query.all('SELECT * FROM room_types ORDER BY name ASC');
    // parse JSON arrays
    const parsedTypes = types.map(t => ({
      ...t,
      facilities: JSON.parse(t.facilities || '[]'),
      images: JSON.parse(t.images || '[]')
    }));
    res.json(parsedTypes);
  } catch (err) {
    console.error('Error fetching room types:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rooms/types - Create room type
router.post('/types', authenticateToken, async (req, res) => {
  try {
    const { name, description, base_price, capacity, size, bed_type, facilities } = req.body;
    const id = crypto.randomUUID();
    
    await query.run(
      `INSERT INTO room_types (id, name, description, base_price, capacity, size, bed_type, facilities) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description, base_price, capacity, size, bed_type, JSON.stringify(facilities || [])]
    );
    
    const newType = await query.get('SELECT * FROM room_types WHERE id = ?', [id]);
    newType.facilities = JSON.parse(newType.facilities || '[]');
    newType.images = JSON.parse(newType.images || '[]');
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
    
    const existing = await query.get('SELECT id FROM rooms WHERE room_number = ?', [room_number]);
    if (existing) {
      return res.status(400).json({ error: 'Room number already exists' });
    }

    const id = crypto.randomUUID();
    await query.run(
      'INSERT INTO rooms (id, room_number, room_type_id, floor) VALUES (?, ?, ?, ?)',
      [id, room_number, room_type_id, floor]
    );

    const newRoom = await query.get(`
      SELECT 
        r.*,
        json_object(
          'id', rt.id,
          'name', rt.name,
          'base_price', rt.base_price
        ) as room_type
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ?
    `, [id]);
    
    newRoom.room_type = newRoom.room_type ? JSON.parse(newRoom.room_type) : null;
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
    await query.run('UPDATE rooms SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating room status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/rooms/:id - Delete a room
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
