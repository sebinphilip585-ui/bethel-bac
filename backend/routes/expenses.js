import express from 'express';
import crypto from 'crypto';
import { query } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/expenses - List all expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await query.all(`
      SELECT e.*, p.name as creator_name
      FROM expenses e
      LEFT JOIN profiles p ON e.created_by = p.id
      ORDER BY e.date DESC, e.created_at DESC
    `);
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { category, amount, description, date, vendor_name, payment_status } = req.body;
    const id = crypto.randomUUID();

    await query.run(
      `INSERT INTO expenses (id, category, amount, description, date, vendor_name, payment_status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        category, 
        amount, 
        description || null, 
        date, 
        vendor_name || null, 
        payment_status || 'Paid', 
        req.user.id
      ]
    );

    // Fire notification dynamically to avoid circular dep
    try {
      const { createNotification } = await import('./notifications.js');
      createNotification(
        'New Property Expense',
        `An expense of ₹${amount} was recorded under ${category}.`,
        'low',
        'expense',
        '/admin/expenses'
      );
    } catch (e) {
      console.error('Failed to trigger expense notification', e);
    }

    const newExpense = await query.get('SELECT * FROM expenses WHERE id = ?', [id]);
    res.status(201).json(newExpense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
