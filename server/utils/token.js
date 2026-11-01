const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'the_indian_rasoi_jwt_secret_dev_key_2026_royal_dining',
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken };
