// ============================================================================
// The Indian Rasoi — Restaurant Controller
// Pure MongoDB Atlas database integration for restaurant profile, branding,
// culinary story, contact coordinates, hours, why-us philosophy, and testimonials.
// ============================================================================

const Restaurant = require('../models/Restaurant');
const { isDbConnected } = require('../config/db');

// Default initial document structure if collection is empty
const defaultRestaurantData = {
  name: 'The Indian Rasoi',
  monogram: 'IR',
  tagline: 'Authentic Indian Flavors & Royal Biryanis',
  description: 'Experience the timeless recipes of Delhi, Awadh, and Punjab united with slow-cooked dum traditions and fresh hand-ground spices.',
  story: {
    headline: 'A Century of Royal Recipes & Pure Devotion',
    subhead: 'Where Awadhi dum traditions meet the clay ovens of Punjab.',
    narrative: [
      'Founded on the culinary heritage of Old Delhi and Awadhi royal kitchens, The Indian Rasoi was born from a desire to bring time-honored Indian recipes to life without shortcuts or compromise.',
      'Our khansamas practice the revered art of dum pukht—cooking in heavy sealed handis over gentle charcoal embers. Every spice blend is stone-ground in small batches daily: whole black cardamom, royal mace, fragrant Kashmiri saffron, and organic bay leaves.',
      'From simmering our Dal Makhani for 16 slow hours in pure cow ghee to baking fresh garlic naans to blistered perfection inside live charcoal clay tandoors, we serve an authentic feast worthy of emperors.'
    ],
    foundedYear: 1998,
    cityLocation: 'Delhi & Connaught Place',
    chefQuote: {
      quote: 'True Indian dining is an act of deep patience. We slow-simmer our dal overnight over embers, knead whole wheat dough with churned ghee, and blend whole cardamom and mace by stone mortar.',
      author: 'Master Chef Rajesh Kumar',
      title: 'Custodian of Royal Awadhi & Punjabi Traditions'
    },
    keyHighlights: [
      '100% Pure Desi Cow Ghee & hand-ground garam masala',
      'Charcoal-fired heirloom clay tandoor baked naans & rotis',
      'Overnight 16-hour slow-simmered Dal Makhani',
      'Sealed handi Awadhi & Hyderabadi Dum Biryanis'
    ]
  },
  contact: {
    address: 'Block B, Connaught Place, New Delhi, Delhi 110001, India',
    street: 'Block B, Inner Circle, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    phone: '+91 98765 43210',
    email: 'namaste@theindianrasoi.com',
    hours: {
      lunch: '12:00 PM – 3:30 PM',
      dinner: '7:00 PM – 11:30 PM',
      delivery: '12:00 PM – 11:30 PM (Daily)'
    }
  },
  delivery: {
    estimatedTime: '30–40 min',
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 40,
    packagingFee: 20
  },
  whyUs: [
    {
      icon: 'Flame',
      title: 'Charcoal Tandoor & Dum Cooking',
      subtitle: 'Heirloom clay oven traditions',
      description: 'Our dishes are crafted using traditional clay tandoors and slow-simmered handis that infuse authentic smoky flavors, velvety textures, and deep spice aromatics right to your dining table.',
      badge: 'Royal Handi & Tandoor'
    },
    {
      icon: 'ShieldCheck',
      title: 'Pure Desi Ghee & Fresh Spices',
      subtitle: 'Zero artificial preservatives',
      description: 'We never compromise on purity: stone-ground spices, whole green cardamom, saffron strands, and 100% pure cow ghee with no artificial food colors or synthetic flavor enhancers.',
      badge: '100% Pure & Fresh'
    },
    {
      icon: 'Wine',
      title: 'Artisanal Chai & Lassi Cellar',
      subtitle: 'Traditional beverages & coolers',
      description: 'Every meal features authentic refreshments: slow-brewed Kullad Masala Chai with ginger and cardamom, Alphonso mango lassi, and cooling sweet churned yogurt drinks.',
      badge: 'Desi Rasoi Beverages'
    },
    {
      icon: 'Leaf',
      title: 'Insulated Hot Food Dispatch',
      subtitle: 'Fresh & spill-proof packaging',
      description: 'All curries, gravies, and biryanis are delivered in sealed, insulated, leak-proof food-grade containers so your naans stay crisp and curries arrive steaming hot.',
      badge: 'Thermal Preservation'
    }
  ],
  testimonials: [
    {
      name: 'Aditya & Sunita Verma',
      role: 'Food & Wine Critics · Delhi Gastronomy',
      comment: 'The Butter Chicken and Dal Makhani at The Indian Rasoi remind me of the great royal banquets of Awadh. Rich, velvety, and balanced with pure cow ghee. Truly the finest delivery in the capital.',
      rating: 5,
      badge: 'Royal Awadhi Feast',
      dish: 'Murgh Makhani & Dal Makhani'
    },
    {
      name: 'Pooja Singhania',
      role: 'Executive Director · Connaught Place',
      comment: 'Ordered the Hyderabadi Dum Biryani and Garlic Naans for our boardroom dinner. The sealed handi kept the aroma intact and the meat was exquisitely tender. Unmatched packaging and punctuality.',
      rating: 5,
      badge: 'Corporate Dining Order',
      dish: 'Hyderabadi Dum Chicken Biryani'
    },
    {
      name: 'Vikram & Meera Mehta',
      role: 'Heritage Diners & Culinary Enthusiasts',
      comment: 'Authentic Indian dining is rare to find delivered in 35 minutes with this level of excellence. The Masala Dosa arrived crisp with steaming sambhar, and the Gulab Jamuns were warm and heavenly.',
      rating: 5,
      badge: 'Verified Rasoi Diner',
      dish: 'Crispy Masala Dosa & Gulab Jamun'
    }
  ]
};

// @desc    Get complete restaurant profile, branding, story, contact, and why-us
// @route   GET /api/restaurant
// @access  Public
const getRestaurantInfo = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        data: defaultRestaurantData
      });
    }

    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create(defaultRestaurantData);
    }
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant testimonials
// @route   GET /api/restaurant/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        data: defaultRestaurantData.testimonials || []
      });
    }

    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create(defaultRestaurantData);
    }
    res.json({
      success: true,
      data: restaurant.testimonials || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant profile (Admin only)
// @route   PUT /api/restaurant
// @access  Private/Admin
const updateRestaurantInfo = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create({ ...defaultRestaurantData, ...req.body });
    } else {
      Object.assign(restaurant, req.body);
      restaurant = await restaurant.save();
    }
    res.json({
      success: true,
      message: 'Restaurant profile updated successfully.',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurantInfo,
  getTestimonials,
  updateRestaurantInfo,
  defaultRestaurantData
};

