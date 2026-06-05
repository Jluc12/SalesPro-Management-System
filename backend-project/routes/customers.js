const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET all customers
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customer ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customer WHERE customerNumber = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - INSERT new customer
router.post('/', auth, async (req, res) => {
  const { firstName, lastName, telephone, address } = req.body;
  if (!firstName || !lastName || !telephone || !address)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [result] = await db.query(
      'INSERT INTO Customer (firstName, lastName, telephone, address) VALUES (?, ?, ?, ?)',
      [firstName, lastName, telephone, address]
    );
    res.status(201).json({ message: 'Customer added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
