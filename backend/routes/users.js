import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../database/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Middleware to ensure only admins can manage staff (except viewing their own profile)
const requireAdmin = authorizeRoles('admin');

// GET /api/users
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await query.all('SELECT id, name, email, role, phone, active, created_at FROM profiles ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, email, role, password, phone } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: 'Name, email, role, and password are required' });
  }

  try {
    // Check if user exists
    const existing = await query.get('SELECT id FROM profiles WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await query.run(
      'INSERT INTO profiles (id, name, email, role, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, role, phone || null, password_hash]
    );

    const newUser = await query.get('SELECT id, name, email, role, phone, active FROM profiles WHERE id = ?', [id]);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { name, role, active, phone, password } = req.body;
  const userId = req.params.id;

  try {
    let sql = 'UPDATE profiles SET name = ?, role = ?, active = ?, phone = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [name, role, active ? 1 : 0, phone || null];

    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      sql += ', password_hash = ?';
      params.push(password_hash);
    }

    sql += ' WHERE id = ?';
    params.push(userId);

    await query.run(sql, params);

    const updatedUser = await query.get('SELECT id, name, email, role, phone, active FROM profiles WHERE id = ?', [userId]);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await query.run('DELETE FROM profiles WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
