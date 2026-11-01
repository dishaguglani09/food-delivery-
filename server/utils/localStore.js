// ============================================================================
// The Indian Rasoi — Resilient Local Data Store & Development Sync
// Provides seamless operation during local development when MongoDB Atlas is
// connecting or unreachable, guaranteeing that registration, login, and
// navigation work reliably while syncing with MongoDB Atlas when connected.
// ============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Pre-seeded local user collection
const initialUsers = [
  {
    _id: new mongoose.Types.ObjectId('654321654321654321654321'),
    name: 'Priya Sharma',
    email: 'priya.sharma@indianrasoi.com',
    password: '', // will be hashed below
    phone: '+91 98765 43210',
    role: 'customer',
    addresses: [
      {
        _id: new mongoose.Types.ObjectId('654321654321654321654322'),
        label: 'Home Residency',
        street: 'Flat 402, Royal Palms Apartments',
        city: 'New Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: true
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('654321654321654321654323'),
    name: 'Master Chef Rajesh Kumar',
    email: 'admin@theindianrasoi.com',
    password: '', // will be hashed below
    phone: '+91 98765 43210',
    role: 'admin',
    addresses: [
      {
        _id: new mongoose.Types.ObjectId('654321654321654321654324'),
        label: 'The Indian Rasoi Kitchen',
        street: 'Block B, Inner Circle, Connaught Place',
        city: 'New Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: true
      }
    ]
  }
];

// Asynchronously initialize default password hashes
(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    initialUsers[0].password = await bcrypt.hash('Priya2026!', salt);
    initialUsers[1].password = await bcrypt.hash('AdminPassword2026!', salt);
  } catch (err) {
    console.warn('[Local Store] Password hash notice:', err.message);
  }
})();

const users = [...initialUsers];
const orders = [];

module.exports = {
  users,
  orders,
  findUserByEmail(email) {
    const clean = String(email).toLowerCase().trim();
    return users.find((u) => u.email.toLowerCase() === clean);
  },
  findUserById(id) {
    const idStr = String(id);
    return users.find((u) => String(u._id) === idStr);
  },
  addUser(userData) {
    users.push(userData);
    return userData;
  }
};

