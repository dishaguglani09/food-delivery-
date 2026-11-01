// ============================================================================
// The Indian Rasoi — Customer Order History Page
// View all past and active culinary orders, status indicators,
// itemized receipts, and instant re-order actions.
// ============================================================================

import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  MapPin, 
  Compass, 
  RotateCcw, 
  ChevronRight, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item.food, item.quantity, item.specialInstructions || '');
    });
    showToast(`${order.items.length} items from order #${order.orderNumber} added to your cart.`, 'success');
    navigate('/cart');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return {
          label: 'Confirmed in Kitchen',
          bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400'
        };
      case 'Preparing':
      case 'Kitchen Preparing':
        return {
          label: 'Cooking in Royal Rasoi',
          bg: 'bg-orange-950/60 text-orange-300 border-orange-500/40',
          dot: 'bg-orange-400 animate-pulse'
        };
      case 'Dispatched':
        return {
          label: 'Out for Delivery',
          bg: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400 animate-ping'
        };
      case 'Delivered':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
      case 'Cancelled':
        return {
          label: 'Cancelled',
          bg: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400'
        };
      default:
        return {
          label: status,
          bg: 'bg-stone-900 text-stone-300 border-stone-800',
          dot: 'bg-stone-400'
        };
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0d0c0c] text-stone-200 py-16">
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description="You haven't placed an order with The Indian Rasoi yet. Explore our curated selection of authentic curries, tandoori breads, and fragrant biryanis."
          actionLabel="Explore Menu"
          actionLink="/menu"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-8">
        {/* Page Header */}
        <div className="border-b border-stone-850 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guest Lounge · Order History</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              My Orders & Dining History
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Track active culinary dispatches in real time or reorder your favorite selections.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors shadow-lg self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>New Order</span>
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isOngoing = order.status !== 'Delivered' && order.status !== 'Cancelled';

            return (
              <div
                key={order._id}
                className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 hover:border-amber-500/40 transition-all duration-300 shadow-xl space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-850 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif text-lg font-bold text-white">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="font-serif font-bold text-amber-300 text-base">
                      ₹{order.pricing?.total?.toFixed(0) || '0'}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs"
                        >
                          <img
                            src={item.food.image}
                            alt={item.food.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="font-semibold text-amber-400 font-mono">
                            {item.quantity}×
                          </span>
                          <span className="text-stone-300 truncate max-w-[140px] sm:max-w-[200px]">
                            {item.food.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        Delivered to: {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                      </span>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-end">
                    {isOngoing ? (
                      <Link
                        to={`/track/${order.orderNumber}`}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Compass className="w-4 h-4 animate-spin" />
                        <span>Track Live Delivery</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        to={`/track/${order.orderNumber}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 text-xs text-center transition-colors"
                      >
                        View Detailed Receipt
                      </Link>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/20 text-amber-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
