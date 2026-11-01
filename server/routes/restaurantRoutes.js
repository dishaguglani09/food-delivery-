// ============================================================================
// The Indian Rasoi — Restaurant Routes
// Defines endpoints for restaurant profile, culinary story, contact, and testimonials.
// ============================================================================

const express = require('express');
const router = express.Router();
const {
  getRestaurantInfo,
  getTestimonials,
  updateRestaurantInfo
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getRestaurantInfo)
  .put(protect, admin, updateRestaurantInfo);

router.get('/testimonials', getTestimonials);

module.exports = router;

