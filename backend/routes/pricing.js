import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pricing/rules - Get all pricing rules
router.get('/rules', authenticateToken, async (req, res) => {
  try {
    const { data: rules, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
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
    
    const { data: newRule, error } = await supabase
      .from('pricing_rules')
      .insert([{
        name, type, multiplier, start_date: start_date || null, end_date: end_date || null,
        threshold: threshold || null, description: description || null, active: active !== false
      }])
      .select()
      .single();

    if (error) throw error;
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
    const { error } = await supabase
      .from('pricing_rules')
      .update({ active: !!active })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating rule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/pricing/rules/:id
router.delete('/rules/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('pricing_rules')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting rule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/pricing/offers - Get all special offers
router.get('/offers', async (req, res) => {
  try {
    const { data: offers, error } = await supabase
      .from('special_offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && error.code !== '42P01') throw error; // Ignore table not found
    res.json(offers || []);
  } catch (err) {
    console.error('Error fetching special offers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/pricing/offers - Create special offer
router.post('/offers', authenticateToken, async (req, res) => {
  try {
    const { title, description, discount_percent, code, valid_from, valid_to, min_stay } = req.body;

    const { data: newOffer, error } = await supabase
      .from('special_offers')
      .insert([{
        title, description, discount_percent, code, valid_from: valid_from || null,
        valid_to: valid_to || null, min_stay: min_stay || 1
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newOffer);
  } catch (err) {
    console.error('Error creating offer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/pricing/offers/:id
router.delete('/offers/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('special_offers')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
