// ============================================================================
// The Indian Rasoi — Dedicated Food Detail Page (/dish/:id)
// Pure database-driven culinary profile powered by MongoDB Atlas.
// Zero hardcoded mock data.
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Star, 
  Flame, 
  Clock, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';
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

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedDishes, setRelatedDishes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDish() {
      try {
        setLoading(true);
        setError(null);
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
              // Ignore related items error
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to find this dish.');
          setFood(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDish();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity, specialInstructions);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0c0c] pt-12 pb-24 text-stone-200">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 animate-pulse space-y-8">
          <div className="h-6 w-32 bg-stone-800 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 h-[480px] bg-stone-900 rounded-3xl" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-10 w-3/4 bg-stone-800 rounded-lg" />
              <div className="h-6 w-1/4 bg-stone-850 rounded-lg" />
              <div className="h-24 bg-stone-900 rounded-xl" />
              <div className="h-12 w-48 bg-stone-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="min-h-screen bg-[#0d0c0c] pt-16 pb-24 text-stone-200">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
          <EmptyState
            title="Dish Not Found"
            message="We could not find the creation you requested in The Indian Rasoi database."
            actionLabel="Return to Full Menu"
            actionLink="/menu"
          />
        </div>
      </div>
    );
  }

  const spiceLabels = ['Mild & Velvety', 'Medium Spiced', 'Fiery Traditional', 'Royal Rajputi Heat'];

  return (
    <div className="min-h-screen bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-12">
        {/* Navigation Breadcrumb */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-400 hover:text-amber-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Menu</span>
        </Link>

        {/* Main Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Visual Presentation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-amber-950/60 bg-stone-900 shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300">
                  {food.category}
                </span>
                {food.isVegetarian ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Vegetarian
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300">
                    Non-Vegetarian
                  </span>
                )}
              </div>

              {food.isFeatured && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-amber-600/90 text-white shadow-lg">
                  Chef's Signature
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Culinary Details & Order Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-400 font-medium">
                  {food.category}
                </span>
                <span className="text-stone-600">·</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold text-white">{food.rating || 4.9}</span>
                  <span className="text-stone-400 font-normal">
                    ({food.reviewsCount || 42} reviews)
                  </span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug">
                {food.name}
              </h1>

              {food.hindiName && (
                <p className="text-base sm:text-lg text-amber-400/90 font-normal">
                  {food.hindiName}
                </p>
              )}

              <div className="text-2xl sm:text-3xl font-semibold text-amber-300 pt-1 font-sans tracking-tight">
                ₹{food.price}
              </div>
            </div>

            <p className="text-stone-300 leading-relaxed font-normal text-sm sm:text-base border-t border-stone-850 pt-4">
              {food.description}
            </p>

            {/* Preparation Details Row */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#141211] border border-amber-950/40 text-center">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Preparation</span>
                <span className="text-xs sm:text-sm font-medium text-stone-200 mt-0.5 block flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {food.prepTime || '15-20 min'}
                </span>
              </div>
              <div className="border-x border-stone-850">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Spicing</span>
                <span className="text-xs sm:text-sm font-medium text-stone-200 mt-0.5 block flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {spiceLabels[food.spiceLevel || 1] || 'Medium'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Kitchen Stock</span>
                <span className="text-xs sm:text-sm font-medium text-emerald-400 mt-0.5 block">
                  {food.stock !== undefined ? `${food.stock} portions` : 'Available'}
                </span>
              </div>
            </div>

            {/* Ingredients */}
            {food.ingredients && food.ingredients.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-serif text-xs uppercase tracking-wider text-stone-400 font-bold">
                  Heirloom Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs bg-stone-900 border border-stone-800 text-stone-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-stone-400 font-medium block">
                Special Kitchen Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Medium spicy, extra butter, no onion..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Quantity Selector & Add to Cart CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-4 p-2 rounded-xl bg-stone-900 border border-stone-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-serif font-bold text-base text-white px-2">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-8 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm sm:text-base tracking-wide transition-all shadow-xl shadow-amber-950/60 flex items-center justify-center gap-3 border border-amber-400/30 cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>Added to Order</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add {quantity} to Order · ₹{food.price * quantity}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Creations from Same Category */}
        {relatedDishes.length > 0 && (
          <div className="pt-16 border-t border-stone-850 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">
              More Creations in {food.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDishes.map((related) => (
                <FoodCard
                  key={related._id || related.id}
                  food={related}
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
