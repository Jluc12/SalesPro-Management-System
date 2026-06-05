const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Create tables
    console.log('Creating tables...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS Customer (
        customerNumber INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        address VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS Product (
        productCode INT AUTO_INCREMENT PRIMARY KEY,
        productName VARCHAR(150) NOT NULL,
        quantitySold INT NOT NULL DEFAULT 0,
        unitPrice DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS Sale (
        invoiceNumber INT AUTO_INCREMENT PRIMARY KEY,
        customerNumber INT NOT NULL,
        productCode INT NOT NULL,
        salesDate DATE NOT NULL,
        paymentMethod ENUM('Cash', 'Mobile Money', 'Bank Transfer', 'Card') NOT NULL,
        totalAmountPaid DECIMAL(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customerNumber) REFERENCES Customer(customerNumber) ON DELETE CASCADE,
        FOREIGN KEY (productCode) REFERENCES Product(productCode) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tables ready\n');

    // Seed admin user
    console.log('Seeding admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT IGNORE INTO users (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );
    console.log('✅ Admin user created (admin / admin123)\n');

    // Seed customers
    console.log('Seeding customers...');
    const [existingCustomers] = await db.query('SELECT COUNT(*) as count FROM Customer');
    if (existingCustomers[0].count === 0) {
      await db.query(`INSERT INTO Customer (firstName, lastName, telephone, address) VALUES
        ('Jean', 'Uwimana', '0788123456', 'Kigali, Gasabo'),
        ('Marie', 'Mukamana', '0722987654', 'Huye District'),
        ('Patrick', 'Habimana', '0733456789', 'Musanze District')`);
      console.log('✅ 3 customers seeded');
    } else {
      console.log('⏩ Customers already exist, skipping');
    }

    // Seed products
    console.log('Seeding products...');
    const [existingProducts] = await db.query('SELECT COUNT(*) as count FROM Product');
    if (existingProducts[0].count === 0) {
      await db.query(`INSERT INTO Product (productName, quantitySold, unitPrice) VALUES
        ('Samsung TV 43"', 5, 450000.00),
        ('HP Laptop 15"', 3, 850000.00),
        ('iPhone 14', 2, 1200000.00),
        ('Canon Printer', 4, 180000.00)`);
      console.log('✅ 4 products seeded');
    } else {
      console.log('⏩ Products already exist, skipping');
    }

    console.log('\n🎉 Seeding complete! You can now log in with: admin / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
