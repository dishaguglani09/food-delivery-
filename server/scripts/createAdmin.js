// ============================================================================
// CASA TÒPAZ — Admin & Demo User Creation Script
// Creates default Head Chef Administrator and verified demo customer.
// ============================================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
    console.error(`
========================================================================
[CASA TÒPAZ Admin Script] ⚠️ Cannot connect: MONGODB_URI is not set.
========================================================================
Please configure your MongoDB Atlas connection string in server/.env:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/casa_topaz?retryWrites=true&w=majority
========================================================================
`);
    process.exit(1);
  }

  try {
    const maskedUri = mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@');
    console.log(`[Admin Script] Connecting to MongoDB: ${maskedUri} ...`);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Admin Script] Connected successfully.');

    // 1. Create or update Head Chef Administrator
    const adminEmail = 'admin@casatopaz.ch';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'Chef Mateo Rossi',
        email: adminEmail,
        password: 'AdminPassword2026!',
        phone: '+41 79 888 77 66',
        role: 'admin',
        addresses: [
          {
            label: 'CASA TÒPAZ Kitchen',
            street: 'Rue du Pont 14',
            city: 'Biel/Bienne',
            postalCode: '2502',
            country: 'Switzerland',
            isDefault: true
          }
        ]
      });
      console.log('✅ Admin account created:');
      console.log('   Email: admin@casatopaz.ch');
      console.log('   Password: AdminPassword2026!');
    } else {
      admin.role = 'admin';
      await admin.save();
      console.log('ℹ️  Admin account already exists (admin@casatopaz.ch).');
    }

    // 2. Create demo customer account
    const demoEmail = 'elena.rostova@gastronomie.ch';
    let customer = await User.findOne({ email: demoEmail });

    if (!customer) {
      customer = await User.create({
        name: 'Elena Rostova',
        email: demoEmail,
        password: 'Customer2026!',
        phone: '+41 79 482 19 88',
        role: 'customer',
        addresses: [
          {
            label: 'Home Penthouse',
            street: 'Rue du Lac 24',
            city: 'Biel/Bienne',
            postalCode: '2502',
            country: 'Switzerland',
            isDefault: true
          }
        ]
      });
      console.log('✅ Demo Customer created:');
      console.log('   Email: elena.rostova@gastronomie.ch');
      console.log('   Password: Customer2026!');
    } else {
      console.log('ℹ️  Demo customer already exists (elena.rostova@gastronomie.ch).');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Admin Script] Error creating admin/customer:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin };
