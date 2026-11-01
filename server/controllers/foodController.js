// ============================================================================
// The Indian Rasoi — Food Controller
// Implements:
// - Pagination, search, category filtering, vegetarian filtering, sorting
// - Resilient fallback to sample menu data when database is being configured.
// ============================================================================

const Food = require('../models/Food');
const { sampleFoods } = require('../scripts/seedFoods');
const { isDbConnected } = require('../config/db');

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

    // Check if database is connected
    if (!isDbConnected()) {
      // Offline / Setup Fallback mode with consistent _id
      let filtered = sampleFoods.map((f, idx) => ({
        _id: f._id || `dish-${101 + idx}`,
        id: f._id || `dish-${101 + idx}`,
        ...f
      }));

      if (category && category !== 'All' && category !== 'Tous') {
        filtered = filtered.filter((f) => f.category === category);
      }

      if (vegetarian === 'true' || isVegetarian === 'true') {
        filtered = filtered.filter((f) => f.isVegetarian || f.dietary?.includes('Vegetarian'));
      }

      if (dietary && dietary !== 'All') {
        filtered = filtered.filter((f) => f.dietary?.includes(dietary));
      }

      if (search && search.trim() !== '') {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            (f.hindiName && f.hindiName.toLowerCase().includes(q)) ||
            (f.spanishName && f.spanishName.toLowerCase().includes(q)) ||
            f.ingredients?.some((ing) => ing.toLowerCase().includes(q))
        );
      }

      if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = limit === 'all' ? filtered : filtered.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: pageNum,
        totalPages,
        data: paginated,
        fallbackNotice: 'Served from sample dataset while MongoDB Atlas is being configured'
      });
    }

    // Build Mongoose Query
    const query = {};

    // Availability
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    } else {
      query.isAvailable = true;
    }

    // Category filter
    if (category && category !== 'All' && category !== 'Tous') {
      query.category = category;
    }

    // Vegetarian filter (checking isVegetarian field and dietary array)
    if (vegetarian === 'true' || isVegetarian === 'true') {
      query.$or = [
        { isVegetarian: true },
        { dietary: 'Vegetarian' }
      ];
    }

    // Specific dietary filter
    if (dietary && dietary !== 'All') {
      query.dietary = { $in: [dietary] };
    }

    // Search query across name, spanishName, description, and ingredients
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { name: searchRegex },
        { hindiName: searchRegex },
        { spanishName: searchRegex },
        { description: searchRegex },
        { ingredients: searchRegex },
        { winePairing: searchRegex }
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Sorting
    let sortOption = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    }

    // Total Count
    const total = await Food.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;
    const skip = (pageNum - 1) * limitNum;

    const foods = limit === 'all'
      ? await Food.find(query).sort(sortOption)
      : await Food.find(query).sort(sortOption).skip(skip).limit(limitNum);

    res.json({
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
    if (!isDbConnected()) {
      const featured = sampleFoods
        .map((f, idx) => ({ _id: f._id || `dish-${101 + idx}`, id: f._id || `dish-${101 + idx}`, ...f }))
        .filter((f) => f.isFeatured);
      return res.json({
        success: true,
        count: featured.length,
        data: featured
      });
    }

    const featured = await Food.find({ isFeatured: true, isAvailable: true }).limit(6);
    res.json({
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

    if (!isDbConnected()) {
      const foods = sampleFoods.map((f, idx) => ({
        _id: f._id || `dish-${101 + idx}`,
        id: f._id || `dish-${101 + idx}`,
        ...f
      }));
      const food = foods.find((f) => f._id === id || f.id === id);
      if (!food) {
        return res.status(404).json({ success: false, message: 'Menu item not found.' });
      }
      return res.json({ success: true, data: food });
    }

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.'
      });
    }

    res.json({
      success: true,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of menu categories with counts
// @route   GET /api/foods/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categoryNames = [
      'North Indian',
      'South Indian',
      'Street Food',
      'Breads',
      'Rice & Biryani',
      'Desserts',
      'Beverages'
    ];

    if (!isDbConnected()) {
      const counts = categoryNames.map((cat) => ({
        category: cat,
        count: sampleFoods.filter((f) => f.category === cat).length
      }));
      return res.json({ success: true, data: counts });
    }

    const counts = await Promise.all(
      categoryNames.map(async (cat) => {
        const count = await Food.countDocuments({ category: cat, isAvailable: true });
        return { category: cat, count };
      })
    );

    res.json({
      success: true,
      data: counts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getFeaturedFoods,
  getFoodById,
  getCategories
};
