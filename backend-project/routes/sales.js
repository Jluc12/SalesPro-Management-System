const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const offset = (page - 1) * limit;
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM Sale');
    const [rows] = await db.query(`
      SELECT s.invoiceNumber, s.salesDate, s.paymentMethod, s.totalAmountPaid,
             c.firstName, c.lastName, c.telephone,
             p.productName, p.unitPrice, s.customerNumber, s.productCode
      FROM Sale s
      JOIN Customer c ON s.customerNumber = c.customerNumber
      JOIN Product p ON s.productCode = p.productCode
      ORDER BY s.salesDate DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, c.firstName, c.lastName, p.productName
      FROM Sale s
      JOIN Customer c ON s.customerNumber = c.customerNumber
      JOIN Product p ON s.productCode = p.productCode
      WHERE s.invoiceNumber = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Sale not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { customerNumber, productCode, salesDate, paymentMethod, totalAmountPaid } = req.body;
  if (!customerNumber || !productCode || !salesDate || !paymentMethod || !totalAmountPaid)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [result] = await db.query(
      'INSERT INTO Sale (customerNumber, productCode, salesDate, paymentMethod, totalAmountPaid) VALUES (?, ?, ?, ?, ?)',
      [customerNumber, productCode, salesDate, paymentMethod, totalAmountPaid]
    );
    res.status(201).json({ message: 'Sale recorded successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { customerNumber, productCode, salesDate, paymentMethod, totalAmountPaid } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE Sale SET customerNumber=?, productCode=?, salesDate=?, paymentMethod=?, totalAmountPaid=? WHERE invoiceNumber=?',
      [customerNumber, productCode, salesDate, paymentMethod, totalAmountPaid, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Sale not found' });
    res.json({ message: 'Sale updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Sale WHERE invoiceNumber = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Sale not found' });
    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
