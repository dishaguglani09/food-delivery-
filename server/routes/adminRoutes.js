const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  createFood,
  updateFood,
  deleteFood,
  toggleFoodAvailability,
  getAllUsers
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateFoodItem } = require('../middleware/validateRequest');

// All admin routes require login + admin role
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.route('/foods')
  .post(validateFoodItem, createFood);

router.route('/foods/:id')
  .put(updateFood)
  .delete(deleteFood);

router.patch('/foods/:id/toggle-availability', toggleFoodAvailability);

router.get('/users', getAllUsers);

module.exports = router;
