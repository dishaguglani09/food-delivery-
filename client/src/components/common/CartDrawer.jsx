// ============================================================================
// The Indian Rasoi — Slide-over Cart Drawer
// Real-time basket updates, free delivery progress bar,
// promo code applicator, and direct checkout CTA.
// ============================================================================

import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    totalDiscount,
    deliveryFee,
    packagingFee,
    total,
    amountUntilFreeDelivery,
    freeDeliveryProgress,
    appliedPromo,
    promoCode,
    setPromoCode,
    applyPromo,
    removePromo,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    closeCart
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode) {
      applyPromo(promoCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#131211] border-l border-amber-950/60 shadow-2xl flex flex-col justify-between text-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Your Selection</h3>
                <span className="text-xs text-stone-400">
                  {itemCount} {itemCount > 1 ? 'dishes selected' : 'dish selected'}
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-850 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          <div className="px-6 py-3 bg-[#191716] border-b border-stone-800/80">
            {amountUntilFreeDelivery > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Add <strong className="text-amber-300">₹{amountUntilFreeDelivery.toFixed(0)}</strong> for free delivery
                  </span>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {Math.round(freeDeliveryProgress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Congratulations! You unlocked complimentary delivery.</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-stone-850">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-white">Your cart is empty</h4>
                  <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                    Explore our rich curries, fragrant biryanis, and tandoori breads.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors shadow-md cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.food._id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-800 bg-stone-900 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate leading-snug">
                          {item.food.name}
                        </h4>
                        {(item.food.hindiName || item.food.spanishName) && (
                          <p className="font-serif italic text-xs text-amber-500/80 truncate">
                            {item.food.hindiName || item.food.spanishName}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[11px] text-stone-400 italic line-clamp-1 mt-0.5">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.food._id)}
                        className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Stepper & Item Total */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.food._id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.food._id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-amber-300">
                        ₹{(item.food.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Action Buttons */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#161413] border-t border-stone-800 space-y-4">
              {/* Promo Code Input */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Code {appliedPromo.code} ({appliedPromo.label})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-stone-400 hover:text-rose-400 text-xs underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (e.g. RASOI10)"
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-400 border-t border-stone-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200">₹{subtotal.toFixed(0)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege discount</span>
                    <span>- ₹{totalDiscount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Courier delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">Complimentary</strong> : `₹${deliveryFee.toFixed(0)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Thermal packaging
                    <span className="text-[10px] text-stone-500">(spill-proof)</span>
                  </span>
                  <span>₹{packagingFee.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-white pt-2 border-t border-stone-800">
                  <span>Estimated Total</span>
                  <span className="text-amber-300 text-lg">₹{total.toFixed(0)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-stone-400 px-1 pt-1">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="hover:text-amber-300 underline underline-offset-4"
                  >
                    View detailed basket
                  </Link>
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    Secure Checkout
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
