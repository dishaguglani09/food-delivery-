// ============================================================================
// The Indian Rasoi — Dedicated Cart Page
// Full table view of dishes, quantities, packaging calculation,
// discount vouchers, and checkout navigation.
// ============================================================================

import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Flame 
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';

export default function CartPage() {
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
    clearCart
  } = useCart();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode) {
      applyPromo(promoCode);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0d0c0c] text-stone-200 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your basket is currently empty"
          description="You haven’t added any Indian curries, tandoori breads, or biryanis to your order yet."
          actionLabel="Explore Indian Menu"
          actionLink="/menu"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-850 pb-6">
          <div className="space-y-1">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue exploring the menu</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              My Tasting Basket
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Review your selected dishes and prepare for exceptional home dining.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear basket</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#161413] border border-amber-950/60 shadow-lg">
          {amountUntilFreeDelivery > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-stone-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Add <strong className="text-amber-300">₹{amountUntilFreeDelivery.toFixed(0)}</strong> more for complimentary delivery
                </span>
                <span className="font-mono text-stone-400 text-xs">
                  {Math.round(freeDeliveryProgress)}% reached
                </span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Congratulations! You unlocked complimentary home delivery.</span>
            </div>
          )}
        </div>

        {/* Two-Column Layout: Items Table (Left) + Order Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl bg-[#141211] border border-amber-950/40 divide-y divide-stone-850 overflow-hidden shadow-xl">
              {items.map((item) => (
                <div
                  key={item.food._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Photo & Titles */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-stone-800 bg-stone-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-serif text-amber-400/90 truncate block">
                        {item.food.category}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate">
                        {item.food.name}
                      </h3>
                      {(item.food.hindiName || item.food.spanishName) && (
                        <p className="font-serif italic text-xs text-amber-500/80 truncate">
                          {item.food.hindiName || item.food.spanishName}
                        </p>
                      )}
                      <p className="text-xs text-amber-300 font-mono mt-1">
                        ₹{item.food.price} each
                      </p>
                      {item.specialInstructions && (
                        <p className="text-[11px] text-stone-400 italic line-clamp-1 mt-0.5">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-850">
                    {/* Quantity */}
                    <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.food._id, -1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs sm:text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.food._id, 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[80px]">
                      <span className="font-serif text-base sm:text-lg font-bold text-amber-300">
                        ₹{(item.food.price * item.quantity).toFixed(0)}
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.food._id)}
                      className="text-stone-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                      title="Remove"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Note on thermal packaging */}
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-850 flex items-start gap-3 text-xs text-stone-400">
              <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                <strong>The Indian Rasoi Freshness Guarantee:</strong> All hot dishes are delivered in thermal insulated containers and sealed packaging. The ₹20 packaging fee ensures leak-proof thermal protection during transit.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary & Voucher */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-white border-b border-stone-850 pb-4">
                Order Summary
              </h2>

              {/* Promo Code Box */}
              <div className="space-y-2">
                <span className="text-xs text-stone-400 font-medium block">
                  Privilege Voucher or Promo Code
                </span>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs">
                    <div className="flex items-center gap-2 text-amber-300">
                      <Tag className="w-4 h-4" />
                      <span>{appliedPromo.label}</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-stone-400 hover:text-rose-400 underline cursor-pointer"
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
                      placeholder="e.g. RASOI10 or DESI15"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 uppercase focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                <p className="text-[11px] text-stone-500">
                  Available promo codes: <code className="text-amber-400">RASOI10</code> (10%) or <code className="text-amber-400">DESI15</code> (15%)
                </p>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-400 border-t border-stone-850 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="text-stone-200">₹{subtotal.toFixed(0)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege discount</span>
                    <span>- ₹{totalDiscount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Courier delivery (~30-40 min)</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-400 font-semibold">Complimentary</strong>
                    ) : (
                      `₹${deliveryFee.toFixed(0)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Thermal packaging fee</span>
                  <span>₹{packagingFee.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-base sm:text-lg font-serif font-bold text-white pt-4 border-t border-stone-800">
                  <span>Total Amount</span>
                  <span className="text-amber-300 text-xl">₹{total.toFixed(0)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm transition-all shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>256-bit SSL encrypted · UPI, Cards & Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
