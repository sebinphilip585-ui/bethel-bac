import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bethelmeadows-super-secret-key-987';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { error: 'Too many login attempts, please try again after 15 minutes' }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.active === 0 || user.active === false) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...profile } = user;
    res.json({ token, user: profile });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const assignedRole = role || 'manager';
    const newId = crypto.randomUUID();

    const { data: newUser, error } = await supabase
      .from('profiles')
      .insert([{ id: newId, name, email, role: assignedRole, password_hash }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: newUser.id, name, email, role: assignedRole, active: 1 } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.active === 0 || user.active === false) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    const { password_hash, ...profile } = user;
    res.json({ user: profile });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/stats (Public endpoint for login page)
router.get('/stats', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    res.json({ pendingBookings: count || 0 });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
