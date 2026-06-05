const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const offset = (page - 1) * limit;
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM Customer');
    const [rows] = await db.query(
      'SELECT * FROM Customer ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT customerNumber, firstName, lastName FROM Customer ORDER BY firstName ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customer WHERE customerNumber = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { firstName, lastName, telephone, address } = req.body;
  if (!firstName || !lastName || !telephone || !address)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [result] = await db.query(
      'INSERT INTO Customer (firstName, lastName, telephone, address) VALUES (?, ?, ?, ?)',
      [firstName.trim(), lastName.trim(), telephone.trim(), address.trim()]
    );
    res.status(201).json({ message: 'Customer added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
