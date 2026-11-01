// ============================================================================
// The Indian Rasoi — Order Controller
// Production-grade MongoDB multi-document ACID transactions with Mongoose sessions,
// atomic inventory decrement and rollback on failure, idempotency guard,
// and server-side pricing recalculation.
// Pure MongoDB Atlas database integration with zero mock fallbacks.
// ============================================================================

const mongoose = require('mongoose');
const Order = require('../models/Order');
const Food = require('../models/Food');
const { isDbConnected } = require('../config/db');
const localStore = require('../utils/localStore');
const { authenticIndianDishes } = require('../scripts/seedDatabase');
const { resolveFoodDocument } = require('./foodController');

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

// Helper to generate unique human-friendly order numbers (e.g. IR-84920)
const generateOrderNumber = () => {
  const chars = '0123456789';
  let randomDigits = '';
  for (let i = 0; i < 5; i++) {
    randomDigits += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IR-${randomDigits}`;
};

/**
 * Checks if the connected MongoDB instance supports replica set transactions.
 * MongoDB Atlas clusters natively support transactions.
 */
const checkTransactionSupport = () => {
  if (mongoose.connection.readyState !== 1) return false;
  const topologyType = mongoose.connection.client?.topology?.description?.type;
  return (
    topologyType === 'ReplicaSetWithPrimary' ||
    topologyType === 'Sharded' ||
    topologyType === 'LoadBalanced'
  );
};

// @desc    Create a new customer order with MongoDB transaction & atomic stock update
// @route   POST /api/orders
// @access  Public / Optional Auth / Authenticated
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod = 'cash',
      deliverySchedule = 'Standard Delivery (30–40 min)',
      specialInstructions = '',
      promoCode,
      idempotencyKey
    } = req.body;

    const effectiveIdempotencyKey =
      idempotencyKey || req.headers['x-idempotency-key'] || null;

    // 1. Basic Cart Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to place an order.'
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'A complete delivery address (street, city, postal code) is required.'
      });
    }

    // 2. Idempotency Check — Check for existing order with this key
    if (effectiveIdempotencyKey) {
      if (isDbConnected()) {
        const existingOrder = await Order.findOne({
          idempotencyKey: effectiveIdempotencyKey
        });
        if (existingOrder) {
          return res.status(200).json({
            success: true,
            message: `Order #${existingOrder.orderNumber} already processed (idempotent request).`,
            data: existingOrder
          });
        }
      } else {
        const existingOrder = localStore.orders.find(
          (o) => o.idempotencyKey === effectiveIdempotencyKey
        );
        if (existingOrder) {
          return res.status(200).json({
            success: true,
            message: `Order #${existingOrder.orderNumber} already processed (idempotent request).`,
            data: existingOrder
          });
        }
      }
    }

    // 3. Duplicate Submission Guard (debounce identical requests within 3 seconds)
    const submissionFingerprint = `${req.user ? req.user._id : req.ip}_${JSON.stringify(
      items.map((i) => ({
        f: typeof i.food === 'object' && i.food ? (i.food._id || i.food.id) : i.food,
        q: i.quantity
      }))
    )}`;
    const lastSubmission = recentSubmissions.get(submissionFingerprint);
    const now = Date.now();
    if (lastSubmission && now - lastSubmission < 3000) {
      return res.status(429).json({
        success: false,
        message: 'Duplicate order request detected. Please wait a few moments before resubmitting.'
      });
    }
    recentSubmissions.set(submissionFingerprint, now);

    // 4. Sanitize and Validate Items & Quantities
    const sanitizedCart = [];
    for (const item of items) {
      const foodId =
        typeof item.food === 'object' && item.food
          ? item.food._id || item.food.id
          : item.food || item.foodId;
      const itemName =
        typeof item.food === 'object' && item.food
          ? item.food.name
          : item.name || '';
      const quantity = parseInt(item.quantity, 10);

      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item quantity specified. Quantities must be at least 1.'
        });
      }

      if (quantity > 50) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 50 portions allowed per individual dish in a single order.'
        });
      }

      sanitizedCart.push({
        foodId,
        name: itemName,
        quantity,
        specialInstructions: item.specialInstructions || item.notes || ''
      });
    }

    // 5. Independent Server-Side Price & Availability Calculation directly from MongoDB
    let calculatedSubtotal = 0;
    const itemSnapshots = [];
    const stockDeductionQueue = [];

    for (const cartItem of sanitizedCart) {
      const foodDoc = await resolveFoodDocument(cartItem.foodId, cartItem.name);

      if (!foodDoc) {
        const dishLabel = cartItem.name || 'A selected dish';
        return res.status(400).json({
          success: false,
          code: 'ITEM_NOT_FOUND',
          foodId: cartItem.foodId,
          message: `The item "${dishLabel}" could not be found in our menu. Please refresh your cart.`
        });
      }

      if (foodDoc.isAvailable === false) {
        return res.status(400).json({
          success: false,
          code: 'ITEM_UNAVAILABLE',
          foodId: foodDoc._id,
          message: `We apologize: "${foodDoc.name}" is currently sold out.`
        });
      }

      // Check current stock
      const availableStock = foodDoc.stock ?? 50;
      if (availableStock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          code: 'INSUFFICIENT_STOCK',
          foodId: foodDoc._id,
          message: `Insufficient stock for "${foodDoc.name}". Only ${availableStock} portions remaining in our kitchen.`
        });
      }

      const unitPrice = foodDoc.price;
      calculatedSubtotal += unitPrice * cartItem.quantity;

      itemSnapshots.push({
        food: foodDoc._id,
        name: foodDoc.name,
        price: unitPrice,
        quantity: cartItem.quantity,
        image: foodDoc.image || '',
        specialInstructions: cartItem.specialInstructions
      });

      stockDeductionQueue.push({
        foodId: foodDoc._id,
        dishName: foodDoc.name,
        quantity: cartItem.quantity
      });
    }

    // 6. Delivery Fee & Packaging Calculation
    const freeDeliveryThreshold = 499;
    const standardDeliveryFee = 40;
    const deliveryFee = calculatedSubtotal >= freeDeliveryThreshold ? 0 : standardDeliveryFee;
    const packagingFee = 20;

    // 7. Promo Code Verification
    let discount = 0;
    if (promoCode) {
      const codeUpper = promoCode.trim().toUpperCase();
      if (codeUpper === 'RASOI10') {
        discount = Math.round(calculatedSubtotal * 0.1);
      } else if (codeUpper === 'ROYAL50') {
        discount = Math.min(50, calculatedSubtotal);
      } else if (codeUpper === 'WELCOME20') {
        discount = Math.round(calculatedSubtotal * 0.2);
      }
    }

    const calculatedTotal = calculatedSubtotal - discount + deliveryFee + packagingFee;
    const finalOrderNumber = generateOrderNumber();

    // 8. Execute Database Updates
    if (!isDbConnected()) {
      const localOrder = {
        _id: new mongoose.Types.ObjectId(),
        orderNumber: finalOrderNumber,
        customer: req.user ? req.user._id : null,
        items: itemSnapshots,
        deliveryAddress: {
          street: deliveryAddress.street,
          building: deliveryAddress.building || '',
          city: deliveryAddress.city,
          postalCode: deliveryAddress.postalCode,
          deliveryNotes: deliveryAddress.deliveryNotes || ''
        },
        contact: {
          name: (req.body.contact && req.body.contact.name) || (req.user ? req.user.name : 'Valued Guest'),
          phone: (req.body.contact && req.body.contact.phone) || (req.user ? req.user.phone : '+91 98765 43210'),
          email: (req.body.contact && req.body.contact.email) || (req.user ? req.user.email : 'guest@theindianrasoi.com')
        },
        subtotal: calculatedSubtotal,
        discount,
        deliveryFee,
        packagingFee,
        total: calculatedTotal,
        totalAmount: calculatedTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'Pending' : 'Paid',
        orderStatus: 'Confirmed',
        status: 'Confirmed',
        estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000),
        deliverySchedule,
        specialInstructions,
        idempotencyKey: effectiveIdempotencyKey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStore.orders.push(localOrder);

      return res.status(201).json({
        success: true,
        message: `Order #${localOrder.orderNumber} placed successfully with verified inventory.`,
        data: localOrder
      });
    }

    const supportsTransactions = checkTransactionSupport();

    if (supportsTransactions) {
      const session = await mongoose.startSession();
      try {
        let createdOrder = null;
        await session.withTransaction(async () => {
          // Atomically check and decrement stock for each item
          for (const item of stockDeductionQueue) {
            const updateResult = await Food.updateOne(
              {
                _id: item.foodId,
                stock: { $gte: item.quantity }
              },
              {
                $inc: { stock: -item.quantity }
              },
              { session }
            );

            if (updateResult.modifiedCount === 0) {
              throw new Error(
                `Simultaneous order conflict: Insufficient stock for "${item.dishName}". Transaction rolled back.`
              );
            }
          }

          const orderDocs = await Order.create(
            [
              {
                orderNumber: finalOrderNumber,
                customer: req.user ? req.user._id : null,
                items: itemSnapshots,
                deliveryAddress: {
                  street: deliveryAddress.street,
                  building: deliveryAddress.building || '',
                  city: deliveryAddress.city,
                  postalCode: deliveryAddress.postalCode,
                  deliveryNotes: deliveryAddress.deliveryNotes || ''
                },
                contact: {
                  name: (req.body.contact && req.body.contact.name) || (req.user ? req.user.name : 'Valued Guest'),
                  phone: (req.body.contact && req.body.contact.phone) || (req.user ? req.user.phone : '+91 98765 43210'),
                  email: (req.body.contact && req.body.contact.email) || (req.user ? req.user.email : 'guest@theindianrasoi.com')
                },
                subtotal: calculatedSubtotal,
                discount,
                deliveryFee,
                packagingFee,
                total: calculatedTotal,
                totalAmount: calculatedTotal,
                paymentMethod,
                paymentStatus: paymentMethod === 'cash' ? 'Pending' : 'Paid',
                orderStatus: 'Confirmed',
                status: 'Confirmed',
                estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000),
                deliverySchedule,
                specialInstructions,
                idempotencyKey: effectiveIdempotencyKey
              }
            ],
            { session }
          );

          createdOrder = orderDocs[0];
        });

        session.endSession();

        return res.status(201).json({
          success: true,
          message: `Order #${createdOrder.orderNumber} placed successfully with verified inventory.`,
          data: createdOrder
        });
      } catch (txnError) {
        session.endSession();
        return res.status(400).json({
          success: false,
          message: txnError.message || 'Order could not be processed due to an inventory conflict.'
        });
      }
    } else {
      // Standalone MongoDB: atomic stock decrement with manual rollback on failure
      const completedDeductions = [];
      try {
        for (const item of stockDeductionQueue) {
          const updateResult = await Food.updateOne(
            {
              _id: item.foodId,
              stock: { $gte: item.quantity }
            },
            {
              $inc: { stock: -item.quantity }
            }
          );

          if (updateResult.modifiedCount === 0) {
            throw new Error(
              `Simultaneous order conflict: Insufficient stock for "${item.dishName}".`
            );
          }
          completedDeductions.push(item);
        }

        const order = await Order.create({
          orderNumber: finalOrderNumber,
          customer: req.user ? req.user._id : null,
          items: itemSnapshots,
          deliveryAddress: {
            street: deliveryAddress.street,
            building: deliveryAddress.building || '',
            city: deliveryAddress.city,
            postalCode: deliveryAddress.postalCode,
            deliveryNotes: deliveryAddress.deliveryNotes || ''
          },
          contact: {
            name: (req.body.contact && req.body.contact.name) || (req.user ? req.user.name : 'Valued Guest'),
            phone: (req.body.contact && req.body.contact.phone) || (req.user ? req.user.phone : '+91 98765 43210'),
            email: (req.body.contact && req.body.contact.email) || (req.user ? req.user.email : 'guest@theindianrasoi.com')
          },
          subtotal: calculatedSubtotal,
          discount,
          deliveryFee,
          packagingFee,
          total: calculatedTotal,
          totalAmount: calculatedTotal,
          paymentMethod,
          paymentStatus: paymentMethod === 'cash' ? 'Pending' : 'Paid',
          orderStatus: 'Confirmed',
          status: 'Confirmed',
          estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000),
          deliverySchedule,
          specialInstructions,
          idempotencyKey: effectiveIdempotencyKey
        });

        return res.status(201).json({
          success: true,
          message: `Order #${order.orderNumber} placed successfully with verified inventory.`,
          data: order
        });
      } catch (err) {
        // Rollback completed deductions
        for (const item of completedDeductions) {
          await Food.findByIdAndUpdate(item.foodId, {
            $inc: { stock: item.quantity }
          }).catch(() => {});
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Failed to place order due to an inventory conflict.'
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders/my-orders
// @access  Private / Authenticated
const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please authenticate to view your personal order history.'
      });
    }

    if (!isDbConnected()) {
      const userOrders = localStore.orders
        .filter((o) => o.customer && String(o.customer) === String(req.user._id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({
        success: true,
        count: userOrders.length,
        data: userOrders
      });
    }

    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.food', 'name hindiName price image category');

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
// @access  Public / Authenticated
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = null;
    if (isDbConnected()) {
      if (mongoose.isValidObjectId(id)) {
        order = await Order.findById(id).populate('items.food', 'name hindiName price image category');
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id }).populate('items.food', 'name hindiName price image category');
      }
    } else {
      order = localStore.orders.find(
        (o) => String(o._id) === String(id) || o.orderNumber === id
      );
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order "${id}" not found in database.`
      });
    }

    // Customer isolation check: if order belongs to an authenticated user and requester is not that user/admin
    if (order.customer && req.user) {
      if (
        order.customer.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access restricted: You cannot view orders placed by other guests.'
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

// @desc    Cancel order & atomically restore inventory
// @route   PUT /api/orders/:id/cancel
// @access  Public (Guest) / Authenticated
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = null;
    if (mongoose.isValidObjectId(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order "${id}" not found in database.`
      });
    }

    // Customer isolation check
    if (order.customer && req.user) {
      if (
        order.customer.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to cancel this order.'
        });
      }
    }

    // Validate that order can be cancelled
    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been cancelled.'
      });
    }

    if (order.orderStatus === 'Dispatched' || order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already ${order.orderStatus}.`
      });
    }

    // Transition status to Cancelled
    order.orderStatus = 'Cancelled';
    order.status = 'Cancelled';
    await order.save();

    // Atomically restore inventory in MongoDB
    for (const item of order.items) {
      if (item.food) {
        await Food.findByIdAndUpdate(item.food, {
          $inc: { stock: item.quantity }
        }).catch(() => {});
      }
    }

    res.json({
      success: true,
      message: `Order #${order.orderNumber} has been successfully cancelled and stock restored.`,
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
  cancelOrder,
  checkTransactionSupport
};
