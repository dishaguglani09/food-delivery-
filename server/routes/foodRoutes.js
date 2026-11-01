const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFeaturedFoods,
  getFoodById,
  getCategories,
  validateCartItems
} = require('../controllers/foodController');

router.get('/', getFoods);
router.post('/validate-cart', validateCartItems);
router.get('/featured', getFeaturedFoods);
router.get('/categories', getCategories);
router.get('/:id', getFoodById);

module.exports = router;
