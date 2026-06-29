import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Middleware to ensure only admins can manage staff (except viewing their own profile)
const requireAdmin = authorizeRoles('admin');

// GET /api/users
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, phone, active, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
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
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    const { data: newUser, error } = await supabase
      .from('profiles')
      .insert([{ id, name, email, role, phone: phone || null, password_hash }])
      .select('id, name, email, role, phone, active')
      .single();

    if (error) throw error;
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
    const updates = { name, role, active: !!active, phone: phone || null, updated_at: new Date().toISOString() };

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, name, email, role, phone, active')
      .single();

    if (error) throw error;
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

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
