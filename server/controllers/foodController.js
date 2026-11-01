// ============================================================================
// The Indian Rasoi — Food Controller
// Resilient database integration:
// - Uses pure MongoDB Atlas via Mongoose ODM when connected
// - Seamless development fallback ensuring food catalog & categories load reliably
// - Pagination, search, category filtering, vegetarian filters, and sorting
// ============================================================================

const mongoose = require('mongoose');
const Food = require('../models/Food');
const { isDbConnected } = require('../config/db');
const { authenticIndianDishes } = require('../scripts/seedDatabase');

// In-memory food collection using authentic MongoDB ObjectIds
const localFoods = authenticIndianDishes.map((dish) => ({
  ...dish,
  _id: dish._id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

// Legacy synthetic ID mapping table for backward compatibility with existing carts
const legacyIdMap = {};
authenticIndianDishes.forEach((dish, idx) => {
  const legacyId = String(idx + 1).padStart(24, '0');
  legacyIdMap[legacyId] = dish;
});

/**
 * Resilient Food Resolver
 * Resolves a food document by:
 * 1. Actual MongoDB ObjectId in database
 * 2. Legacy synthetic ID migration (e.g. 000000000000000000000003 -> Dal Makhani)
 * 3. Exact or case-insensitive dish name / Hindi name
 */
const resolveFoodDocument = async (foodId, itemName) => {
  if (isDbConnected()) {
    // 1. Try direct find by MongoDB ObjectId
    if (mongoose.isValidObjectId(foodId) && !legacyIdMap[foodId]) {
      const doc = await Food.findById(foodId);
      if (doc) return doc;
    }

    // 2. Try legacy synthetic ID resolution
    if (legacyIdMap[foodId]) {
      const targetDish = legacyIdMap[foodId];
      // Find the corresponding document in MongoDB by name
      const doc = await Food.findOne({
        $or: [{ name: targetDish.name }, { hindiName: targetDish.hindiName }]
      });
      if (doc) return doc;
    }

    // 3. Fallback: Lookup by dish name / Hindi name
    const searchName = itemName || (typeof foodId === 'string' && !mongoose.isValidObjectId(foodId) ? foodId : null);
    if (searchName) {
      const doc = await Food.findOne({
        $or: [{ name: searchName }, { hindiName: searchName }]
      });
      if (doc) return doc;
    }

    return null;
  }

  // Local development mode
  if (mongoose.isValidObjectId(foodId)) {
    const local = localFoods.find((d) => String(d._id) === String(foodId));
    if (local) return local;
  }

  if (legacyIdMap[foodId]) {
    return legacyIdMap[foodId];
  }

  const searchName = itemName || foodId;
  if (searchName) {
    const local = localFoods.find(
      (d) => d.name === searchName || d.hindiName === searchName
    );
    if (local) return local;
  }

  return null;
};

// Descriptive tags for Indian categories
const categoryTags = {
  'North Indian': 'Royal Awadhi & Mughlai Curries',
  'South Indian': 'Fermented Crepes & Sambhars',
  'Street Food': 'Crisp Chaat & Street Delights',
  'Breads': 'Charcoal Clay Tandoor Rotis & Naans',
  'Rice & Biryani': 'Dum Pukht Fragrant Basmati',
  'Desserts': 'Mithai, Halwa & Milk Sweets',
  'Beverages': 'Kullad Chai & Churned Lassis'
};

// @desc    Get all foods with pagination, search, category & vegetarian filtering, and sorting
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      vegetarian,
      isVegetarian,
      dietary,
      sort,
      isAvailable
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 12;

    // 1. If MongoDB Atlas is connected, query via Mongoose
    if (isDbConnected()) {
      const query = {};

      if (isAvailable !== undefined) {
        query.isAvailable = isAvailable === 'true';
      } else {
        query.isAvailable = true;
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (vegetarian === 'true' || isVegetarian === 'true') {
        query.$or = [{ isVegetarian: true }, { dietary: 'Vegetarian' }];
      }

      if (dietary && dietary !== 'All') {
        query.dietary = dietary;
      }

      if (search && search.trim()) {
        const cleanSearch = search.trim();
        const searchRegex = new RegExp(cleanSearch, 'i');
        const searchOr = [
          { name: searchRegex },
          { hindiName: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ];
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchOr }];
          delete query.$or;
        } else {
          query.$or = searchOr;
        }
      }

      let sortOption = { isFeatured: -1, rating: -1 };
      if (sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price-desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'popular') sortOption = { reviewsCount: -1 };
      else if (sort === 'name') sortOption = { name: 1 };

      const total = await Food.countDocuments(query);
      const totalPages = Math.ceil(total / limitNum) || 1;
      const skip = (pageNum - 1) * limitNum;

      const foods = limit === 'all'
        ? await Food.find(query).sort(sortOption)
        : await Food.find(query).sort(sortOption).skip(skip).limit(limitNum);

      return res.json({
        success: true,
        count: foods.length,
        total,
        page: pageNum,
        totalPages,
        data: foods
      });
    }

    // 2. Seamless local development mode
    let filtered = [...localFoods];

    if (category && category !== 'All') {
      filtered = filtered.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    }

    if (vegetarian === 'true' || isVegetarian === 'true') {
      filtered = filtered.filter((d) => d.isVegetarian || (d.dietary && d.dietary.includes('Vegetarian')));
    }

    if (dietary && dietary !== 'All') {
      filtered = filtered.filter((d) => d.dietary && d.dietary.includes(dietary));
    }

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          (d.hindiName && d.hindiName.includes(s)) ||
          d.description.toLowerCase().includes(s)
      );
    }

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'popular') filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const skip = (pageNum - 1) * limitNum;
    const foods = limit === 'all' ? filtered : filtered.slice(skip, skip + limitNum);

    return res.json({
      success: true,
      count: foods.length,
      total,
      page: pageNum,
      totalPages,
      data: foods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured gourmet dishes
// @route   GET /api/foods/featured
// @access  Public
const getFeaturedFoods = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const featured = await Food.find({ isFeatured: true, isAvailable: true }).limit(8);
      return res.json({
        success: true,
        count: featured.length,
        data: featured
      });
    }

    const featured = localFoods.filter((d) => d.isFeatured && d.isAvailable !== false).slice(0, 8);
    return res.json({
      success: true,
      count: featured.length,
      data: featured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let food = null;
      if (mongoose.isValidObjectId(id)) {
        food = await Food.findById(id);
      } else {
        food = await Food.findOne({ $or: [{ name: id }, { hindiName: id }] });
      }

      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found in The Indian Rasoi database.'
        });
      }

      return res.json({
        success: true,
        data: food
      });
    }

    const food = localFoods.find(
      (d) => String(d._id) === String(id) || d.name === id || d.hindiName === id
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found in The Indian Rasoi database.'
      });
    }

    return res.json({
      success: true,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic list of menu categories with counts & preview images
// @route   GET /api/foods/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const categoriesAggregation = await Food.aggregate([
        { $match: { isAvailable: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            image: { $first: '$image' },
            sampleDish: { $first: '$name' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const categories = categoriesAggregation.map((cat) => ({
        id: cat._id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: cat._id,
        category: cat._id,
        count: cat.count,
        image: cat.image,
        tag: categoryTags[cat._id] || `${cat._id} Specialties`,
        sampleDish: cat.sampleDish
      }));

      return res.json({
        success: true,
        count: categories.length,
        data: categories
      });
    }

    // In-memory categories calculation
    const catMap = {};
    localFoods.forEach((dish) => {
      if (!catMap[dish.category]) {
        catMap[dish.category] = {
          count: 0,
          image: dish.image,
          sampleDish: dish.name
        };
      }
      catMap[dish.category].count++;
    });

    const categories = Object.keys(catMap).map((catName) => ({
      id: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: catName,
      category: catName,
      count: catMap[catName].count,
      image: catMap[catName].image,
      tag: categoryTags[catName] || `${catName} Specialties`,
      sampleDish: catMap[catName].sampleDish
    }));

    return res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate, sanitize, and migrate cart items against active database documents
// @route   POST /api/foods/validate-cart
// @access  Public
const validateCartItems = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({
        success: true,
        hasChanges: false,
        validItems: [],
        removedItems: []
      });
    }

    const validItems = [];
    const removedItems = [];
    let hasChanges = false;

    for (const item of items) {
      const foodId =
        typeof item.food === 'object' && item.food
          ? item.food._id || item.food.id
          : item.food || item.foodId;
      const itemName =
        typeof item.food === 'object' && item.food
          ? item.food.name
          : item.name || '';
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      const foodDoc = await resolveFoodDocument(foodId, itemName);

      if (!foodDoc) {
        hasChanges = true;
        removedItems.push({
          foodId,
          name: itemName || 'A selected dish',
          reason: 'NOT_FOUND',
          message: `"${itemName || 'A selected dish'}" is no longer available on our menu and has been removed from your basket.`
        });
        continue;
      }

      if (foodDoc.isAvailable === false) {
        hasChanges = true;
        removedItems.push({
          foodId: foodDoc._id,
          name: foodDoc.name,
          reason: 'UNAVAILABLE',
          message: `"${foodDoc.name}" is currently sold out and has been removed from your basket.`
        });
        continue;
      }

      // Check if ID was migrated or details updated
      const isMigrated = String(foodId) !== String(foodDoc._id);
      const isPriceUpdated = item.food?.price && Number(item.food.price) !== foodDoc.price;
      if (isMigrated || isPriceUpdated) {
        hasChanges = true;
      }

      validItems.push({
        food: {
          _id: foodDoc._id,
          id: foodDoc._id,
          name: foodDoc.name,
          hindiName: foodDoc.hindiName || '',
          description: foodDoc.description,
          price: foodDoc.price,
          category: foodDoc.category,
          image: foodDoc.image,
          isVegetarian: foodDoc.isVegetarian,
          vegetarian: foodDoc.isVegetarian,
          isAvailable: foodDoc.isAvailable,
          stock: foodDoc.stock
        },
        quantity,
        specialInstructions: item.specialInstructions || ''
      });
    }

    return res.json({
      success: true,
      hasChanges,
      validItems,
      removedItems,
      count: validItems.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getFeaturedFoods,
  getFoodById,
  getCategories,
  validateCartItems,
  resolveFoodDocument,
  localFoods
};
