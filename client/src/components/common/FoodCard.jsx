// ============================================================================
// The Indian Rasoi — Food Item Card Component
// High-definition presentation with culinary tags, spice meter,
// beverage pairing hints, and quick-add interactions.
// ============================================================================

import { useState } from 'react';
import { Plus, Check, Star, Wine, Flame, Eye, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function FoodCard({ food, onOpenDetails }) {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  // Check if item is already in cart to reflect current count
  const cartItem = items.find((item) => item.food._id === food._id);
  const currentInCart = cartItem ? cartItem.quantity : 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(food)}
      className="group relative flex flex-col rounded-2xl bg-[#161514] border border-amber-950/40 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/30 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-stone-900">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161514] via-transparent to-black/30" />

        {/* Dietary / Special Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
          {food.dietary && food.dietary.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide shadow-md ${
                tag === 'Chef Special'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : tag === 'AOP Certified'
                  ? 'bg-rose-900/90 text-rose-100 border border-rose-600/30'
                  : tag === 'Vegetarian'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/30'
                  : 'bg-stone-900/90 text-stone-300 border border-stone-700/60'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Prep Time pill */}
        {food.prepTime && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-stone-300 border border-stone-800">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{food.prepTime}</span>
          </div>
        )}

        {/* Quick View Floating Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 text-white text-xs font-medium border border-amber-500/40 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Details & Pairings</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Rating and Spice */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-semibold text-white">{food.rating ? food.rating.toFixed(2) : '4.9'}</span>
            <span className="text-[11px] text-stone-500">({food.reviewsCount || 30})</span>
          </div>

          {food.spiceLevel > 0 && (
            <div className="flex items-center gap-0.5" title={`Spiciness: ${food.spiceLevel}/3`}>
              {Array.from({ length: food.spiceLevel }).map((_, idx) => (
                <Flame key={idx} className="w-3 h-3 text-rose-500 fill-rose-500" />
              ))}
            </div>
          )}
        </div>

        {/* Dish Title */}
        <h3 className="font-serif text-lg font-semibold text-white group-hover:text-amber-300 transition-colors leading-snug">
          {food.name}
        </h3>

        {/* Authentic Indian/Hindi Subtitle */}
        {(food.hindiName || food.spanishName) && (
          <p className="font-serif italic text-xs text-amber-500/90 mb-2">
            {food.hindiName || food.spanishName}
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {food.description}
        </p>

        {/* Beverage / Pairing Hint */}
        {(food.winePairing || food.beveragePairing) && (
          <div className="mb-4 pt-2 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] text-stone-400 truncate">
            <Wine className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-stone-500">Pairing:</span>
            <span className="text-stone-300 truncate italic">{food.winePairing || food.beveragePairing}</span>
          </div>
        )}

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Price</span>
            <span className="font-serif text-xl font-bold text-amber-300">
              ₹{food.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentInCart > 0 && (
              <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                {currentInCart} in cart
              </span>
            )}
            <button
              onClick={handleQuickAdd}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40 hover:scale-105'
              }`}
              title="Add to cart"
              aria-label={`Add ${food.name} to cart`}
            >
              {justAdded ? (
                <Check className="w-4 h-4 animate-in zoom-in" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
