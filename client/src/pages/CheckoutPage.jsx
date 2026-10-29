// ============================================================================
// CASA TÒPAZ — Checkout Page View
// Address entry, delivery scheduling, Swiss Twint/card payments,
// and order review leading into live courier tracking.
// ============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  Check, 
  Lock, 
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    items, 
    itemCount, 
    subtotal, 
    totalDiscount, 
    deliveryFee, 
    packagingFee, 
    total, 
    clearCart,
    getCheckoutItems,
    appliedPromo
  } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { showToast } = useToast();

  const [deliveryType, setDeliveryType] = useState('asap'); // 'asap' | 'scheduled'
  const [scheduledTime, setScheduledTime] = useState('19:30');
  const [paymentMethod, setPaymentMethod] = useState('twint'); // 'twint' | 'card' | 'apple_pay' | 'cash'

  // Pre-fill from authenticated user or fallback
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [formData, setFormData] = useState({
    name: user?.name || 'Elena Rostova',
    email: user?.email || 'elena.rostova@gastronomie.ch',
    phone: user?.phone || '+41 79 482 19 88',
    street: defaultAddress?.street || 'Rue du Lac 24',
    building: defaultAddress?.building || 'Résidence Belle-Vue, Apt 4B',
    city: defaultAddress?.city || 'Biel/Bienne',
    postalCode: defaultAddress?.postalCode || '2502',
    deliveryNotes: defaultAddress?.deliveryNotes || 'Code porte: 4421. Laisser avec concierge si absent.'
  });

  const cardDetails = {
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '•••'
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#0d0c0c] text-stone-200">
        <ShoppingBag className="w-12 h-12 text-stone-600 mb-4" />
        <h2 className="font-serif text-2xl text-white">Your Cart is Empty</h2>
        <p className="text-xs text-stone-400 max-w-sm mt-1 mb-6">
          Please select tapas or cazuelas from our menu before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="px-6 py-3 rounded-xl bg-amber-600 text-white text-xs font-medium"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    if (!formData.name || !formData.street || !formData.city || !formData.postalCode) {
      showToast('Please complete your full delivery address details', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send product IDs and quantities rather than client prices; backend recalculates and verifies
      const orderPayload = {
        items: getCheckoutItems(),
        deliveryAddress: {
          street: formData.street.trim(),
          building: formData.building ? formData.building.trim() : '',
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          deliveryNotes: formData.deliveryNotes ? formData.deliveryNotes.trim() : ''
        },
        contact: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        },
        deliverySchedule: deliveryType === 'asap' ? 'Immediate (~35 min)' : `Tonight at ${scheduledTime}`,
        paymentMethod,
        promoCode: appliedPromo?.code || undefined
      };

      const created = await createOrder(orderPayload);
      clearCart();
      navigate(`/track/${created.orderNumber || created._id}`);
    } catch (err) {
      console.error('Order submission failed:', err);
      showToast(err.message || 'The order could not be validated by the restaurant.', 'error');
      // Never clear the cart or show fake confirmation on failure!
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-stone-850 pb-4">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to cart</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Complete Your Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            Secure checkout and real-time preparation by our kitchen brigade.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Coordinates & Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-850 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Delivery Address
                  </h2>
                  <p className="text-xs text-stone-400">
                    Where should our couriers deliver your warm culinary selection?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 block">Street & Building Number *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="e.g. Rue du Lac 24"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">Apartment, suite, gate code</label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="e.g. Apt 4B, Intercom Rostova"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="2502"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Biel/Bienne"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">Email Address for Receipt *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 block">
                  Delivery Instructions (optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g., Ring intercom 4B or leave with door attendant..."
                  className="w-full px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>

            {/* Step 2: Delivery Schedule */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-850 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Delivery Time
                  </h2>
                  <p className="text-xs text-stone-400">
                    Immediate cargo bike dispatch or scheduled dining tonight.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setDeliveryType('asap')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryType === 'asap'
                      ? 'bg-amber-950/30 border-amber-500/50 text-white'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Immediate (35-45 min)
                    </span>
                    {deliveryType === 'asap' && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-stone-400">
                    Our brigade begins preparing your dishes immediately upon confirmation.
                  </p>
                </div>

                <div
                  onClick={() => setDeliveryType('scheduled')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryType === 'scheduled'
                      ? 'bg-amber-950/30 border-amber-500/50 text-white'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-bold text-white">
                      Scheduled Tonight
                    </span>
                    {deliveryType === 'scheduled' && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    disabled={deliveryType !== 'scheduled'}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-white"
                  >
                    <option value="18:30">18:30 - 19:00</option>
                    <option value="19:30">19:30 - 20:00 (Recommended)</option>
                    <option value="20:30">20:30 - 21:00</option>
                    <option value="21:30">21:30 - 22:00</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-850 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Secure Payment Method
                  </h2>
                  <p className="text-xs text-stone-400">
                    Transactions protected with Swiss SSL bank-grade encryption.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Twint */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('twint')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'twint'
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="block font-bold text-sm text-emerald-400">TWINT</span>
                  <span className="text-[10px] text-stone-400">Swiss Mobile</span>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="block font-bold text-sm text-amber-300">Card</span>
                  <span className="text-[10px] text-stone-400">Visa / Mastercard</span>
                </button>

                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="block font-bold text-sm text-stone-200">Apple Pay</span>
                  <span className="text-[10px] text-stone-400">Contactless</span>
                </button>

                {/* Cash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="block font-bold text-sm text-stone-200">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-400">Cash / Mobile Terminal</span>
                </button>
              </div>

              {/* Card input mockup if card selected */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">Virtual Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value={cardDetails.number}
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-stone-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-400">Expiration</label>
                      <input
                        type="text"
                        readOnly
                        value={cardDetails.expiry}
                        className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-stone-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-400">CVV Code</label>
                      <input
                        type="text"
                        readOnly
                        value={cardDetails.cvv}
                        className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-stone-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-white border-b border-stone-850 pb-4">
                Order Summary ({itemCount} items)
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-850 space-y-2 pr-1">
                {items.map((item) => (
                  <div key={item.food._id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="font-semibold text-amber-400 font-mono">
                        {item.quantity}×
                      </span>
                      <span className="text-stone-200 truncate">
                        {item.food.name}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-stone-300 shrink-0">
                      CHF {(item.food.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs text-stone-400 border-t border-stone-850 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200">CHF {subtotal.toFixed(2)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege discount</span>
                    <span>- CHF {totalDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Artisanal thermal delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">Complimentary</strong> : `CHF ${deliveryFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Eco-earthenware cazuela deposit</span>
                  <span>CHF {packagingFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-white pt-3 border-t border-stone-800">
                  <span>Total Due</span>
                  <span className="text-amber-300 text-xl font-mono">CHF {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm transition-all shadow-xl shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating your order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order · CHF {total.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="space-y-2 text-center pt-2">
                <p className="text-[11px] text-stone-500">
                  Upon confirmation, you will receive a real-time tracking link with live kitchen preparation updates.
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500/80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Freshness & Serving Temperature Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
