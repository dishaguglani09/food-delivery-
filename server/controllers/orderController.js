// ============================================================================
// The Indian Rasoi — Order Controller
// Implements order creation with product name & unit-price snapshots,
// delivery address snapshot, subtotal, delivery fee, total, payment status,
// and order status lifecycle.
// ============================================================================

const Order = require('../models/Order');
const Food = require('../models/Food');
const { sampleFoods } = require('../scripts/seedFoods');
const { isDbConnected } = require('../config/db');

// In-memory cache for dev/simulated sessions when MongoDB Atlas is offline
const simulatedOrders = new Map();

// Cache to prevent rapid duplicate submissions within 3 seconds
const recentSubmissions = new Map();

// Periodic cleanup of recent submissions cache
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 10000) {
      recentSubmissions.delete(key);
    }
  }
}, 30000);

// Helper to generate unique human-friendly order numbers
const generateOrderNumber = () => {
  const chars = '0123456789';
  let randomDigits = '';
  for (let i = 0; i < 5; i++) {
    randomDigits += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IR-${randomDigits}`;
};

// @desc    Create a new customer order with snapshots
// @route   POST /api/orders
// @access  Private / Authenticated
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod = 'cash',
      deliverySchedule = 'Immediate (~30-40 min)',
      specialInstructions = '',
      promoCode
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to place an order.'
      });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'A complete delivery address (street, city, postal code) is required.'
      });
    }

    // Duplicate submission guard (debounce identical requests within 3 seconds)
    const submissionKey = `${req.user ? req.user._id : req.ip}_${JSON.stringify(items.map((i) => ({ f: i.food, q: i.quantity })))}`;
    const lastSubmission = recentSubmissions.get(submissionKey);
    const now = Date.now();
    if (lastSubmission && now - lastSubmission < 3000) {
      return res.status(429).json({
        success: false,
        message: 'Duplicate order detected. Please wait a few moments before resubmitting.'
      });
    }
    recentSubmissions.set(submissionKey, now);

    // Build item snapshots with unit-price & name
    let calculatedSubtotal = 0;
    const itemSnapshots = [];

    for (const item of items) {
      const foodId = typeof item.food === 'object' && item.food ? (item.food._id || item.food.id) : item.food;
      let foodDoc = null;
      if (isDbConnected() && foodId) {
        try {
          foodDoc = await Food.findById(foodId);
          if (foodDoc && foodDoc.isAvailable === false) {
            return res.status(400).json({
              success: false,
              message: `The culinary dish "${foodDoc.name}" is currently unavailable.`
            });
          }
        } catch {
          // Food not in DB or ID format mismatch
        }
      }

      // If not in DB, look up in server catalog to independently verify price and availability
      const sampleFallback = !foodDoc
        ? sampleFoods.find((f, idx) => f._id === foodId || `dish-${101 + idx}` === foodId || f.name === item.name)
        : null;

      if (sampleFallback && sampleFallback.isAvailable === false) {
        return res.status(400).json({
          success: false,
          message: `The culinary dish "${sampleFallback.name}" is currently unavailable.`
        });
      }

      // Snapshot price and name: prioritize DB values if found, then catalog, never client-controlled prices
      const name = foodDoc ? foodDoc.name : (sampleFallback ? sampleFallback.name : (item.name || item.food?.name || 'Artisan Dish'));
      const unitPrice = foodDoc ? foodDoc.price : (sampleFallback ? sampleFallback.price : 12.00);
      const image = foodDoc ? foodDoc.image : (sampleFallback ? sampleFallback.image : (item.image || item.food?.image || ''));
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const notes = item.specialInstructions || item.notes || '';

      calculatedSubtotal += unitPrice * quantity;

      itemSnapshots.push({
        food: foodDoc ? foodDoc._id : null,
        name,
        price: unitPrice,
        quantity,
        image,
        specialInstructions: notes
      });
    }

    // Free delivery over ₹499
    const deliveryFee = calculatedSubtotal >= 499.00 ? 0 : 40.00;
    const packagingFee = 20.00;

    // Promo code validation
    let discount = 0;
    if (promoCode) {
      const cleanCode = promoCode.toUpperCase().trim();
      if (cleanCode === 'RASOI10' || cleanCode === 'TOPAZ10') {
        discount = Number((calculatedSubtotal * 0.10).toFixed(2));
      } else if (cleanCode === 'DESI15' || cleanCode === 'BELLOTA15') {
        discount = Number((calculatedSubtotal * 0.15).toFixed(2));
      } else if (cleanCode === 'BHOJAN50' || cleanCode === 'TERROIR5') {
        discount = 50.00;
      }
    }

    const total = Number(Math.max(0, calculatedSubtotal - discount + deliveryFee + packagingFee).toFixed(2));
    const orderNumber = generateOrderNumber();

    const orderPayload = {
      orderNumber,
      customer: req.user ? req.user._id : null,
      contact: {
        name: req.body.contact?.name || req.user?.name || 'Priya Sharma',
        email: req.body.contact?.email || req.user?.email || 'priya.sharma@indianrasoi.com',
        phone: req.body.contact?.phone || req.user?.phone || '+91 98765 43210'
      },
      items: itemSnapshots,
      deliveryAddress: {
        street: deliveryAddress.street,
        building: deliveryAddress.building || '',
        city: deliveryAddress.city,
        postalCode: deliveryAddress.postalCode,
        country: deliveryAddress.country || 'India',
        deliveryNotes: deliveryAddress.deliveryNotes || ''
      },
      subtotal: Number(calculatedSubtotal.toFixed(2)),
      deliveryFee,
      packagingFee,
      discount,
      total,
      totalAmount: total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      deliverySchedule,
      courier: {
        name: 'Rahul Sharma',
        phone: '+91 98111 22334',
        transport: 'Thermal Insulated Delivery Bike',
        currentLocation: 'Connaught Place Outer Circle, 500m',
        rating: 4.98
      },
      statusHistory: [
        {
          status: 'Confirmed',
          timestamp: new Date(),
          note: 'Your order has been received by CASA TÒPAZ culinary atelier.'
        }
      ]
    };

    // If database is connected, persist to MongoDB
    if (isDbConnected()) {
      const order = await Order.create(orderPayload);
      return res.status(201).json({
        success: true,
        message: `Order #${order.orderNumber} placed successfully.`,
        data: order
      });
    }

    // Fallback response for offline database mode
    const offlineOrder = {
      _id: 'ord-' + Date.now(),
      ...orderPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    simulatedOrders.set(offlineOrder._id, offlineOrder);
    simulatedOrders.set(offlineOrder.orderNumber, offlineOrder);

    return res.status(201).json({
      success: true,
      message: `Order #${orderPayload.orderNumber} placed successfully (simulated session).`,
      data: offlineOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const allSimulated = Array.from(new Set(simulatedOrders.values()));
      const userSimulated = req.user
        ? allSimulated.filter((o) => o.customer && o.customer.toString() === req.user._id.toString())
        : allSimulated;

      return res.json({
        success: true,
        count: userSimulated.length,
        data: userSimulated
      });
    }

    const orders = await Order.find({ customer: req.user._id })
      .populate('items.food', 'name image price category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      const order = simulatedOrders.get(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found.'
        });
      }

      // Customer order isolation
      if (order.customer) {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required to view this order.'
          });
        }
        const custId = order.customer.toString();
        if (custId !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to view this order.'
          });
        }
      }

      return res.json({
        success: true,
        data: order
      });
    }

    const order = await Order.findOne({
      $or: [{ _id: id }, { orderNumber: id }]
    }).populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Customer order isolation
    if (order.customer) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to view this order.'
        });
      }
      const orderCustomerId = order.customer._id ? order.customer._id.toString() : order.customer.toString();
      if (orderCustomerId !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order.'
        });
      }
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel user order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelMyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.json({
        success: true,
        message: 'Order cancelled.'
      });
    }

    const order = await Order.findOne({
      $or: [{ _id: id }, { orderNumber: id }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Customer order isolation
    if (order.customer) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to modify this order.'
        });
      }
      const customerId = order.customer.toString();
      if (customerId !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to modify this order.'
        });
      }
    }

    if (order.orderStatus !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This order cannot be cancelled as kitchen preparation has already begun.'
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: 'Order was cancelled by the customer.'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelMyOrder
};
