// ============================================================================
// The Indian Rasoi — Authentication Controller
// Resilient MERN database integration:
// - Uses pure MongoDB Atlas via Mongoose ODM when connected
// - Seamless development fallback ensuring registration & login always work smoothly
// - Bcrypt password hashing
// - JWT token issuance
// - Profile management and dynamic address management
// ============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { isDbConnected } = require('../config/db');
const localStore = require('../utils/localStore');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validate presence of required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).toLowerCase().trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name.'
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Confirm password validation if supplied
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please verify your password confirmation.'
      });
    }

    // 1. If MongoDB Atlas is connected, use Mongoose directly
    if (isDbConnected()) {
      const userExists = await User.findOne({ email: trimmedEmail });
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists in The Indian Rasoi database.'
        });
      }

      const user = await User.create({
        name: trimmedName,
        email: trimmedEmail,
        password,
        phone: phone ? String(phone).trim() : '+91 98765 43210',
        role: 'customer',
        addresses: []
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Welcome to Rasoi Club! Your account has been created successfully.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
          token
        },
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses
        }
      });
    }

    // 2. Seamless local development mode (when MongoDB Atlas is not yet configured)
    const existingLocal = localStore.findUserByEmail(trimmedEmail);
    if (existingLocal) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists in The Indian Rasoi database.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = new mongoose.Types.ObjectId();

    const newUser = {
      _id: newUserId,
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      phone: phone ? String(phone).trim() : '+91 98765 43210',
      role: 'customer',
      addresses: []
    };

    localStore.addUser(newUser);
    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Welcome to Rasoi Club! Your account has been created successfully.',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses,
        token
      },
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB Atlas is connected, use Mongoose
    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Login successful.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
          token
        },
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses
        }
      });
    }

    // 2. Seamless local development mode
    const localUser = localStore.findUserByEmail(cleanEmail);
    if (!localUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, localUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(localUser._id, localUser.role);

    return res.json({
      success: true,
      message: 'Login successful.',
      data: {
        _id: localUser._id,
        name: localUser.name,
        email: localUser.email,
        phone: localUser.phone,
        role: localUser.role,
        addresses: localUser.addresses,
        token
      },
      token,
      user: {
        _id: localUser._id,
        name: localUser.name,
        email: localUser.email,
        phone: localUser.phone,
        role: localUser.role,
        addresses: localUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.json({ success: true, data: user, user });
    }

    const localUser = localStore.findUserById(req.user._id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const safeUser = {
      _id: localUser._id,
      name: localUser.name,
      email: localUser.email,
      phone: localUser.phone,
      role: localUser.role,
      addresses: localUser.addresses || []
    };

    return res.json({ success: true, data: safeUser, user: safeUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name.trim();
      if (phone) user.phone = phone.trim();

      const updatedUser = await user.save();

      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          addresses: updatedUser.addresses
        }
      });
    }

    const localUser = localStore.findUserById(req.user._id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) localUser.name = name.trim();
    if (phone) localUser.phone = phone.trim();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        _id: localUser._id,
        name: localUser.name,
        email: localUser.email,
        phone: localUser.phone,
        role: localUser.role,
        addresses: localUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new delivery address
// @route   POST /api/auth/addresses
// @access  Private
const addDeliveryAddress = async (req, res, next) => {
  try {
    const { label, street, city, postalCode, country, isDefault } = req.body;

    if (!street || !city || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Street, city, and postal code are mandatory.'
      });
    }

    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      label: label ? label.trim() : 'Home',
      street: street.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country ? country.trim() : 'India',
      isDefault: Boolean(isDefault)
    };

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (newAddress.isDefault) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
      }

      user.addresses.push(newAddress);
      await user.save();

      return res.status(201).json({
        success: true,
        message: 'Address added successfully.',
        data: user.addresses
      });
    }

    const localUser = localStore.findUserById(req.user._id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!localUser.addresses) localUser.addresses = [];
    if (newAddress.isDefault) {
      localUser.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    localUser.addresses.push(newAddress);

    return res.status(201).json({
      success: true,
      message: 'Address added successfully.',
      data: localUser.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
const updateDeliveryAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, postalCode, country, isDefault } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({ success: false, message: 'Address not found.' });
      }

      if (label) address.label = label.trim();
      if (street) address.street = street.trim();
      if (city) address.city = city.trim();
      if (postalCode) address.postalCode = postalCode.trim();
      if (country) address.country = country.trim();

      if (isDefault !== undefined) {
        if (isDefault) {
          user.addresses.forEach((addr) => {
            addr.isDefault = false;
          });
        }
        address.isDefault = Boolean(isDefault);
      }

      await user.save();

      return res.json({
        success: true,
        message: 'Address updated successfully.',
        data: user.addresses
      });
    }

    const localUser = localStore.findUserById(req.user._id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const address = (localUser.addresses || []).find((a) => String(a._id) === String(addressId));
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    if (label) address.label = label.trim();
    if (street) address.street = street.trim();
    if (city) address.city = city.trim();
    if (postalCode) address.postalCode = postalCode.trim();
    if (country) address.country = country.trim();
    if (isDefault !== undefined) {
      if (isDefault) {
        localUser.addresses.forEach((a) => (a.isDefault = false));
      }
      address.isDefault = Boolean(isDefault);
    }

    return res.json({
      success: true,
      message: 'Address updated successfully.',
      data: localUser.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete delivery address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
const deleteDeliveryAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      user.addresses.pull({ _id: addressId });
      await user.save();

      return res.json({
        success: true,
        message: 'Address deleted successfully.',
        data: user.addresses
      });
    }

    const localUser = localStore.findUserById(req.user._id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    localUser.addresses = (localUser.addresses || []).filter(
      (a) => String(a._id) !== String(addressId)
    );

    return res.json({
      success: true,
      message: 'Address deleted successfully.',
      data: localUser.addresses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress
};
