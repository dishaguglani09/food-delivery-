// ============================================================================
// The Indian Rasoi — Admin Controller
// Pure MongoDB Atlas database integration via Mongoose ODM:
// - Aggregated financial metrics and real order volume
// - Real status breakdown and customer counts
// - Food catalog management (create, update, delete)
// - Order status updates with inventory restoration on cancellation
// - Zero hardcoded or mock statistics
// ============================================================================

const mongoose = require('mongoose');
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');

// @desc    Get dashboard statistics for administrator via Mongoose aggregations
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalFoods = await Food.countDocuments();
    const activeDishes = await Food.countDocuments({ isAvailable: true });

    // Aggregate revenue from non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? Number(revenueResult[0].totalRevenue.toFixed(2)) : 0;

    // Order status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    const statusMap = {
      'Confirmed': 0,
      'Kitchen Preparing': 0,
      'Dispatched': 0,
      'Delivered': 0,
      'Cancelled': 0
    };

    statusCounts.forEach((item) => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });

    // Recent 5 orders with populated customer details
    const recentOrders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalFoods,
        activeDishes,
        statusBreakdown: statusMap,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across system with filtering and pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status with inventory rollback if cancelled
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Confirmed', 'Kitchen Preparing', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    let order = null;
    if (mongoose.isValidObjectId(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found in database.'
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    // If order was cancelled and was not already cancelled, restore inventory
    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        if (item.food) {
          await Food.findByIdAndUpdate(item.food, {
            $inc: { stock: item.quantity }
          });
        }
      }
    }

    const updated = await order.save();

    res.json({
      success: true,
      message: `Order #${order.orderNumber} status transitioned to "${status}".`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new dish to the food catalog
// @route   POST /api/admin/foods
// @access  Private/Admin
const createFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({
      success: true,
      message: 'New dish created successfully in catalog.',
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing dish
// @route   PUT /api/admin/foods/:id
// @access  Private/Admin
const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found.'
      });
    }

    res.json({
      success: true,
      message: 'Food item updated successfully.',
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a dish from the food catalog
// @route   DELETE /api/admin/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found.'
      });
    }

    res.json({
      success: true,
      message: 'Food item removed successfully from catalog.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle food item availability
// @route   PATCH /api/admin/foods/:id/toggle-availability
// @access  Private/Admin
const toggleFoodAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found.'
      });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({
      success: true,
      message: `"${food.name}" is now ${food.isAvailable ? 'available' : 'unavailable'}.`,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  createFood,
  updateFood,
  deleteFood,
  toggleFoodAvailability,
  getAllUsers
};
