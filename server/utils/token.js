const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'casa_topaz_jwt_secret_dev_key_2026_fine_dining',
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken };
