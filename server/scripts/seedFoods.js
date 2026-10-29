// ============================================================================
// CASA TÒPAZ — Food Seeding Script
// Seeds realistic gourmet tapas, cazuelas, bellota charcuterie, and wines.
// Valid high-resolution imagery and full dietary metadata.
// ============================================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('../models/Food');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sampleFoods = [
  // 1. PINCHOS & TAPAS
  {
    name: 'Le Suisse — Pincho à la Raclette AOP',
    spanishName: 'Pincho de Raclette y Cebollita Francesa',
    description: 'Golden toasted sourdough brioche topped with slow-melted Valais Raclette AOP cheese, baby sweet gherkin cornichon, caramelized pearl onion, and smoked Paprika de la Vera.',
    price: 13.50,
    category: 'Pinchos & Tapas',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10-12 min',
    calories: 320,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'AOP Certified', 'Chef Special'],
    winePairing: 'Fendant du Valais Grand Cru 2022',
    ingredients: ['Artisan Sourdough', 'Raclette du Valais AOP', 'Cornichons', 'Pickled Pearl Onions', 'Smoked Pimentón'],
    allergens: ['Gluten', 'Milk/Dairy'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 48
  },
  {
    name: 'Le Chalutier — Pincho Crevettes & Aïoli Doré',
    spanishName: 'Pincho de Gambas al Ajo y Aïoli de Piquillo',
    description: 'Seared Mediterranean wild prawns on crusty baguette with saffron piquillo garlic aïoli, crispy shallots, chives, and sea salt flakes.',
    price: 15.00,
    category: 'Pinchos & Tapas',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-15 min',
    calories: 290,
    spiceLevel: 1,
    isVegetarian: false,
    dietary: ['Chef Special'],
    winePairing: 'Albariño Rías Baixas 2023',
    ingredients: ['Wild Prawns', 'Baguette Tradition', 'Saffron Aïoli', 'Piquillo Pepper', 'Crispy Shallots', 'Chives'],
    allergens: ['Crustaceans', 'Gluten', 'Eggs'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 36
  },
  {
    name: 'Pinchos de Pollo al Limón & Romarin',
    spanishName: 'Pinchos de Pollo Marinado al Limón',
    description: 'Tender free-range chicken marinated in Meyer lemon, cold-pressed olive oil, rosemary, served on toasted pain de campagne with pickled red onion and micro-coriander.',
    price: 14.00,
    category: 'Pinchos & Tapas',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15 min',
    calories: 340,
    spiceLevel: 0,
    isVegetarian: false,
    dietary: ['Chef Special'],
    winePairing: 'Rosé de Gamay Domaine de la Ville 2023',
    ingredients: ['Free-Range Chicken Breast', 'Pain de Campagne', 'Pickled Red Onions', 'Fresh Rosemary', 'Meyer Lemon Zest'],
    allergens: ['Gluten'],
    isAvailable: true,
    isFeatured: false,
    rating: 4.85,
    reviewsCount: 29
  },
  {
    name: 'Croquetas de Jamón Ibérico de Bellota',
    spanishName: 'Croquetas Artesanas de Jamón de Jabugo',
    description: 'Handmade velvety croquettes filled with 100% acorn-fed Ibérico cured ham, creamy béchamel, fried to golden crispness, served with romesco dipping sauce.',
    price: 16.50,
    category: 'Pinchos & Tapas',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10 min',
    calories: 410,
    spiceLevel: 0,
    isVegetarian: false,
    dietary: ['Chef Special'],
    winePairing: 'Cava Brut Nature Gran Reserva',
    ingredients: ['Jamón Ibérico de Bellota', 'Whole Milk Béchamel', 'Panko Crumbs', 'Romesco Sauce', 'Roasted Almonds'],
    allergens: ['Gluten', 'Milk/Dairy', 'Nuts'],
    isAvailable: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 62
  },
  {
    name: 'Pimientos de Padrón Asados al Flor de Sal',
    spanishName: 'Pimientos de Padrón con Flor de Sal de Guérande',
    description: 'Blistered sweet and mild Galician green peppers quickly seared in hot extra virgin olive oil, finished with crunchy sea salt flakes.',
    price: 11.50,
    category: 'Pinchos & Tapas',
    image: 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8 min',
    calories: 140,
    spiceLevel: 1,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    winePairing: 'Verdejo Rueda 2023',
    ingredients: ['Padrón Peppers', 'Extra Virgin Olive Oil', 'Fleur de Sel de Guérande'],
    allergens: [],
    isAvailable: true,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 22
  },

  // 2. CAZUELAS & PLATS CHAUDS
  {
    name: 'La Suissesse — Cazuela Raclette & Pommes Grenailles',
    spanishName: 'Cazuelita de Patatas Nuevas y Raclette AOP',
    description: 'Steaming terracotta cocotte baked with roasted baby fingerling potatoes, melting Raclette AOP, crispy smoked bacon lardons, fresh thyme, and white wine reduction.',
    price: 24.50,
    category: 'Cazuelas & Plats Chauds',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    prepTime: '18-20 min',
    calories: 580,
    spiceLevel: 0,
    isVegetarian: false,
    dietary: ['Gluten-Free', 'AOP Certified', 'Chef Special'],
    winePairing: 'Petite Arvine de Fully 2021',
    ingredients: ['Baby Fingerling Potatoes', 'Raclette du Valais AOP', 'Smoked Bacon', 'White Wine', 'Fresh Thyme'],
    allergens: ['Milk/Dairy'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 54
  },
  {
    name: 'Cazuela de Chorizo Ibérico al Vino Tinto',
    spanishName: 'Cazuela de Chorizo Criollo Guisado al Rioja',
    description: 'Artisanal cured spicy chorizo simmered in full-bodied Rioja red wine with caramelized shallots, honey glaze, and roasted sweet bell peppers.',
    price: 22.00,
    category: 'Cazuelas & Plats Chauds',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15-18 min',
    calories: 510,
    spiceLevel: 2,
    isVegetarian: false,
    dietary: ['Gluten-Free'],
    winePairing: 'Rioja Crianza Tempranillo 2019',
    ingredients: ['Chorizo Ibérico', 'Rioja Red Wine', 'Shallots', 'Bell Peppers', 'Wildflower Honey'],
    allergens: [],
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 41
  },
  {
    name: 'La Chalutière — Cazuela de Gambas al Ajillo',
    spanishName: 'Cazuela Hirviente de Gambas al Ajillo y Guindilla',
    description: 'Jumbo wild prawns sizzling in garlic-infused Spanish olive oil, dried guindilla pepper, smoked paprika, and flat-leaf parsley. Served with rustic bread for dipping.',
    price: 26.50,
    category: 'Cazuelas & Plats Chauds',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-15 min',
    calories: 420,
    spiceLevel: 2,
    isVegetarian: false,
    dietary: ['Chef Special'],
    winePairing: 'Godello Bierzo 2022',
    ingredients: ['Jumbo Prawns', 'Spanish Garlic', 'Guindilla Chili', 'Extra Virgin Olive Oil', 'Flat Parsley'],
    allergens: ['Crustaceans', 'Gluten'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.92,
    reviewsCount: 38
  },
  {
    name: 'Pulpo a la Brasa & Purée de Pommes Rattes',
    spanishName: 'Pulpo Gallego a la Brasa con Aceite de Carbón',
    description: 'Charcoal-grilled tender Galician octopus tentacle over silk-smooth buttered potato mousseline, Pimentón de la Vera, and herb-infused olive oil.',
    price: 28.00,
    category: 'Cazuelas & Plats Chauds',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=1200&q=80',
    prepTime: '20 min',
    calories: 460,
    spiceLevel: 1,
    isVegetarian: false,
    dietary: ['Gluten-Free', 'Chef Special'],
    winePairing: 'Ribera del Duero Crianza 2020',
    ingredients: ['Galician Octopus', 'Pommes Rattes Mousseline', 'Beurre de Baratte', 'Smoked Pimentón'],
    allergens: ['Molluscs', 'Milk/Dairy'],
    isAvailable: true,
    isFeatured: false,
    rating: 4.88,
    reviewsCount: 33
  },

  // 3. CHARCUTERIE & FROMAGES
  {
    name: 'Planche Découverte Casa Tòpaz',
    spanishName: 'Tabla Mixta Hispano-Suiza Gran Selección',
    description: 'The pinnacle tasting board: 36-month Jamón Ibérico de Bellota, Cecina de León, Gruyère d’Alpage AOP 18 mois, Manchego Viejo, quince membrillo paste, Marcona almonds, and pan con tomate.',
    price: 36.00,
    category: 'Charcuterie & Fromages',
    image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10 min',
    calories: 640,
    spiceLevel: 0,
    isVegetarian: false,
    dietary: ['AOP Certified', 'Chef Special'],
    winePairing: 'Priorat Garnacha & Cariñena 2018',
    ingredients: ['Jamón Ibérico 100% Bellota', 'Cecina de León', 'Gruyère AOP', 'Manchego Viejo', 'Quince Membrillo', 'Marcona Almonds'],
    allergens: ['Milk/Dairy', 'Nuts', 'Gluten'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.98,
    reviewsCount: 75
  },
  {
    name: 'Jamón 100% Ibérico de Bellota Gran Reserva',
    spanishName: 'Jamón Ibérico Puro de Jabugo Cortado a Cuchillo',
    description: 'Hand-carved paper-thin slices of certified 100% acorn-fed Iberian ham from Jabugo. Melting nutty fat with intense umami depth.',
    price: 28.50,
    category: 'Charcuterie & Fromages',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8 min',
    calories: 380,
    spiceLevel: 0,
    isVegetarian: false,
    dietary: ['Gluten-Free', 'AOP Certified'],
    winePairing: 'Sherry Fino En Rama Tío Pepe',
    ingredients: ['Pure Acorn-Fed Iberian Ham', 'Pan con Tomate Crusts'],
    allergens: ['Gluten'],
    isAvailable: true,
    isFeatured: false,
    rating: 4.95,
    reviewsCount: 44
  },
  {
    name: 'Assiette de Fromages Affinés des Alpes & d’Ibérie',
    spanishName: 'Selección de Quesos Artesanales de Alta Montaña',
    description: 'Curated flight of 4 artisanal raw-milk cheeses: Tête de Moine AOP rosettes, Gruyère d’Alpage, Queso Mahón de Menorca, and creamy Cabrales blue cheese with artisan honey.',
    price: 22.00,
    category: 'Charcuterie & Fromages',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8 min',
    calories: 490,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'AOP Certified'],
    winePairing: 'Chasselas Grand Cru Dézaley 2022',
    ingredients: ['Tête de Moine AOP', 'Gruyère d’Alpage', 'Queso Mahón', 'Cabrales Blue', 'Mountain Flower Honey'],
    allergens: ['Milk/Dairy'],
    isAvailable: true,
    isFeatured: false,
    rating: 4.87,
    reviewsCount: 31
  },

  // 4. POSTRES & DOUCEURS
  {
    name: 'Churros Dorés au Sucre Cannelle & Chocolat Noir',
    spanishName: 'Churros Madrileños con Chocolate Especiado',
    description: 'Crispy golden fried artisan churros dusted with cinnamon sugar, accompanied by a thick, velvety warm 70% dark Valrhona dipping chocolate.',
    price: 12.00,
    category: 'Postres & Douceurs',
    image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10 min',
    calories: 440,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian'],
    winePairing: 'Pedro Ximénez Sherry San Emilio',
    ingredients: ['Churros Pastry', 'Ceylon Cinnamon', 'Organic Cane Sugar', '70% Valrhona Dark Chocolate', 'Fresh Cream'],
    allergens: ['Gluten', 'Milk/Dairy'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.94,
    reviewsCount: 52
  },
  {
    name: 'Tarta de Queso Vasca Brûlée',
    spanishName: 'Tarta de Queso Estilo San Sebastián',
    description: 'Iconic San Sebastián Basque burnt cheesecake with a deeply caramelized exterior and an ultra-creamy, molten center with hints of Madagascar vanilla and lemon peel.',
    price: 13.50,
    category: 'Postres & Douceurs',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 420,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free', 'Chef Special'],
    winePairing: 'Moscatel de Alejandría 2021',
    ingredients: ['Cream Cheese', 'Fresh Farm Cream', 'Pasture Eggs', 'Madagascar Vanilla Pod', 'Meyer Lemon'],
    allergens: ['Milk/Dairy', 'Eggs'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.98,
    reviewsCount: 68
  },
  {
    name: 'Crema Catalana aux Zestes d’Oranges Suisses',
    spanishName: 'Crema Catalana Caramelizada con Cítricos',
    description: 'Silky egg-yolk custard infused with organic orange peel and cinnamon, topped with a glass-like crackling burnt sugar crust.',
    price: 11.00,
    category: 'Postres & Douceurs',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 310,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    winePairing: 'Oloroso Sherry Dulce',
    ingredients: ['Egg Yolks', 'Whole Milk', 'Swiss Organic Orange Peel', 'Cinnamon Stick', 'Demerara Sugar'],
    allergens: ['Milk/Dairy', 'Eggs'],
    isAvailable: true,
    isFeatured: false,
    rating: 4.82,
    reviewsCount: 26
  },

  // 5. VINOS & COCKTAILS
  {
    name: 'Sangria de la Casa au Vin Rouge & Épices',
    spanishName: 'Sangría Artesanal Macerada 48h con Frutas Frescas',
    description: 'House signature sangria macerated for 48 hours with Old-Vine Garnacha red wine, Spanish brandy, fresh blood oranges, peaches, cinnamon, and splash of citrus soda.',
    price: 12.50,
    category: 'Vinos & Cocktails',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5 min',
    calories: 190,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Vegan', 'Gluten-Free', 'Chef Special'],
    winePairing: 'Perfect aperitif for pinchos and charcuterie',
    ingredients: ['Garnacha Red Wine', 'Cardenal Mendoza Brandy', 'Blood Oranges', 'Peaches', 'Cinnamon', 'Sparkling Soda'],
    allergens: ['Sulphites'],
    isAvailable: true,
    isFeatured: true,
    rating: 4.96,
    reviewsCount: 59
  },
  {
    name: 'Vermut Rojo Reserva Casa Tòpaz',
    spanishName: 'Vermut Artesano de Barrica con Naranja y Oliva Gordal',
    description: 'Barrel-aged botanical red vermouth served over hand-cut ice, with a fresh orange wheel and jumbo Gordal olive stuffed with anchovy paste.',
    price: 9.50,
    category: 'Vinos & Cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    prepTime: '3 min',
    calories: 160,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Gluten-Free'],
    winePairing: 'Classic aperitif style with pinchos',
    ingredients: ['Botanical Red Vermouth', 'Bitter Orange Peel', 'Spanish Gordal Olive', 'Club Soda Splash'],
    allergens: ['Sulphites'],
    isAvailable: true,
    isFeatured: false,
    rating: 4.89,
    reviewsCount: 34
  },
  {
    name: 'Rioja Gran Reserva 2016 — Marqués de Murrieta (75cl)',
    spanishName: 'Marqués de Murrieta Castillo Ygay Gran Reserva',
    description: 'Iconic Spanish estate wine aged 28 months in oak barrels. Notes of ripe black cherries, cedarwood, truffle, leather, and velvety polished tannins.',
    price: 54.00,
    category: 'Vinos & Cocktails',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    prepTime: '3 min',
    calories: 580,
    spiceLevel: 0,
    isVegetarian: true,
    dietary: ['Gluten-Free', 'AOP Certified'],
    winePairing: 'Ideal pairing with Jamón Ibérico & Pulpo',
    ingredients: ['Tempranillo (86%)', 'Graciano (14%)'],
    allergens: ['Sulphites'],
    isAvailable: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 28
  }
];

const seedFoods = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error(`
========================================================================
[CASA TÒPAZ Seeder] ⚠️  Cannot seed database: MONGODB_URI is not set.
========================================================================
Please configure your MongoDB Atlas connection string in server/.env:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/casa_topaz?retryWrites=true&w=majority
========================================================================
`);
    process.exit(1);
  }

  try {
    const maskedUri = uri.replace(/:([^:@]{4})[^:@]*@/, ':****@');
    console.log(`[Seeder] Connecting to MongoDB: ${maskedUri} ...`);

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seeder] Connected successfully.');

    // Clear existing foods and re-seed with fresh data
    const deleted = await Food.deleteMany();
    console.log(`[Seeder] Cleared ${deleted.deletedCount} existing dishes.`);

    const created = await Food.insertMany(sampleFoods);
    console.log(`[Seeder] ✅ Successfully seeded ${created.length} gourmet dishes into CASA TÒPAZ menu!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error during seeding:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedFoods();
}

module.exports = { sampleFoods, seedFoods };
