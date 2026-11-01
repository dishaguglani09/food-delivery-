const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

// @desc    Get dashboard statistics for administrator
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        data: {
          totalRevenue: 48650.00,
          totalOrders: 42,
          totalUsers: 18,
          totalFoods: 18,
          activeDishes: 18,
          statusBreakdown: {
            'Confirmed': 4,
            'Kitchen Preparing': 3,
            'Dispatched': 2,
            'Delivered': 31,
            'Cancelled': 2
          },
          recentOrders: []
        }
      });
    }

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalFoods = await Food.countDocuments();
    const activeDishes = await Food.countDocuments({ isAvailable: true });

    // Aggregate revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
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

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
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

// @desc    Get all orders across system
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

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.food', 'name image price category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Allowed order status transitions
const ALLOWED_TRANSITIONS = {
  'Confirmed': ['Kitchen Preparing', 'Cancelled'],
  'Kitchen Preparing': ['Dispatched', 'Cancelled'],
  'Dispatched': ['Delivered', 'Cancelled'],
  'Delivered': [],
  'Cancelled': []
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = [
      'Confirmed',
      'Kitchen Preparing',
      'Dispatched',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Guard terminal states
    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of a ${order.orderStatus.toLowerCase()} order.`
      });
    }

    // Validate transition
    const allowed = ALLOWED_TRANSITIONS[order.orderStatus] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from "${order.orderStatus}" to "${status}". Allowed transitions: ${allowed.join(', ') || 'None'}`
      });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    const statusNote = note || `Status updated to ${status} by head chef.`;

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: statusNote
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new menu item
// @route   POST /api/admin/foods
// @access  Private/Admin
const createFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({
      success: true,
      message: 'New dish created successfully.',
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing menu item
// @route   PUT /api/admin/foods/:id
// @access  Private/Admin
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!food) {
      return res.status(404).json({ success: false, message: 'Dish not found.' });
    }

    res.json({
      success: true,
      message: 'Dish updated successfully.',
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/admin/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Dish not found.' });
    }

    res.json({
      success: true,
      message: 'Dish deleted successfully from the menu.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle dish availability
// @route   PATCH /api/admin/foods/:id/toggle-availability
// @access  Private/Admin
const toggleFoodAvailability = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Dish not found.' });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({
      success: true,
      message: `Dish marked as ${food.isAvailable ? 'Available' : 'Sold Out'}.`,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Count orders for each user
    const usersWithOrderCount = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ customer: u._id });
        return {
          ...u.toObject(),
          orderCount
        };
      })
    );

    res.json({
      success: true,
      data: usersWithOrderCount
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
