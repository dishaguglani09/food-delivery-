// ============================================================================
// The Indian Rasoi — Restaurant Mongoose Model
// Stores all dynamic branding, culinary story, contact coordinates,
// opening hours, delivery fees, why-us philosophy pillars, and guest testimonials.
// ============================================================================

const mongoose = require('mongoose');

const whyUsPillarSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    enum: ['Flame', 'ShieldCheck', 'Wine', 'Leaf', 'Award', 'Heart']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  badge: {
    type: String,
    default: ''
  }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  badge: {
    type: String,
    default: 'Verified Diner'
  },
  dish: {
    type: String,
    default: ''
  }
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'The Indian Rasoi',
    trim: true
  },
  monogram: {
    type: String,
    default: 'IR'
  },
  tagline: {
    type: String,
    default: 'Authentic Indian Flavors & Royal Biryanis',
    trim: true
  },
  description: {
    type: String,
    default: 'Experience the timeless recipes of Delhi, Awadh, and Punjab united with slow-cooked dum traditions and fresh hand-ground spices.',
    trim: true
  },
  story: {
    headline: {
      type: String,
      default: 'A Century of Royal Recipes & Pure Devotion'
    },
    subhead: {
      type: String,
      default: 'Where Awadhi dum traditions meet the clay ovens of Punjab.'
    },
    narrative: [{
      type: String
    }],
    foundedYear: {
      type: Number,
      default: 1998
    },
    cityLocation: {
      type: String,
      default: 'Delhi & Connaught Place'
    },
    chefQuote: {
      quote: {
        type: String,
        default: 'True Indian dining is an act of deep patience. We slow-simmer our dal overnight over embers, knead whole wheat dough with churned ghee, and blend whole cardamom and mace by stone mortar.'
      },
      author: {
        type: String,
        default: 'Master Chef Rajesh Kumar'
      },
      title: {
        type: String,
        default: 'Custodian of Royal Awadhi & Punjabi Traditions'
      }
    },
    keyHighlights: [{
      type: String
    }]
  },
  contact: {
    address: {
      type: String,
      default: 'Block B, Connaught Place, New Delhi, Delhi 110001, India'
    },
    street: {
      type: String,
      default: 'Block B, Inner Circle, Connaught Place'
    },
    city: {
      type: String,
      default: 'New Delhi'
    },
    state: {
      type: String,
      default: 'Delhi'
    },
    postalCode: {
      type: String,
      default: '110001'
    },
    country: {
      type: String,
      default: 'India'
    },
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    email: {
      type: String,
      default: 'namaste@theindianrasoi.com'
    },
    hours: {
      lunch: {
        type: String,
        default: '12:00 PM – 3:30 PM'
      },
      dinner: {
        type: String,
        default: '7:00 PM – 11:30 PM'
      },
      delivery: {
        type: String,
        default: '12:00 PM – 11:30 PM (Daily)'
      }
    }
  },
  delivery: {
    estimatedTime: {
      type: String,
      default: '30–40 min'
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 499
    },
    standardDeliveryFee: {
      type: Number,
      default: 40
    },
    packagingFee: {
      type: Number,
      default: 20
    }
  },
  whyUs: [whyUsPillarSchema],
  testimonials: [testimonialSchema],
  heroSpotlightDish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

