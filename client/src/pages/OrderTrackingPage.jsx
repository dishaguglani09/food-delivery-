// ============================================================================
// The Indian Rasoi — Live Order Tracking Page
// Multi-stage preparation stepper, simulated delivery courier,
// countdown arrival timer, and itemized receipt breakdown.
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Bike, 
  Share2, 
  Compass, 
  MapPin, 
  Phone, 
  ChefHat, 
  Flame 
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { getOrderById, fetchOrderById, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const order = getOrderById(orderId);
  const [isLoadingOrder, setIsLoadingOrder] = useState(!order && !!orderId);
  const [simulatedStep, setSimulatedStep] = useState(null);

  // Derive step: simulated selection takes priority, then backend/order step, defaulting to 1
  const activeStep = simulatedStep ?? (order?.statusStep || 1);

  useEffect(() => {
    let isMounted = true;
    if (!order && orderId) {
      fetchOrderById(orderId).finally(() => {
        if (isMounted) setIsLoadingOrder(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [order, orderId, fetchOrderById]);

  if (isLoadingOrder) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0d0c0c] text-stone-200 py-16">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-serif text-amber-400 uppercase tracking-widest">
          Synchronizing your order with the kitchen...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0d0c0c] text-stone-200 py-16">
        <EmptyState
          icon={Compass}
          title="Order Not Found"
          description={`No culinary order found with ID #${orderId}.`}
          actionLabel="View My Orders"
          actionLink="/orders"
        />
      </div>
    );
  }

  const steps = [
    {
      step: 1,
      title: 'Order Confirmed',
      time: '18:15',
      desc: 'Received and validated by The Indian Rasoi kitchen team',
      icon: CheckCircle2
    },
    {
      step: 2,
      title: 'Kitchen Cooking',
      time: '18:22',
      desc: 'Simmering handis and baking fresh tandoori breads to order',
      icon: ChefHat
    },
    {
      step: 3,
      title: 'Out for Delivery',
      time: '18:38',
      desc: 'Sealed in thermal packaging with our delivery courier',
      icon: Bike
    },
    {
      step: 4,
      title: 'Delivered & Served',
      time: '18:55',
      desc: 'Handed over warm and ready to savor',
      icon: Sparkles
    }
  ];

  const handleStepSimulation = (stepNumber) => {
    const statusNames = {
      1: 'Confirmed',
      2: 'Kitchen Preparing',
      3: 'Dispatched',
      4: 'Delivered'
    };
    setSimulatedStep(stepNumber);
    updateOrderStatus(order._id, statusNames[stepNumber]);
  };

  const handleShareTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tracking link copied to clipboard!', 'success');
    } else {
      showToast('Tracking link ready to share', 'info');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-850 pb-6">
          <div className="space-y-1">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to my orders</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Live Tracking #{order.orderNumber}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-serif bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Estimated arrival in ~17 min
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400">
              Track your courier's live route and real-time kitchen preparation status.
            </p>
          </div>

          <button
            onClick={handleShareTracking}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-300 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share tracking</span>
          </button>
        </div>

        {/* Live Tracking Interactive Stepper Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141211] border border-amber-500/30 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-amber-400">
                Current Culinary Status
              </span>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                {steps[activeStep - 1]?.title || 'Currently in preparation'}
              </h2>
            </div>

            {/* Simulation pill selector for demonstration */}
            <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl text-xs">
              <span className="px-2 text-[10px] text-stone-400 uppercase font-mono">Simulate step:</span>
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => handleStepSimulation(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeStep === num
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                  title={`Switch to step ${num}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((s) => {
              const Icon = s.icon;
              const isPassed = activeStep >= s.step;
              const isCurrent = activeStep === s.step;

              return (
                <div
                  key={s.step}
                  onClick={() => handleStepSimulation(s.step)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/30'
                      : isPassed
                      ? 'bg-stone-900/60 border-stone-800 text-stone-300'
                      : 'bg-stone-950/40 border-stone-900 opacity-60 text-stone-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCurrent
                          ? 'bg-amber-600 text-white shadow-md'
                          : isPassed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-stone-900 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-stone-400">Step {s.step}/4</span>
                  </div>

                  <div>
                    <h3 className={`font-serif text-base font-bold ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                      {s.title}
                    </h3>
                    <p className="text-xs text-stone-400 leading-snug mt-1">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500">
                    <span>{s.time}</span>
                    {isCurrent && (
                      <span className="text-amber-400 font-medium animate-pulse">In progress...</span>
                    )}
                    {isPassed && !isCurrent && (
                      <span className="text-emerald-400 font-medium">Completed ✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier & Route Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Courier Profile & Interactive Map Representation */}
          <div className="lg:col-span-7 space-y-6">
            {/* Courier Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-850 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                    R
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {order.courier?.name || 'Rahul Sharma'}
                    </h3>
                    <p className="text-xs text-stone-400 flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-amber-400" />
                      <span>{order.courier?.transport || 'Thermal Insulated Delivery Bike'}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${order.courier?.phone || '+919811122334'}`}
                  className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Courier</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <span>Current location: <strong className="text-stone-200">{order.courier?.currentLocation || 'Connaught Place Outer Circle, 500m'}</strong></span>
                <span className="text-amber-400 font-medium">Guest rating: ★ {order.courier?.rating || '4.98'}</span>
              </div>
            </div>

            {/* Simulated Live Route Graphic Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-amber-400">
                  <Compass className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Live Route Dispatch</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  GPS Signal Active
                </span>
              </div>

              {/* Graphic Route Representation */}
              <div className="relative rounded-2xl bg-[#0a0909] border border-stone-800 p-6 min-h-[220px] flex flex-col justify-between overflow-hidden">
                {/* Stylized street lines grid */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Route visualization */}
                <div className="relative z-10 flex items-center justify-between pt-6">
                  {/* Origin */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-300 shadow-lg">
                      <Flame className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="font-serif text-xs font-bold text-white">The Indian Rasoi</span>
                    <span className="text-[10px] text-stone-400">Connaught Place</span>
                  </div>

                  {/* Animated Path */}
                  <div className="flex-1 px-4 relative flex items-center">
                    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 animate-pulse" />
                    </div>
                    {/* Animated Courier Bike on path */}
                    <div className="absolute left-[70%] -top-3 w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg animate-bounce">
                      <Bike className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-300 shadow-lg">
                      <MapPin className="w-5 h-5 text-rose-400" />
                    </div>
                    <span className="font-serif text-xs font-bold text-white">Your Destination</span>
                    <span className="text-[10px] text-stone-400 truncate max-w-[100px]">
                      {order.deliveryAddress?.city}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-4 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                  <span>Distance remaining: <strong className="text-white">850 meters</strong></span>
                  <span>Average speed: <strong className="text-white">22 km/h</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Receipt Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-stone-850 pb-4">
                <h3 className="font-serif text-xl font-bold text-white">
                  Itemized Receipt Details
                </h3>
                <span className="font-mono text-xs text-stone-500">
                  {order.items?.length} items
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-850 space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="font-mono font-bold text-amber-400 mt-0.5">
                        {item.quantity}×
                      </span>
                      <div>
                        <h4 className="font-medium text-white truncate">
                          {item.food.name}
                        </h4>
                        {item.specialInstructions && (
                          <p className="text-[11px] text-stone-400 italic mt-0.5">
                            « {item.specialInstructions} »
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-stone-300 shrink-0">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="space-y-2 text-xs text-stone-400 border-t border-stone-850 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200">₹{order.pricing?.subtotal?.toFixed(0)}</span>
                </div>
                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege discount</span>
                    <span>- ₹{order.pricing?.discount?.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier delivery</span>
                  <span>{order.pricing?.deliveryFee === 0 ? <strong className="text-emerald-400">Complimentary</strong> : `₹${order.pricing?.deliveryFee?.toFixed(0)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermal packaging fee</span>
                  <span>₹{order.pricing?.packagingFee?.toFixed(0) || '20'}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-white pt-3 border-t border-stone-800">
                  <span>Total Paid</span>
                  <span className="text-amber-300 text-lg">₹{order.pricing?.total?.toFixed(0)}</span>
                </div>
              </div>

              {/* Delivery Address Reminder */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs space-y-1">
                <span className="text-stone-400 font-medium block">Destination:</span>
                <p className="text-white font-medium">
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.building}
                </p>
                <p className="text-stone-400">
                  {order.deliveryAddress?.postalCode} {order.deliveryAddress?.city}
                </p>
                {order.deliveryAddress?.deliveryNotes && (
                  <p className="text-stone-400 italic pt-1 border-t border-stone-850 mt-1">
                    Note: {order.deliveryAddress.deliveryNotes}
                  </p>
                )}
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => window.print()}
                  className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                >
                  Download / Print Official Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
