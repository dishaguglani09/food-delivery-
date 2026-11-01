// ============================================================================
// The Indian Rasoi — Order Routes
// ============================================================================

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/orderController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.post('/', optionalProtect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalProtect, getOrderById);
router.put('/:id/cancel', optionalProtect, cancelOrder);

module.exports = router;
