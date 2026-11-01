// ============================================================================
// The Indian Rasoi — MongoDB Atlas / Mongoose Connection Handler
// Connects to MongoDB Atlas via Mongoose. Provides clear diagnostic reporting
// when credentials or cluster endpoints need configuration.
// ============================================================================

const mongoose = require('mongoose');

let isConnected = false;

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

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Check if MONGODB_URI is missing or still contains default placeholder text
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn(`
========================================================================
[The Indian Rasoi] ⚠️  MongoDB Atlas Connection Notice
========================================================================
MONGODB_URI is not configured with real database credentials in server/.env.

To connect to MongoDB Atlas:
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a Database User with username & password
3. Allow Network Access (e.g. 0.0.0.0/0 for dev or your IP)
4. Set MONGODB_URI in server/.env:
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/the_indian_rasoi?retryWrites=true&w=majority

The server will continue running. All read-only endpoints fallback
gracefully, and /api/health will accurately report the database status.
========================================================================
`);
    isConnected = false;
    return null;
  }

  try {
    const maskedUri = uri.replace(/:([^:@]{4})[^:@]*@/, ':****@');
    console.log(`[Database] Connecting to MongoDB: ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[Database] ✅ MongoDB Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);

    // Auto-seed initial food items if catalog is empty
    try {
      const Food = require('../models/Food');
      const count = await Food.countDocuments();
      if (count === 0) {
        console.log('[Database] Food catalog empty. Auto-seeding The Indian Rasoi royal menu...');
        const { sampleFoods } = require('../scripts/seedFoods');
        await Food.insertMany(sampleFoods);
        console.log(`[Database] Successfully seeded ${sampleFoods.length} authentic Indian dishes.`);
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
    } catch (seedErr) {
      console.warn('[Database] Auto-seeding notice:', seedErr.message);
    }

    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] ❌ Could not connect to MongoDB: ${error.message}`);
    console.warn(`[Database] Please ensure MongoDB is running or specify a valid MONGODB_URI in server/.env`);
    return null;
  }
};

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
module.exports.getDbStatus = getDbStatus;
