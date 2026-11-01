// ============================================================================
// The Indian Rasoi — Cinematic Hero Section
// Pure dynamic database-driven component powered by MongoDB Atlas:
// - Dynamic headlines, description, and culinary guarantees from RestaurantContext
// - Dynamic featured spotlight dish fetched via foodService.getFeaturedFoods()
// - Direct instant cart integration with MongoDB ObjectId
// - Full-width layout spanning 100% viewport width
// ============================================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { foodService } from '../../services/api';

export default function HeroSection() {
  const { restaurant } = useRestaurant();
  const { addToCart } = useCart();
  const [spotlightDish, setSpotlightDish] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSpotlight() {
      try {
        const featured = await foodService.getFeaturedFoods();
        if (isMounted && Array.isArray(featured) && featured.length > 0) {
          // Look for Butter Chicken or pick the first featured dish
          const butterChicken = featured.find((d) => d.name.toLowerCase().includes('butter chicken'));
          setSpotlightDish(butterChicken || featured[0]);
        }
      } catch (err) {
        console.warn('Spotlight dish load notice:', err.message);
      }
    }
    loadSpotlight();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOrderSpotlight = () => {
    if (spotlightDish) {
      addToCart(spotlightDish, 1);
    }
  };

  const restaurantName = restaurant?.name || 'The Indian Rasoi';
  const restaurantTagline = restaurant?.tagline || 'Authentic Indian Flavors & Royal Biryanis';
  const restaurantDesc =
    restaurant?.description ||
    'Experience the timeless recipes of Delhi, Awadh, and Punjab united with slow-cooked dum traditions and fresh hand-ground spices.';
  const deliveryTime = restaurant?.delivery?.estimatedTime || '30–40 min';

  return (
    <section className="relative w-full overflow-hidden bg-[#0d0c0c] pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24">
      {/* Background Cinematic Ambience */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt={`${restaurantName} Royal Ambience`}
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0c] via-[#0d0c0c]/80 to-[#0d0c0c]/60" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 font-medium tracking-normal">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{restaurantTagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-[1.12]">
              The Heritage of Royal Flavors & <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                {restaurantName}
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {restaurantDesc}
            </p>

            {/* Interactive CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/menu"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm tracking-normal transition-all shadow-xl shadow-amber-950/60 flex items-center justify-center gap-2.5 group border border-amber-400/30 hover:scale-[1.02]"
              >
                <span>Explore the Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#story"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1c1a18]/90 hover:bg-[#252220] text-stone-200 hover:text-white font-medium text-sm tracking-normal transition-all border border-stone-800 hover:border-amber-500/40 flex items-center justify-center gap-2"
              >
                <span>Our Story</span>
              </a>
            </div>

            {/* Value Guarantees Row */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 max-w-xl xl:max-w-2xl mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <span className="text-base sm:text-lg font-semibold text-amber-300 block">{deliveryTime}</span>
                <span className="text-xs text-stone-400 font-normal">Insulated thermal delivery</span>
              </div>
              <div className="space-y-0.5 border-l border-stone-800 pl-4">
                <span className="text-base sm:text-lg font-semibold text-amber-300 block">Pure Desi Ghee</span>
                <span className="text-xs text-stone-400 font-normal">Hand-ground spices</span>
              </div>
              <div className="space-y-0.5 border-l border-stone-800 pl-4">
                <span className="text-base sm:text-lg font-semibold text-amber-300 block">4.95 ★</span>
                <span className="text-xs text-stone-400 font-normal">+5,000 delighted diners</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 xl:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-lg xl:max-w-xl lg:ml-auto">
              {/* Outer Decorative Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-stone-900 group">
                <img
                  src={
                    spotlightDish?.image ||
                    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={spotlightDish?.name || 'The Indian Rasoi Signature Creation'}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Overlay Card Details */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#141211]/90 backdrop-blur-md border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-400">
                      Signature Dish Spotlight
                    </span>
                    <span className="text-base font-semibold text-amber-300">
                      ₹{spotlightDish?.price || 380}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">
                    {spotlightDish?.name || 'Butter Chicken (Murgh Makhani)'}{' '}
                    {spotlightDish?.hindiName && (
                      <span className="font-normal text-amber-400/90 text-sm">
                        — {spotlightDish.hindiName}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 font-sans">
                    {spotlightDish?.description ||
                      'Tender boneless tandoori chicken simmered in a velvety tomato & cashew nut gravy, finished with fresh cream, kasuri methi, and pure butter.'}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Steaming & Fresh to Serve
                    </span>
                    {spotlightDish ? (
                      <button
                        onClick={handleOrderSpotlight}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium font-serif flex items-center gap-1 group/btn cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order Now</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <Link
                        to="/menu"
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium font-serif flex items-center gap-1 group/btn"
                      >
                        <span>View Menu</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Privilege Badge */}
              <div className="absolute -top-4 -left-4 p-3 sm:p-4 rounded-2xl bg-[#161413]/95 border border-amber-500/40 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-serif font-bold text-white block">
                    Culinary Heritage
                  </span>
                  <span className="text-[9px] text-stone-400">Royal Awadhi & Punjabi</span>
                </div>
              </div>

              {/* Floating Delivery Guarantee Badge */}
              <div className="absolute -bottom-4 -right-4 p-3 rounded-2xl bg-[#161413]/95 border border-amber-500/40 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-[10px]">
                  <span className="font-bold text-white block">Thermal Insulated Packaging</span>
                  <span className="text-stone-400">Leak-proof handi containers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
