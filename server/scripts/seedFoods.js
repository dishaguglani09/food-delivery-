// ============================================================================
// THE INDIAN RASOI — Authentic Indian Food Menu Seed Data
// Reuses the comprehensive authenticIndianDishes dataset with verified photography
// ============================================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('../models/Food');
const { authenticIndianDishes } = require('./seedDatabase');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sampleFoods = authenticIndianDishes;

const seedFoods = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('[Seeder] Error: Valid MONGO_URI is required to seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[Seeder] Connected to MongoDB.');

    await Food.deleteMany({});
    console.log('[Seeder] Cleared existing foods.');

    const created = await Food.insertMany(sampleFoods);
    console.log(`[Seeder] ✅ Successfully seeded ${created.length} authentic dishes into The Indian Rasoi menu!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error during seeding:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedFoods();
}

module.exports = { sampleFoods, seedFoods };
