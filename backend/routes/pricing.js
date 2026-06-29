import express from 'express';
import crypto from 'crypto';
import { query } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pricing/rules - Get all pricing rules
router.get('/rules', authenticateToken, async (req, res) => {
  try {
    const rules = await query.all('SELECT * FROM pricing_rules ORDER BY created_at DESC');
    res.json(rules);
  } catch (err) {
    console.error('Error fetching pricing rules:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/pricing/rules - Create a new rule
router.post('/rules', authenticateToken, async (req, res) => {
  try {
    const { name, type, multiplier, start_date, end_date, threshold, description, active } = req.body;
    const id = crypto.randomUUID();
    
    await query.run(
      `INSERT INTO pricing_rules (id, name, type, multiplier, start_date, end_date, threshold, description, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, type, multiplier, start_date || null, end_date || null, threshold || null, description || null, active === false ? 0 : 1]
    );
    
    const newRule = await query.get('SELECT * FROM pricing_rules WHERE id = ?', [id]);
    res.status(201).json(newRule);
  } catch (err) {
    console.error('Error creating pricing rule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/pricing/rules/:id - Update a rule
router.put('/rules/:id', authenticateToken, async (req, res) => {
  try {
    const { active } = req.body;
    await query.run('UPDATE pricing_rules SET active = ? WHERE id = ?', [active ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating rule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/pricing/rules/:id
router.delete('/rules/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM pricing_rules WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting rule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/pricing/offers - Get all special offers
router.get('/offers', authenticateToken, async (req, res) => {
  try {
    const offers = await query.all('SELECT * FROM special_offers ORDER BY created_at DESC');
    res.json(offers || []);
  } catch (err) {
    // If the table is missing because it wasn't added in dbInit, return empty array rather than crash
    if (err.message.includes('no such table')) {
      return res.json([]);
    }
    console.error('Error fetching special offers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/pricing/offers - Create special offer
router.post('/offers', authenticateToken, async (req, res) => {
  try {
    const { title, description, discount_percent, code, valid_from, valid_to, min_stay } = req.body;
    const id = crypto.randomUUID();

    // Check table exists or create it if omitted
    await query.run(`
      CREATE TABLE IF NOT EXISTS special_offers (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, discount_percent INTEGER,
        discount_amount REAL, code TEXT UNIQUE NOT NULL, valid_from TEXT, valid_to TEXT,
        min_stay INTEGER DEFAULT 1, max_uses INTEGER, current_uses INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query.run(
      `INSERT INTO special_offers (id, title, description, discount_percent, code, valid_from, valid_to, min_stay) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, discount_percent, code, valid_from || null, valid_to || null, min_stay || 1]
    );

    const newOffer = await query.get('SELECT * FROM special_offers WHERE id = ?', [id]);
    res.status(201).json(newOffer);
  } catch (err) {
    console.error('Error creating offer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/pricing/offers/:id
router.delete('/offers/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM special_offers WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
