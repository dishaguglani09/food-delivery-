// ============================================================================
// CASA TÒPAZ — Dedicated Food Detail Page (/dish/:id)
// In-depth culinary profile with sommelier pairings, noble ingredients,
// allergen disclosures, and related creations.
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Star, 
  Wine, 
  Flame, 
  Clock, 
  Check, 
  Plus, 
  Minus, 
  AlertTriangle 
} from 'lucide-react';
import { sampleFoods, getDishById } from '../data/sampleFoods';
import { foodService } from '../services/api';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/common/FoodCard';
import EmptyState from '../components/common/EmptyState';

export default function FoodDetailPage() {
  const { id } = useParams();
  const { addToCart, openFoodModal } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [added, setAdded] = useState(false);

  // Initialize with local cache if available, but fetch live from backend
  const [food, setFood] = useState(() => getDishById(id) || sampleFoods.find((d) => d._id === id) || null);
  const [loading, setLoading] = useState(!food);
  const [relatedDishes, setRelatedDishes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDish() {
      try {
        setLoading(true);
        const data = await foodService.getFoodById(id);
        if (isMounted && data) {
          setFood(data);
          // Fetch related items from the same category
          if (data.category) {
            try {
              const res = await foodService.getAllFoods({ category: data.category, limit: 4 });
              const items = res.data || res;
              if (Array.isArray(items) && isMounted) {
                setRelatedDishes(
                  items
                    .filter((d) => (d._id || d.id) !== (data._id || data.id))
                    .slice(0, 3)
                );
              }
            } catch {
              // fallback
            }
          }
        }
      } catch {
        // Fallback to sample data if backend is unreachable
        const fallback = getDishById(id) || sampleFoods.find((d) => d._id === id);
        if (isMounted && fallback) {
          setFood(fallback);
          const related = sampleFoods
            .filter((d) => d.category === fallback.category && d._id !== fallback._id)
            .slice(0, 3);
          setRelatedDishes(related);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDish();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading && !food) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0d0c0c] text-stone-200 py-16">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-serif text-amber-400 uppercase tracking-widest">
          Loading culinary profile...
        </p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0d0c0c] text-stone-200 py-16">
        <EmptyState
          title="Dish Not Found"
          description="The requested dish is no longer on the menu or has been temporarily retired."
          actionLabel="Back to Menu"
          actionLink="/menu"
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(food, quantity, specialInstructions);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Back */}
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to complete menu</span>
          </Link>
        </div>

        {/* Main Dish Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-stone-900 aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Badges Overlay */}
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-serif bg-amber-500/10 border border-amber-500/30 text-amber-300">
                {food.category}
              </span>
              {food.dietary && food.dietary.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-stone-900 border border-stone-800 text-stone-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Culinary Details & Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {food.name}
              </h1>
              {food.spanishName && (
                <p className="font-serif italic text-amber-400 text-base sm:text-lg mt-1">
                  « {food.spanishName} »
                </p>
              )}
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between border-y border-stone-850 py-3">
              <div>
                <span className="text-xs uppercase text-stone-500 block">Order Price</span>
                <span className="font-serif text-3xl font-bold text-amber-300">
                  CHF {food.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-400">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white text-sm">{food.rating || '4.95'}</span>
                  <span>({food.reviewsCount || 38} reviews)</span>
                </div>
                {food.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{food.prepTime}</span>
                  </div>
                )}
                {food.spiceLevel > 0 && (
                  <div className="flex items-center gap-1 text-rose-400">
                    <Flame className="w-3.5 h-3.5 fill-rose-500" />
                    <span>Spice {food.spiceLevel}/3</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
              {food.description}
            </p>

            {/* Sommelier Pairing */}
            {food.winePairing && (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Wine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    Sommelier Wine Recommendation
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 italic mt-0.5">
                    {food.winePairing}
                  </p>
                </div>
              </div>
            )}

            {/* Noble Ingredients */}
            {food.ingredients && food.ingredients.length > 0 && (
              <div className="space-y-1.5 text-xs sm:text-sm">
                <span className="text-stone-400 font-medium">Selected noble ingredients:</span>
                <p className="text-stone-200">
                  {food.ingredients.join(' · ')}
                </p>
              </div>
            )}

            {food.allergens && food.allergens.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Declared allergens: {food.allergens.join(', ')}</span>
              </div>
            )}

            {/* Special Instructions Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300 block">
                Special instructions for the chef:
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra golden toasted bread, dressing on the side..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Controls: Quantity + Add CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1.5 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full sm:flex-1 py-4 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white shadow-amber-950/50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Order · CHF {(food.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Dishes Carousel / Section */}
        {relatedDishes.length > 0 && (
          <div className="pt-12 border-t border-stone-850 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-serif uppercase tracking-widest text-amber-400">
                  From the Same Category
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  Complete Your Tasting Menu
                </h3>
              </div>
              <Link
                to={`/menu?category=${encodeURIComponent(food.category)}`}
                className="text-xs text-amber-300 hover:underline"
              >
                Explore all in {food.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDishes.map((dish) => (
                <FoodCard
                  key={dish._id}
                  food={dish}
                  onOpenDetails={openFoodModal}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
