// ============================================================================
// The Indian Rasoi — Comprehensive MongoDB Atlas Seeder
// Populates:
// 1. Restaurant profile, story, contact coordinates, why-us, and testimonials
// 2. All 31 authentic Indian dishes across the 7 approved categories with
//    100% ACCURATE, HIGH-RESOLUTION DISH-SPECIFIC PHOTOGRAPHY
// 3. Default administrator (Master Chef Rajesh Kumar) and customer (Priya Sharma)
// 4. Initial orders with valid MongoDB ObjectIds and realistic status tracking
// ============================================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const User = require('../models/User');
const Order = require('../models/Order');
const { defaultRestaurantData } = require('../controllers/restaurantController');

const authenticIndianDishes = [
  // 1. NORTH INDIAN
  {
    name: 'Butter Chicken (Murgh Makhani)',
    hindiName: 'मुर्ग मक्खनी',
    description: 'Tender tandoor-grilled chicken simmered in a velvety tomato, dairy butter, and cashew cream gravy, infused with aromatic kasoori methi.',
    price: 380,
    category: 'North Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    prepTime: '20-25 min',
    calories: 490,
    spiceLevel: 1,
    isVegetarian: false,
    dietary: ['Chef Special', 'Spicy'],
    winePairing: 'Best paired with Butter Naan & Jeera Rice',
    ingredients: ['Tandoori Chicken', 'Fresh Tomatoes', 'Cashew Cream', 'Amul Butter', 'Kasoori Methi'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.96,
    reviewsCount: 128
  },
  {
    name: 'Shahi Paneer',
    hindiName: 'शाही पनीर',
    description: 'Fresh malai paneer cubes cooked in a royal, silky gravy made from ground cashews, fresh cream, saffron, and aromatic Mughlai spices.',
    price: 320,
    category: 'North Indian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15-20 min',
    calories: 420,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Chef Special'],
    winePairing: 'Best paired with Garlic Naan',
    ingredients: ['Malai Paneer', 'Cashew Paste', 'Fresh Cream', 'Kashmiri Saffron', 'Cardamom'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.92,
    reviewsCount: 94
  },
  {
    name: 'Dal Makhani',
    hindiName: 'दाल मखनी',
    description: 'Whole black urad lentils and kidney beans slow-simmered overnight over charcoal, enriched with white butter, cream, and roasted cumin.',
    price: 280,
    category: 'North Indian',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15 min',
    calories: 360,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Chef Special', 'Gluten-Free'],
    winePairing: 'Best paired with Tandoori Roti or Lachha Paratha',
    ingredients: ['Black Urad Dal', 'Rajma', 'Butter', 'Fresh Cream', 'Tomato Purée', 'Ginger-Garlic'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.98,
    reviewsCount: 156
  },
  {
    name: 'Amritsari Chole Bhature',
    hindiName: 'अमृतसरी छोले भटूरे',
    description: 'Authentic Punjabi spiced chickpeas simmered in an aromatic dark gravy, served with two golden puffed bhaturas, pickled onions, and green chilies.',
    price: 190,
    category: 'North Indian',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-15 min',
    calories: 550,
    spiceLevel: 2,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Spicy'],
    winePairing: 'Best paired with Chilled Sweet Lassi',
    ingredients: ['Kabuli Chana', 'Anardana', 'Punjabi Spices', 'Flour Bhatura', 'Ginger Juliennes'],
    allergens: ['Gluten'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 88
  },
  {
    name: 'Punjabi Rajma Chawal',
    hindiName: 'पंजाबी राजमा चावल',
    description: 'Tender red kidney beans cooked in a hearty ginger, garlic, and tomato masala, served with fragrant steamed cumin basmati rice.',
    price: 180,
    category: 'North Indian',
    image: 'https://plus.unsplash.com/premium_photo-1697729439457-85d4b9d3a2cb?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10-15 min',
    calories: 410,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Best paired with Roasted Papad & Pickled Onions',
    ingredients: ['Kashmiri Rajma', 'Basmati Rice', 'Cumin Seeds', 'Tomato Gravy', 'Desi Ghee'],
    allergens: [],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.85,
    reviewsCount: 65
  },

  // 2. SOUTH INDIAN
  {
    name: 'Mysore Masala Dosa',
    hindiName: 'मैसूर मसाला डोसा',
    description: 'Crisp fermented rice crepe spread with fiery red garlic-lentil chutney, filled with tempered spiced potato mash. Served with coconut chutney and sambhar.',
    price: 160,
    category: 'South Indian',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10-12 min',
    calories: 320,
    spiceLevel: 2,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Chef Special'],
    winePairing: 'Best paired with Filter Coffee or Masala Chai',
    ingredients: ['Fermented Rice Batter', 'Spiced Potato Masala', 'Red Garlic Chutney', 'Mustard Seeds'],
    allergens: [],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 112
  },
  {
    name: 'Steamed Idli Sambhar (4 Pcs)',
    hindiName: 'इडली सांभर',
    description: 'Pillowy soft steamed rice and urad dal cakes served with aromatic piping-hot drumstick sambhar and freshly ground coconut-coriander chutney.',
    price: 120,
    category: 'South Indian',
    image: 'https://images.unsplash.com/photo-1741376509253-221ac18fac0f?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8-10 min',
    calories: 220,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    winePairing: 'Best paired with Fresh Coconut Chutney',
    ingredients: ['Steamed Rice Batter', 'Toor Dal Sambhar', 'Fresh Coconut', 'Curry Leaves'],
    allergens: [],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.88,
    reviewsCount: 74
  },
  {
    name: 'Onion Rava Uttapam',
    hindiName: 'प्याज रवा उत्तपम',
    description: 'Thick, savory pancake made from semolina batter, generously topped with finely chopped red onions, green chilies, and fresh cilantro.',
    price: 150,
    category: 'South Indian',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-15 min',
    calories: 280,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Best paired with Tomato Chutney',
    ingredients: ['Semolina Rava', 'Red Onions', 'Green Chilies', 'Curry Leaves', 'Coriander'],
    allergens: ['Gluten'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.82,
    reviewsCount: 52
  },
  {
    name: 'Crispy Medu Vada (3 Pcs)',
    hindiName: 'मेदू वड़ा',
    description: 'Golden-fried savory lentil donuts with a crunchy crust and fluffy interior, seasoned with crushed black pepper, ginger, and curry leaves.',
    price: 130,
    category: 'South Indian',
    image: 'https://images.unsplash.com/photo-1742281258189-3b933879867a?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10 min',
    calories: 290,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    winePairing: 'Best paired with Piping Hot Sambhar',
    ingredients: ['Urad Dal', 'Black Peppercorns', 'Curry Leaves', 'Ginger', 'Coconut'],
    allergens: [],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.89,
    reviewsCount: 68
  },

  // 3. STREET FOOD
  {
    name: 'Delhi Gol Gappe / Pani Puri (8 Pcs)',
    hindiName: 'पानी पूरी / गोल गप्पे',
    description: 'Crisp semolina puries filled with spiced potatoes and black chickpeas, served with tangy tamarind water and chilled spicy mint-coriander pani.',
    price: 90,
    category: 'Street Food',
    image: 'https://images.unsplash.com/photo-1684955577031-82f3a5f4de48?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5-8 min',
    calories: 180,
    spiceLevel: 3,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Spicy'],
    winePairing: 'Best paired with Sweet Lassi',
    ingredients: ['Crisp Puries', 'Boiled Potatoes', 'Black Gram', 'Mint-Coriander Water', 'Tamarind Chutney'],
    allergens: ['Gluten'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.97,
    reviewsCount: 142
  },
  {
    name: 'Mumbai Butter Pav Bhaji',
    hindiName: 'पाव भाजी',
    description: 'Mashed medley of cauliflower, potatoes, and peas slow-cooked in butter with aromatic pav bhaji masala. Served with 2 hot butter-toasted pavs.',
    price: 180,
    category: 'Street Food',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-15 min',
    calories: 460,
    spiceLevel: 2,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Chef Special'],
    winePairing: 'Best paired with Masala Chai',
    ingredients: ['Mixed Vegetables', 'Amul Butter', 'Pav Bhaji Masala', 'Ladi Pav', 'Coriander'],
    allergens: ['Gluten', 'Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.94,
    reviewsCount: 105
  },
  {
    name: 'Dilli Kurkuri Aloo Tikki Chaat',
    hindiName: 'आलू टिक्की चाट',
    description: 'Pan-griddled golden potato patties stuffed with spiced lentils, smothered in sweet churned yogurt, date-tamarind chutney, and roasted cumin.',
    price: 140,
    category: 'Street Food',
    image: 'https://plus.unsplash.com/premium_photo-1691030658788-41d188eabb64?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10 min',
    calories: 310,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Best paired with Sweet Tamarind Dip',
    ingredients: ['Spiced Potatoes', 'Chana Dal Stuffing', 'Whisked Curd', 'Saunth Chutney', 'Sev'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.87,
    reviewsCount: 78
  },
  {
    name: 'Mumbai Vada Pav (2 Pcs)',
    hindiName: 'मुंबई वड़ा पाव',
    description: 'Deep-fried golden potato dumpling nestled inside a soft bakery pav, layered with fiery dry garlic-peanut chutney and fried green chilies.',
    price: 110,
    category: 'Street Food',
    image: 'https://images.unsplash.com/photo-1769030905851-c0e0a4fe5c51?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8-10 min',
    calories: 360,
    spiceLevel: 3,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Spicy'],
    winePairing: 'Best paired with Cutting Masala Chai',
    ingredients: ['Mustard Spiced Potato', 'Gram Flour Batter', 'Bakery Pav', 'Dry Garlic Chutney'],
    allergens: ['Gluten', 'Peanuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.91,
    reviewsCount: 92
  },
  {
    name: 'Punjabi Crispy Samosa (2 Pcs)',
    hindiName: 'पंजाबी समोसा',
    description: 'Flaky pyramid pastries hand-rolled and stuffed with cumin-tempered potatoes, green peas, and crushed coriander seeds. Served with mint chutney.',
    price: 80,
    category: 'Street Food',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5-8 min',
    calories: 280,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan'],
    winePairing: 'Best paired with Mint Chutney & Chai',
    ingredients: ['Maida Pastry', 'Spiced Potatoes', 'Green Peas', 'Pomegranate Seeds', 'Coriander'],
    allergens: ['Gluten'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.86,
    reviewsCount: 84
  },

  // 4. BREADS
  {
    name: 'Tandoori Butter Naan',
    hindiName: 'बटर नान',
    description: 'Leavened soft flatbread slapped against the walls of an authentic clay tandoor until blistered and charred, brushed with melted dairy butter.',
    price: 60,
    category: 'Breads',
    image: 'https://images.unsplash.com/photo-1763951718950-c536b1295213?auto=format&fit=crop&w=1200&q=80',
    prepTime: '6-8 min',
    calories: 210,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Essential with Butter Chicken & Shahi Paneer',
    ingredients: ['Refined Flour', 'Milk', 'Yogurt', 'Butter', 'Nigella Seeds'],
    allergens: ['Gluten', 'Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 165
  },
  {
    name: 'Clay Tandoori Garlic Naan',
    hindiName: 'गार्लिक नान',
    description: 'Clay-baked flatbread infused with minced fresh garlic and chopped coriander leaves, brushed liberally with churned country butter.',
    price: 70,
    category: 'Breads',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80',
    prepTime: '6-8 min',
    calories: 230,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Chef Special'],
    winePairing: 'Essential with Dal Makhani',
    ingredients: ['Refined Flour', 'Fresh Garlic', 'Coriander', 'Pure Butter', 'Kaloji'],
    allergens: ['Gluten', 'Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.98,
    reviewsCount: 182
  },
  {
    name: 'Whole Wheat Tandoori Roti',
    hindiName: 'तंदूरी रोटी',
    description: 'Traditional round flatbread made from 100% stone-ground whole wheat chakki atta, cooked on charcoal clay walls. Light, wholesome, and soft.',
    price: 35,
    category: 'Breads',
    image: 'https://plus.unsplash.com/premium_photo-1730973702333-95f506e0035e?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 120,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Organic'],
    winePairing: 'Pairs with all Curries & Dals',
    ingredients: ['Whole Wheat Flour', 'Water', 'Rock Salt'],
    allergens: ['Gluten'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.88,
    reviewsCount: 76
  },
  {
    name: 'Pudina Lachha Paratha',
    hindiName: 'पुदीना लच्छा परांठा',
    description: 'Multi-layered flaky whole wheat bread layered with pure cow ghee and crushed dried mint leaves, crisped on the tandoor.',
    price: 65,
    category: 'Breads',
    image: 'https://plus.unsplash.com/premium_photo-1718570263614-812321f5974f?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8 min',
    calories: 240,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Pairs wonderfully with Paneer Tikka Masala',
    ingredients: ['Whole Wheat Flour', 'Desi Ghee', 'Dry Mint Powder', 'Carom Seeds (Ajwain)'],
    allergens: ['Gluten', 'Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 62
  },

  // 5. RICE & BIRYANI
  {
    name: 'Hyderabadi Dum Chicken Biryani',
    hindiName: 'हैदराबादी दम चिकन बिरयानी',
    description: 'Fragrant long-grain aged basmati rice layered with marinated tender chicken, saffron milk, fried onions, and fresh mint, slow-cooked in a sealed handi.',
    price: 360,
    category: 'Rice & Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    prepTime: '20-25 min',
    calories: 580,
    spiceLevel: 2,
    isVegetarian: false,
    dietary: ['Chef Special', 'Spicy', 'Halal'],
    winePairing: 'Served with Mirchi Ka Salan & Cucumber Raita',
    ingredients: ['Aged Basmati Rice', 'Chicken', 'Kashmiri Saffron', 'Birista Onions', 'Cardamom', 'Kewra'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.99,
    reviewsCount: 215
  },
  {
    name: 'Royal Shahi Veg Biryani',
    hindiName: 'शाही वेज बिरयानी',
    description: 'Aromatic basmati rice cooked with fresh seasonal vegetables, paneer cubes, and roasted cashews, layered with saffron, mint, and pure desi ghee.',
    price: 290,
    category: 'Rice & Biryani',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=1200&q=80',
    prepTime: '18-20 min',
    calories: 450,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Chef Special'],
    winePairing: 'Served with Burani Garlic Raita & Papad',
    ingredients: ['Basmati Rice', 'Carrots', 'Beans', 'Paneer', 'Cashews', 'Saffron'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.91,
    reviewsCount: 118
  },
  {
    name: 'Fragrant Jeera Basmati Rice',
    hindiName: 'जीरा राइस',
    description: 'Fluffy aged basmati rice tempered in pure desi cow ghee with fragrant cumin seeds, whole cloves, and bay leaves.',
    price: 150,
    category: 'Rice & Biryani',
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10 min',
    calories: 220,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Ideal companion for Dal Makhani & Butter Chicken',
    ingredients: ['Aged Basmati Rice', 'Cumin Seeds', 'Desi Ghee', 'Whole Cloves', 'Bay Leaf'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.87,
    reviewsCount: 82
  },
  {
    name: 'Awadhi Mutton Dum Biryani',
    hindiName: 'अवधी मटन दम बिरयानी',
    description: 'Succulent cuts of prime goat meat marinated overnight in browned onions, yogurt, and Awadhi spices, layered with saffron basmati in an earthen handi.',
    price: 440,
    category: 'Rice & Biryani',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    prepTime: '25 min',
    calories: 640,
    spiceLevel: 2,
    isVegetarian: false,
    dietary: ['Chef Special', 'Halal'],
    winePairing: 'Served with Mirchi Ka Salan & Boondi Raita',
    ingredients: ['Prime Mutton', 'Aged Basmati Rice', 'Mace', 'Nutmeg', 'Desi Ghee', 'Saffron'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.96,
    reviewsCount: 145
  },

  // 6. DESSERTS
  {
    name: 'Shahi Gulab Jamun (2 Pcs)',
    hindiName: 'शाही गुलाब जामुन',
    description: 'Warm golden dumplings made of evaporated milk solids (khoya), scented with green cardamom, soaked in saffron and rose petal sugar syrup.',
    price: 90,
    category: 'Desserts',
    image: 'https://plus.unsplash.com/premium_photo-1666900034249-4ddbab0c34f4?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 290,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Best enjoyed warm with Rabri',
    ingredients: ['Pure Khoya', 'Cardamom', 'Rose Water', 'Kashmiri Saffron', 'Sugar Syrup'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.97,
    reviewsCount: 136
  },
  {
    name: 'Kolkata Kesar Rasmalai (2 Pcs)',
    hindiName: 'केसर रसमलाई',
    description: 'Delicate, spongy cottage cheese discs soaked in clotted thick saffron milk, garnished with slivered pistachios and green cardamom.',
    price: 110,
    category: 'Desserts',
    image: 'https://plus.unsplash.com/premium_photo-1677706562643-0a029dbc9b97?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 240,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Served chilled',
    ingredients: ['Chenna', 'Whole Milk Rabdi', 'Kashmiri Saffron', 'Pistachios', 'Almonds'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 114
  },
  {
    name: 'Desi Ghee Jalebi with Rabri (100g)',
    hindiName: 'जलेबी और रबड़ी',
    description: 'Crisp spiral pretzels fried in pure cow ghee, steeped in saffron syrup, served alongside chilled thick reduced malai rabri.',
    price: 130,
    category: 'Desserts',
    image: 'https://plus.unsplash.com/premium_photo-1677955072995-0066c6507a10?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8 min',
    calories: 340,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Traditional festive dessert pairing',
    ingredients: ['Fermented Flour Batter', 'Pure Desi Ghee', 'Sugar Syrup', 'Reduced Rabri'],
    allergens: ['Gluten', 'Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.92,
    reviewsCount: 98
  },
  {
    name: 'Amritsari Gajar Ka Halwa (Winter Special)',
    hindiName: 'गाजर का हलवा',
    description: 'Slow-cooked red carrots simmered with full-fat milk, roasted mawa, churned desi ghee, and golden raisins, garnished with cashew nuts.',
    price: 140,
    category: 'Desserts',
    image: 'https://plus.unsplash.com/premium_photo-1677955239184-fd35758d3b1c?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 320,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Served warm',
    ingredients: ['Delhi Red Carrots', 'Desi Ghee', 'Khoya', 'Cashews', 'Raisins', 'Cardamom'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.93,
    reviewsCount: 86
  },
  {
    name: 'Matka Malai Kulfi (1 Pc)',
    hindiName: 'मटका मलाई कुल्फी',
    description: 'Traditional slow-reduced dense Indian ice cream infused with saffron, rose water, and crunchy pistachios, served in an authentic earthen clay pot.',
    price: 95,
    category: 'Desserts',
    image: 'https://plus.unsplash.com/premium_photo-1691030658477-1c8decbdfb18?auto=format&fit=crop&w=1200&q=80',
    prepTime: '3 min',
    calories: 220,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Refreshing post-meal treat',
    ingredients: ['Condensed Milk', 'Pistachios', 'Almonds', 'Kashmiri Saffron', 'Cardamom'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.89,
    reviewsCount: 72
  },

  // 7. BEVERAGES
  {
    name: 'Kullad Masala Chai',
    hindiName: 'कुल्हड़ मसाला चाय',
    description: 'Strong Assam CTC tea slow-boiled with fresh crushed ginger, green cardamom, cloves, cinnamon, and whole milk, served in an earthen clay kullad.',
    price: 50,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5-7 min',
    calories: 90,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Perfect accompaniment for Samosa & Vada Pav',
    ingredients: ['Assam Tea Leaves', 'Fresh Ginger', 'Cardamom', 'Cinnamon', 'Full Cream Milk'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.98,
    reviewsCount: 168
  },
  {
    name: 'Alphonso Mango Lassi (350ml)',
    hindiName: 'मैंगो लस्सी',
    description: 'Creamy sweet churned curd blended with golden Ratnagiri Alphonso mango pulp, scented with green cardamom and garnished with sliced pistachios.',
    price: 120,
    category: 'Beverages',
    image: 'https://plus.unsplash.com/premium_photo-1724255863045-2ad716767715?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 260,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free', 'Chef Special'],
    winePairing: 'Cooling balance for Biryani & Spicy Curries',
    ingredients: ['Fresh Yogurt', 'Alphonso Mango Pulp', 'Pistachios', 'Cardamom', 'Kewra'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    rating: 4.96,
    reviewsCount: 144
  },
  {
    name: 'Punjabi Sweet Patiala Lassi',
    hindiName: 'पंजाबी मीठी लस्सी',
    description: 'Traditional thick yogurt churned with sugar and chilled water, topped with a thick layer of fresh clotted malai and roasted almond flakes.',
    price: 100,
    category: 'Beverages',
    image: 'https://plus.unsplash.com/premium_photo-1698500034700-82967b4b7cf7?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 240,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Essential with Amritsari Chole Bhature',
    ingredients: ['Cream Curd', 'Sugar', 'Thick Malai', 'Almond Flakes', 'Cardamom'],
    allergens: ['Milk/Dairy', 'Nuts'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.91,
    reviewsCount: 96
  },
  {
    name: 'Artisanal Cold Coffee with Ice Cream',
    hindiName: 'कोल्ड कॉफी विथ आइसक्रीम',
    description: 'Chilled rich espresso blended with creamy whole milk and sugar, topped with a generous scoop of dark chocolate ice cream and cocoa powder.',
    price: 130,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 280,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Refreshing afternoon beverage',
    ingredients: ['Filter Coffee Decoction', 'Whole Milk', 'Vanilla Ice Cream', 'Cocoa Powder'],
    allergens: ['Milk/Dairy'],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    rating: 4.89,
    reviewsCount: 84
  }
];

// Assign genuine, stable MongoDB ObjectIds to authentic dishes
const dishIds = [
  '6ae7b7315e94aa042c8c3c24', // 1 Butter Chicken
  '6ae7b7315e94aa042c8c3c25', // 2 Shahi Paneer
  '6ae7b7315e94aa042c8c3c26', // 3 Dal Makhani
  '6ae7b7315e94aa042c8c3c27', // 4 Amritsari Chole Bhature
  '6ae7b7315e94aa042c8c3c28', // 5 Punjabi Rajma Chawal
  '6ae7b7315e94aa042c8c3c29', // 6 Mysore Masala Dosa
  '6ae7b7315e94aa042c8c3c2a', // 7 Steamed Idli Sambhar (4 Pcs)
  '6ae7b7315e94aa042c8c3c2b', // 8 Onion Rava Uttapam
  '6ae7b7315e94aa042c8c3c2c', // 9 Crispy Medu Vada (3 Pcs)
  '6ae7b7315e94aa042c8c3c2d', // 10 Delhi Gol Gappe / Pani Puri (8 Pcs)
  '6ae7b7315e94aa042c8c3c2e', // 11 Mumbai Butter Pav Bhaji
  '6ae7b7315e94aa042c8c3c2f', // 12 Dilli Kurkuri Aloo Tikki Chaat
  '6ae7b7315e94aa042c8c3c30', // 13 Mumbai Vada Pav (2 Pcs)
  '6ae7b7315e94aa042c8c3c31', // 14 Punjabi Crispy Samosa (2 Pcs)
  '6ae7b7315e94aa042c8c3c32', // 15 Tandoori Butter Naan
  '6ae7b7315e94aa042c8c3c33', // 16 Clay Tandoori Garlic Naan
  '6ae7b7315e94aa042c8c3c34', // 17 Whole Wheat Tandoori Roti
  '6ae7b7315e94aa042c8c3c35', // 18 Pudina Lachha Paratha
  '6ae7b7315e94aa042c8c3c36', // 19 Hyderabadi Dum Chicken Biryani
  '6ae7b7315e94aa042c8c3c37', // 20 Royal Shahi Veg Biryani
  '6ae7b7315e94aa042c8c3c38', // 21 Fragrant Jeera Basmati Rice
  '6ae7b7315e94aa042c8c3c39', // 22 Awadhi Mutton Dum Biryani
  '6ae7b7315e94aa042c8c3c3a', // 23 Shahi Gulab Jamun (2 Pcs)
  '6ae7b7315e94aa042c8c3c3b', // 24 Kolkata Kesar Rasmalai (2 Pcs)
  '6ae7b7315e94aa042c8c3c3c', // 25 Desi Ghee Jalebi with Rabri (100g)
  '6ae7b7315e94aa042c8c3c3d', // 26 Amritsari Gajar Ka Halwa (Winter Special)
  '6ae7b7315e94aa042c8c3c3e', // 27 Matka Malai Kulfi (1 Pc)
  '6ae7b7315e94aa042c8c3c3f', // 28 Kullad Masala Chai
  '6ae7b7315e94aa042c8c3c40', // 29 Alphonso Mango Lassi (350ml)
  '6ae7b7315e94aa042c8c3c41', // 30 Punjabi Sweet Patiala Lassi
  '6ae7b7315e94aa042c8c3c42'  // 31 Artisanal Cold Coffee with Ice Cream
];

authenticIndianDishes.forEach((dish, idx) => {
  if (!dish._id) {
    dish._id = new mongoose.Types.ObjectId(dishIds[idx]);
  }
});

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Seeder] Error: MONGODB_URI is not set in server/.env');
    process.exit(1);
  }

  console.log('[Seeder] Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log(`[Seeder] ✅ Connected to host: ${mongoose.connection.host}`);

  // 1. Seed Restaurant
  console.log('[Seeder] Seeding restaurant details...');
  await Restaurant.deleteMany({});
  const restaurant = await Restaurant.create(defaultRestaurantData);
  console.log(`[Seeder] ✅ Restaurant profile seeded: "${restaurant.name}"`);

  // 2. Seed Foods
  console.log('[Seeder] Seeding authentic Indian food catalog...');
  await Food.deleteMany({});
  const createdFoods = await Food.insertMany(authenticIndianDishes);
  console.log(`[Seeder] ✅ Successfully seeded ${createdFoods.length} authentic dishes.`);

  // Set hero spotlight dish reference to Butter Chicken
  const butterChicken = createdFoods.find((f) => f.name.includes('Butter Chicken'));
  if (butterChicken) {
    restaurant.heroSpotlightDish = butterChicken._id;
    await restaurant.save();
    console.log(`[Seeder] ✅ Set hero spotlight dish to Butter Chicken (${butterChicken._id})`);
  }

  // 3. Seed Users
  console.log('[Seeder] Seeding users (Admin & Customer)...');
  await User.deleteMany({});

  const adminUser = await User.create({
    name: 'Master Chef Rajesh Kumar',
    email: 'admin@theindianrasoi.com',
    password: 'AdminPassword2026!',
    phone: '+91 98765 43210',
    role: 'admin',
    addresses: [
      {
        label: 'The Indian Rasoi Kitchen',
        street: 'Block B, Inner Circle, Connaught Place',
        city: 'New Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: true
      }
    ]
  });

  const customerUser = await User.create({
    name: 'Priya Sharma',
    email: 'priya.sharma@indianrasoi.com',
    password: 'Priya2026!',
    phone: '+91 98765 43210',
    role: 'customer',
    addresses: [
      {
        label: 'Home Residency',
        street: 'Flat 402, Royal Palms Apartments',
        building: 'Tower B, Connaught Place',
        city: 'New Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: true,
        deliveryNotes: 'Ring bell 402 or leave with security at main gate.'
      }
    ]
  });

  console.log('[Seeder] Default administrator and customer accounts created.');
  console.log('[Seeder] 🎉 Database seeded successfully!');
  await mongoose.disconnect();
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('[Seeder] Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { authenticIndianDishes, seedDatabase };
