// ============================================================================
// CASA TÒPAZ — Order Mongoose Model
// Strict adherence to order specification:
// - product name and unit-price snapshots
// - quantities
// - delivery address snapshot
// - subtotal, delivery fee, total
// - payment method, payment status, order status
// - timestamps
// ============================================================================

const mongoose = require('mongoose');

// Snapshot of individual product at moment of purchase
const orderItemSnapshotSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  },
  name: {
    type: String,
    required: [true, 'Product name snapshot is required']
  },
  price: {
    type: Number,
    required: [true, 'Unit price snapshot is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String,
    default: ''
  },
  specialInstructions: {
    type: String,
    default: ''
  }
}, { _id: false });

// Snapshot of delivery address at moment of purchase
const deliveryAddressSnapshotSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street address is required']
  },
  building: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required']
  },
  country: {
    type: String,
    default: 'Switzerland'
  },
  deliveryNotes: {
    type: String,
    default: ''
  }
}, { _id: false });

const orderStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  contact: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  items: {
    type: [orderItemSnapshotSchema],
    validate: [
      (val) => Array.isArray(val) && val.length > 0,
      'Order must contain at least one item'
    ]
  },
  deliveryAddress: {
    type: deliveryAddressSnapshotSchema,
    required: true
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    default: 0
  },
  packagingFee: {
    type: Number,
    default: 2.50
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: [true, 'Order total is required'],
    min: 0
  },
  totalAmount: {
    type: Number
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    default: 'twint'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
    default: 'Paid'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      'Confirmed',
      'Kitchen Preparing',
      'Dispatched',
      'Delivered',
      'Cancelled'
    ],
    default: 'Confirmed'
  },
  deliverySchedule: {
    type: String,
    default: 'Immédiat (~35 min)'
  },
  courier: {
    name: { type: String, default: 'Mateo De La Vega' },
    phone: { type: String, default: '+41 78 440 22 19' },
    transport: { type: String, default: 'Thermal Sealed Cargo E-Bike (Zero Emission)' },
    rating: { type: Number, default: 4.98 }
  },
  statusHistory: [orderStatusHistorySchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Sync total and totalAmount on save
orderSchema.pre('save', function (next) {
  if (this.total !== undefined && this.totalAmount === undefined) {
    this.totalAmount = this.total;
  } else if (this.totalAmount !== undefined && this.total === undefined) {
    this.total = this.totalAmount;
  }
  next();
});

// Virtual status getter
orderSchema.virtual('status').get(function () {
  return this.orderStatus;
});

// Virtual pricing getter for frontend compatibility
orderSchema.virtual('pricing').get(function () {
  return {
    subtotal: this.subtotal,
    deliveryFee: this.deliveryFee,
    packagingFee: this.packagingFee,
    discount: this.discount,
    total: this.total ?? this.totalAmount ?? 0
  };
});

// Virtual statusStep getter for tracker UI stepper
orderSchema.virtual('statusStep').get(function () {
  switch (this.orderStatus) {
    case 'Confirmed': return 1;
    case 'Kitchen Preparing':
    case 'Preparing': return 2;
    case 'Dispatched': return 3;
    case 'Delivered': return 4;
    default: return 1;
  }
});

module.exports = mongoose.model('Order', orderSchema);
