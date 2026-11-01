// ============================================================================
// The Indian Rasoi — Authentication & Role Middleware
// Resilient JWT Token Verification & User Resolution:
// - Validates JWT bearer tokens against JWT_SECRET
// - Resolves user from MongoDB Atlas when connected or localStore in dev mode
// - Supports both strict (protect) and optional (optionalProtect) authentication
// - Enforces role-based access control (admin)
// ============================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const localStore = require('../utils/localStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'the_indian_rasoi_jwt_secret_dev_key_2026_royal_dining'
      );

      let user = null;
      if (isDbConnected()) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = localStore.findUserById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account no longer exists.'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please provide a valid authentication token.'
    });
  }
};

const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'the_indian_rasoi_jwt_secret_dev_key_2026_royal_dining'
      );

      let user = null;
      if (isDbConnected()) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = localStore.findUserById(decoded.id);
      }

      if (user) {
        req.user = user;
      }
    } catch {
      // Optional: continue unauthenticated if token verification fails
    }
  }
  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Administrator privileges required.'
    });
  }
};

module.exports = { protect, optionalProtect, admin };
