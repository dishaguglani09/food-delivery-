const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegistration,
  validateLogin
} = require('../middleware/validateRequest');

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .post(protect, addDeliveryAddress);

router.route('/addresses/:addressId')
  .put(protect, updateDeliveryAddress)
  .delete(protect, deleteDeliveryAddress);

module.exports = router;
