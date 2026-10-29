// ============================================================================
// CASA TÒPAZ — Food Mongoose Model
// Strict adherence to menu specification:
// - name, description, price, image, category, vegetarian status,
//   availability, and featured status.
// ============================================================================

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide dish name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  spanishName: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please provide dish description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide dish price'],
    min: [0, 'Price must be greater than or equal to 0']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: [
      'Pinchos & Tapas',
      'Cazuelas & Plats Chauds',
      'Charcuterie & Fromages',
      'Postres & Douceurs',
      'Vinos & Cocktails'
    ]
  },
  image: {
    type: String,
    required: [true, 'Please provide dish image URL']
  },
  isVegetarian: {
    type: Boolean,
    required: true,
    default: false
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  prepTime: {
    type: String,
    default: '15-20 min'
  },
  calories: {
    type: Number,
    default: 380
  },
  spiceLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  dietary: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Chef Special', 'Organic', 'AOP Certified', 'Spicy']
  }],
  winePairing: {
    type: String,
    default: ''
  },
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 4.9,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 24
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual aliases for versatile frontend consumption
foodSchema.virtual('vegetarian').get(function () {
  return this.isVegetarian;
});

foodSchema.virtual('availability').get(function () {
  return this.isAvailable;
});

foodSchema.virtual('featured').get(function () {
  return this.isFeatured;
});

// Pre-save hook to ensure isVegetarian stays synchronized with dietary array
foodSchema.pre('save', function (next) {
  if (Array.isArray(this.dietary) && this.dietary.includes('Vegetarian')) {
    this.isVegetarian = true;
  }
  next();
});

// Create text index for search queries
foodSchema.index({
  name: 'text',
  spanishName: 'text',
  description: 'text',
  ingredients: 'text'
});

module.exports = mongoose.model('Food', foodSchema);
