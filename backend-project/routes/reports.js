const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET daily report
router.get('/daily', auth, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  try {
    const [rows] = await db.query(`
      SELECT s.invoiceNumber, s.salesDate, s.paymentMethod, s.totalAmountPaid,
             c.firstName, c.lastName, c.telephone,
             p.productName, p.unitPrice
      FROM Sale s
      JOIN Customer c ON s.customerNumber = c.customerNumber
      JOIN Product p ON s.productCode = p.productCode
      WHERE DATE(s.salesDate) = ?
      ORDER BY s.salesDate DESC
    `, [date]);
    const [summary] = await db.query(
      'SELECT COUNT(*) as totalSales, SUM(totalAmountPaid) as totalRevenue FROM Sale WHERE DATE(salesDate) = ?',
      [date]
    );
    res.json({ date, sales: rows, summary: summary[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET weekly report
router.get('/weekly', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.invoiceNumber, s.salesDate, s.paymentMethod, s.totalAmountPaid,
             c.firstName, c.lastName,
             p.productName
      FROM Sale s
      JOIN Customer c ON s.customerNumber = c.customerNumber
      JOIN Product p ON s.productCode = p.productCode
      WHERE s.salesDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ORDER BY s.salesDate DESC
    `);
    const [summary] = await db.query(
      'SELECT COUNT(*) as totalSales, SUM(totalAmountPaid) as totalRevenue FROM Sale WHERE salesDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)'
    );
    res.json({ period: 'Last 7 days', sales: rows, summary: summary[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET monthly report
router.get('/monthly', auth, async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const [year, mon] = month.split('-');
  try {
    const [rows] = await db.query(`
      SELECT s.invoiceNumber, s.salesDate, s.paymentMethod, s.totalAmountPaid,
             c.firstName, c.lastName,
             p.productName
      FROM Sale s
      JOIN Customer c ON s.customerNumber = c.customerNumber
      JOIN Product p ON s.productCode = p.productCode
      WHERE YEAR(s.salesDate) = ? AND MONTH(s.salesDate) = ?
      ORDER BY s.salesDate DESC
    `, [year, mon]);
    const [summary] = await db.query(
      'SELECT COUNT(*) as totalSales, SUM(totalAmountPaid) as totalRevenue FROM Sale WHERE YEAR(salesDate)=? AND MONTH(salesDate)=?',
      [year, mon]
    );
    res.json({ period: month, sales: rows, summary: summary[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET overall summary
router.get('/summary', auth, async (req, res) => {
  try {
    const [[customers]] = await db.query('SELECT COUNT(*) as total FROM Customer');
    const [[products]] = await db.query('SELECT COUNT(*) as total FROM Product');
    const [[sales]] = await db.query('SELECT COUNT(*) as total, SUM(totalAmountPaid) as revenue FROM Sale');
    const [topProducts] = await db.query(`
      SELECT p.productName, COUNT(*) as salesCount, SUM(s.totalAmountPaid) as revenue
      FROM Sale s JOIN Product p ON s.productCode = p.productCode
      GROUP BY p.productCode ORDER BY revenue DESC LIMIT 5
    `);
    res.json({ customers: customers.total, products: products.total, sales: sales.total, revenue: sales.revenue || 0, topProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
