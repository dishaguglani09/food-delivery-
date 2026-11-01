// ============================================================================
// The Indian Rasoi — Main Express Server
// JSON parsing, CORS configuration, MongoDB Atlas connection,
// centralized error handling, and health monitoring.
// ============================================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const { getDbStatus } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas via Mongoose
connectDB();

// CORS configuration (supporting Vite customer frontend and local development)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('Blocked by CORS policy: Origin not allowed.'));
    }
    return callback(null, true); // Permissive for pairing during development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Documentation Endpoint
app.get('/api', (req, res) => {
  const db = getDbStatus();
  res.json({
    status: 'online',
    restaurant: 'The Indian Rasoi — Authentic Indian Cuisine & Royal Biryanis',
    version: '1.0.0',
    database: {
      connected: db.isConnected,
      state: db.state
    },
    documentation: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      foods: {
        list: 'GET /api/foods (supports page, limit, category, vegetarian, search, sort)',
        featured: 'GET /api/foods/featured',
        categories: 'GET /api/foods/categories',
        detail: 'GET /api/foods/:id'
      },
      orders: {
        create: 'POST /api/orders',
        myOrders: 'GET /api/orders/my-orders',
        detail: 'GET /api/orders/:id',
        cancel: 'PUT /api/orders/:id/cancel'
      },
      admin: {
        stats: 'GET /api/admin/stats',
        orders: 'GET /api/admin/orders',
        manageFoods: 'POST/PUT/DELETE /api/admin/foods'
      }
    }
  });
});

// Explicit Health Check Endpoint
app.get('/api/health', (req, res) => {
  const db = getDbStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    server: 'CASA TÒPAZ Gourmet API',
    database: {
      connected: db.isConnected,
      state: db.state,
      host: db.host || 'Not connected',
      name: db.name || 'casa_topaz',
      instructions: db.isConnected
        ? 'MongoDB Atlas is active and operational.'
        : 'MongoDB is not connected. Configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.'
    }
  });
});

// Mount Resource Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[CASA TÒPAZ Server] Running on http://localhost:${PORT}`);
  console.log(`[CASA TÒPAZ Server] Healthcheck available at http://localhost:${PORT}/api/health`);
});

module.exports = app;
