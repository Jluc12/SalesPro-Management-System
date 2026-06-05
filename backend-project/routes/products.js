const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET all products
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Product ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Product WHERE productCode = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - INSERT new product
router.post('/', auth, async (req, res) => {
  const { productName, quantitySold, unitPrice } = req.body;
  if (!productName || quantitySold === undefined || !unitPrice)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [result] = await db.query(
      'INSERT INTO Product (productName, quantitySold, unitPrice) VALUES (?, ?, ?)',
      [productName, quantitySold, unitPrice]
    );
    res.status(201).json({ message: 'Product added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
