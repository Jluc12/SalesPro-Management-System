# SalePro SRMS — Sales Record Management System

**National Practical Exam 2026 | ICT & Multimedia — Software Development**

A full-stack sales record management system built with **React.js**, **Node.js/Express**, and **MySQL (XAMPP)**. Designed for managing customers, products, sales transactions, and generating business reports.

---

## Project Structure

```
SalesPro_SRMS/
├── backend-project/        # Node.js + Express REST API
│   ├── config/db.js        # MySQL connection pool
│   ├── middleware/auth.js  # JWT authentication middleware
│   ├── routes/             # API route handlers
│   │   ├── auth.js         # Login / Register
│   │   ├── customers.js    # Customer management
│   │   ├── products.js     # Product management
│   │   ├── sales.js        # Full CRUD for sales
│   │   └── reports.js      # Daily / Weekly / Monthly reports
│   ├── server.js           # Express entry point
│   ├── seed.js             # Database seeding script
│   └── .env                # Environment configuration
├── frontend-project/       # React.js + Tailwind CSS SPA
│   ├── src/
│   │   ├── context/        # AuthContext (authentication state)
│   │   ├── services/api.js # Axios instance with JWT interceptor
│   │   ├── components/     # Layout, Sidebar navigation
│   │   └── pages/          # Login, Dashboard, Customers, Products, Sales, Reports
│   ├── public/             # Static assets
│   └── tailwind.config.js  # Tailwind CSS configuration
└── database/
    └── srms_database.sql   # MySQL schema + sample data
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS 3, Axios, React Router 7 |
| Backend | Node.js, Express 5, JWT, bcryptjs |
| Database | MySQL 8 (via XAMPP) with mysql2 driver |
| Auth | JSON Web Tokens (JWT) with 8-hour expiry |

---

## Prerequisites

- **XAMPP** (Apache + MySQL on port 3306)
- **Node.js** v16+ and **npm** v8+

---

## Setup Instructions

### Step 1 — Database Setup

1. Open **XAMPP Control Panel** → Start **Apache** and **MySQL**
2. Open **phpMyAdmin**: `http://localhost/phpmyadmin`
3. Click **Import** → Select `database/srms_database.sql` → Click **Go**

Or via command line:
```bash
mysql -u root -p < database/srms_database.sql
```

**Default accounts created:**
- **Admin**: `admin` / `admin123`
- Sample customers (3), products (4) for testing

### Step 2 — Backend Setup

```bash
cd backend-project
npm install
```

Configure environment (`.env` file):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=SRMS
JWT_SECRET=srms_secret_key_2026
PORT=5000
```

Start the backend:
```bash
npm start
# Server runs on http://localhost:5000
```

### Step 3 — Frontend Setup

```bash
cd frontend-project
npm install
npm start
# App opens at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | Register new user | No |
| GET | `/api/customers` | List all customers | Yes |
| GET | `/api/customers/:id` | Get single customer | Yes |
| POST | `/api/customers` | Add new customer (INSERT only) | Yes |
| GET | `/api/products` | List all products | Yes |
| GET | `/api/products/:id` | Get single product | Yes |
| POST | `/api/products` | Add new product (INSERT only) | Yes |
| GET | `/api/sales` | List all sales | Yes |
| GET | `/api/sales/:id` | Get single sale | Yes |
| POST | `/api/sales` | Record new sale | Yes |
| PUT | `/api/sales/:id` | Update sale | Yes |
| DELETE | `/api/sales/:id` | Delete sale | Yes |
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily sales report | Yes |
| GET | `/api/reports/weekly` | Weekly sales report | Yes |
| GET | `/api/reports/monthly?month=YYYY-MM` | Monthly sales report | Yes |
| GET | `/api/reports/summary` | Dashboard summary | Yes |

---

## Features

- **Authentication**: Secure login with JWT tokens
- **Dashboard**: Real-time summary with stat cards and top products
- **Customer Management**: Add and view customer records
- **Product Management**: Add and view product inventory
- **Sales Management**: Full CRUD operations with invoice numbering
- **Reports**: Daily, Weekly, and Monthly sales reports with print support
- **Responsive**: Mobile-friendly sidebar with collapsible navigation
- **Search**: Real-time search for customers and products
- **Notifications**: Toast notifications for all actions
- **Security**: Password hashing, token-based auth, input validation

---

## Exam Requirements Compliance

- Customer form — INSERT only
- Product form — INSERT only
- Sales form — Full CRUD (INSERT + UPDATE + DELETE + SELECT)
- Reports — Daily, Weekly, Monthly
- Authentication with username and password
- Tailwind CSS UI with professional design
- Axios for frontend-backend integration
- MySQL (XAMPP) database
- Responsive layout with sidebar navigation

---

## License

MIT License — Free for educational and commercial use.
