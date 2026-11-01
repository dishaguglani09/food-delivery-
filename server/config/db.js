// ============================================================================
// The Indian Rasoi — MongoDB Atlas / Mongoose Connection Handler
// Connects to MongoDB Atlas via Mongoose with:
// - bufferCommands: false to prevent query buffering timeouts (10000ms)
// - Server selection timeout of 5000ms
// - Support for both MONGO_URI and MONGODB_URI
// - Background reconnection retries when disconnected
// - Connection lifecycle event listeners (connected, disconnected, error, reconnected)
// - Masked logging to protect sensitive credentials
// - Singleton connection promise to prevent duplicate concurrent connections
// ============================================================================

const mongoose = require('mongoose');

// Disable query buffering so database operations fail fast when disconnected
// instead of hanging for 10000ms and throwing MongooseError buffering timeouts.
mongoose.set('bufferCommands', false);

let isConnected = false;
let connectionPromise = null;
let listenersRegistered = false;
let reconnectTimer = null;

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

const getDbStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    host: isConnected ? mongoose.connection.host : null,
    name: isConnected ? mongoose.connection.name : null,
    isConnected: isDbConnected()
  };
};

// Mask sensitive credentials in URI for safe diagnostic logging
const maskUri = (rawUri) => {
  if (!rawUri) return 'undefined';
  return rawUri.replace(/:([^:@]{1,})@/, ':****@');
};

const scheduleReconnect = (delay = 30000) => {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (!isDbConnected()) {
      await connectDB();
    }
  }, delay);
};

const registerConnectionListeners = () => {
  if (listenersRegistered) return;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    console.log(`[Database] 🟢 MongoDB Atlas connection established (${mongoose.connection.host}/${mongoose.connection.name}).`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    scheduleReconnect(30000);
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    console.log('[Database] 🟢 MongoDB Atlas reconnected successfully.');
  });

  listenersRegistered = true;
};

const connectDB = async () => {
  // If already connected, return the active connection
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  // If a connection attempt is in progress, reuse the same promise to prevent duplicates
  if (connectionPromise) {
    return connectionPromise;
  }

  registerConnectionListeners();

  // Support both MONGO_URI and MONGODB_URI
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  // Check if connection string is missing or still contains default template placeholders
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn(`
========================================================================
[The Indian Rasoi] ⚠️  MongoDB Atlas Connection Notice
========================================================================
Neither MONGO_URI nor MONGODB_URI is configured with real database credentials in server/.env.

To connect to MongoDB Atlas:
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a Database User with username & password in Atlas Security
3. Allow Network Access (0.0.0.0/0 for development or your current IP)
4. Set MONGO_URI in server/.env:
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/the_indian_rasoi?retryWrites=true&w=majority

The server will continue running. All database-dependent requests while
disconnected return graceful 503 responses without 10s buffering timeouts.
========================================================================
`);
    isConnected = false;
    scheduleReconnect();
    return null;
  }

  connectionPromise = (async () => {
    try {
      const masked = maskUri(uri);
      console.log(`[Database] Connecting to MongoDB: ${masked}`);

      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false
      });

      isConnected = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      console.log(`[Database] ✅ MongoDB Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);

      // Auto-seed initial restaurant profile, food catalog, and default users if collections are empty
      try {
        const Restaurant = require('../models/Restaurant');
        const restaurantCount = await Restaurant.countDocuments();
        if (restaurantCount === 0) {
          console.log('[Database] Restaurant profile empty. Auto-seeding The Indian Rasoi details...');
          const { defaultRestaurantData } = require('../controllers/restaurantController');
          await Restaurant.create(defaultRestaurantData);
          console.log('[Database] Successfully initialized The Indian Rasoi profile.');
        }

        const Food = require('../models/Food');
        const foodCount = await Food.countDocuments();
        if (foodCount === 0) {
          console.log('[Database] Food catalog empty. Auto-seeding The Indian Rasoi royal menu...');
          const { authenticIndianDishes } = require('../scripts/seedDatabase');
          await Food.insertMany(authenticIndianDishes);
          console.log(`[Database] Successfully seeded ${authenticIndianDishes.length} authentic Indian dishes.`);
        }

        // Auto-create admin if not present
        const User = require('../models/User');
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
          console.log('[Database] Creating default administrator account...');
          await User.create({
            name: 'Master Chef Rajesh Kumar',
            email: 'admin@theindianrasoi.com',
            password: 'AdminPassword2026!',
            phone: '+91 98765 43210',
            role: 'admin',
            addresses: [
              {
                label: 'The Indian Rasoi Kitchen',
                street: 'Block B, Inner Circle, Connaught Place',
                city: 'New Delhi',
                postalCode: '110001',
                country: 'India',
                isDefault: true
              }
            ]
          });
          console.log('[Database] Default administrator account ready (admin@theindianrasoi.com / AdminPassword2026!).');
        }

        const customerExists = await User.findOne({ email: 'priya.sharma@indianrasoi.com' });
        if (!customerExists) {
          console.log('[Database] Creating default customer account...');
          await User.create({
            name: 'Priya Sharma',
            email: 'priya.sharma@indianrasoi.com',
            password: 'Priya2026!',
            phone: '+91 98765 43210',
            role: 'customer',
            addresses: [
              {
                label: 'Home Residency',
                street: 'Flat 402, Royal Palms Apartments',
                building: 'Tower B, Connaught Place',
                city: 'New Delhi',
                postalCode: '110001',
                country: 'India',
                isDefault: true,
                deliveryNotes: 'Ring bell 402 or leave with security at main gate.'
              }
            ]
          });
          console.log('[Database] Default customer account ready (priya.sharma@indianrasoi.com / Priya2026!).');
        }
      } catch (seedErr) {
        console.warn('[Database] Auto-seeding notice:', seedErr.message);
      }

      return conn;
    } catch (error) {
      isConnected = false;
      const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');
      if (isLocal) {
        console.log('[Database] Local MongoDB is not running. Active in resilient standalone development mode.');
        scheduleReconnect(60000);
      } else {
        console.warn(`[Database] MongoDB Atlas connection notice: ${error.message}`);
        scheduleReconnect(30000);
      }
      return null;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
module.exports.getDbStatus = getDbStatus;
