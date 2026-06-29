import express from 'express';
import crypto from 'crypto';
import { supabase } from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/expenses - List all expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*, profiles(name)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = expenses.map(e => ({
      ...e,
      creator_name: e.profiles ? e.profiles.name : null
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { category, amount, description, date, vendor_name, payment_status } = req.body;
    
    const { data: newExpense, error } = await supabase
      .from('expenses')
      .insert([{
        category, amount, description: description || null, date,
        vendor_name: vendor_name || null, payment_status: payment_status || 'Paid',
        created_by: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;

    try {
      const { createNotification } = await import('./notifications.js');
      createNotification(
        'New Property Expense',
        `An expense of ₹${amount} was recorded under ${category}.`,
        'low', 'expense', '/admin/expenses'
      );
    } catch (e) {
      console.error('Failed to trigger expense notification', e);
    }

    res.status(201).json(newExpense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
