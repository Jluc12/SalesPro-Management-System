-- ============================================
-- SRMS Database Setup Script
-- Run this in phpMyAdmin or MySQL CLI on XAMPP
-- ============================================

CREATE DATABASE IF NOT EXISTS SRMS;
USE SRMS;

-- Users table (login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer table
CREATE TABLE IF NOT EXISTS Customer (
  customerNumber INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS Product (
  productCode INT AUTO_INCREMENT PRIMARY KEY,
  productName VARCHAR(150) NOT NULL,
  quantitySold INT NOT NULL DEFAULT 0,
  unitPrice DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale table
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
);

-- Default admin user (password: admin123)
INSERT IGNORE INTO users (username, password)
VALUES ('admin', '$2b$10$vwf70Iyn6OS7i4wmrvoaCuRnPO8NMVlnyO4K3oAwO2ImpyJwjlJOi');

-- Sample data
INSERT IGNORE INTO Customer (firstName, lastName, telephone, address)
VALUES
  ('Jean', 'Uwimana', '0788123456', 'Kigali, Gasabo'),
  ('Marie', 'Mukamana', '0722987654', 'Huye District'),
  ('Patrick', 'Habimana', '0733456789', 'Musanze District');

INSERT IGNORE INTO Product (productName, quantitySold, unitPrice)
VALUES
  ('Samsung TV 43"', 5, 450000.00),
  ('HP Laptop 15"', 3, 850000.00),
  ('iPhone 14', 2, 1200000.00),
  ('Canon Printer', 4, 180000.00);
