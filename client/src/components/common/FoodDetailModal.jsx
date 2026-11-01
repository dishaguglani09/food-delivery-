// ============================================================================
// The Indian Rasoi — Dish Detail & Customization Modal
// Complete culinary view with ingredients, allergens, beverage pairing,
// dietary certifications, and special chef instructions.
// ============================================================================

import { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Star, 
  Wine, 
  Flame, 
  Clock, 
  AlertTriangle, 
  Check 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function FoodDetailModal({ food, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [added, setAdded] = useState(false);

  if (!food) return null;

  const handleAdd = () => {
    addToCart(food, quantity, specialInstructions);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#141312] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-stone-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-stone-700/60 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left / Top Image */}
          <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto min-h-[260px] md:min-h-[420px] bg-stone-900">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            {/* Price Badge on Mobile */}
            <div className="absolute bottom-4 left-4 md:hidden">
              <span className="font-serif text-2xl font-bold text-amber-300 drop-shadow">
                ₹{food.price}
              </span>
            </div>
          </div>

          {/* Right / Content Details */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Category & Certifications */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {food.category}
                </span>
                {food.dietary && food.dietary.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-900 border border-stone-800 text-stone-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title & Authentic Hindi Subtitle */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white leading-tight">
                  {food.name}
                </h2>
                {(food.hindiName || food.spanishName) && (
                  <p className="text-amber-400/90 text-sm mt-1 font-normal">
                    « {food.hindiName || food.spanishName} »
                  </p>
                )}
              </div>

              {/* Quick Metrics (Rating, Prep Time, Calories, Spice) */}
              <div className="flex flex-wrap items-center gap-4 py-2 border-y border-stone-800/80 text-xs text-stone-400">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-semibold text-white">{food.rating || '4.95'}</span>
                  <span>({food.reviewsCount || 42} reviews)</span>
                </div>
                {food.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{food.prepTime}</span>
                  </div>
                )}
                {food.calories && (
                  <div>
                    <span>{food.calories} kcal</span>
                  </div>
                )}
                {food.spiceLevel > 0 && (
                  <div className="flex items-center gap-1 text-rose-400">
                    <Flame className="w-3.5 h-3.5 fill-rose-500" />
                    <span>Spice {food.spiceLevel}/3</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-300 leading-relaxed font-normal">
                {food.description}
              </p>

              {/* Beverage / Pairing Card */}
              {(food.winePairing || food.beveragePairing) && (
                <div className="rounded-2xl bg-amber-950/20 border border-amber-500/20 p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                    <Wine className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif uppercase tracking-wider text-amber-300 font-semibold">
                      Chef's Pairing Recommendation
                    </h4>
                    <p className="text-xs text-stone-300 italic mt-0.5">
                      {food.winePairing || food.beveragePairing}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients & Allergens */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div className="text-xs space-y-1.5 pt-1">
                  <span className="text-stone-400 font-medium">Noble artisan ingredients:</span>
                  <p className="text-stone-300 leading-normal">
                    {food.ingredients.join(' · ')}
                  </p>
                </div>
              )}

              {food.allergens && food.allergens.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 bg-stone-900/60 px-3 py-2 rounded-xl border border-stone-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Allergens: {food.allergens.join(', ')}</span>
                </div>
              )}

              {/* Special Instructions Note */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-stone-400 block">
                  Special instructions for the culinary team (optional):
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra butter, less spicy, mint chutney on the side..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Bottom Controls: Quantity + Add CTA */}
            <div className="pt-6 mt-6 border-t border-stone-800 flex items-center justify-between gap-4">
              {/* Desktop Price */}
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-stone-400 font-normal">Total</span>
                <span className="text-2xl font-semibold text-amber-300 font-sans tracking-tight">
                  ₹{food.price * quantity}
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-950/40'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Selection!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order · ₹{food.price * quantity}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
