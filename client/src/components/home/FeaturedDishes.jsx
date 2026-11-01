// ============================================================================
// The Indian Rasoi — Featured Dishes & Bestsellers
// Interactive showcase of signature creations with instant cart integration.
// ============================================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import FoodCard from '../common/FoodCard';
import { sampleFoods } from '../../data/sampleFoods';
import { foodService } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function FeaturedDishes({ onOpenFoodDetails }) {
  const [activeTab, setActiveTab] = useState('All');
  const [dishes, setDishes] = useState(() => sampleFoods.filter((dish) => dish.isFeatured));
  const { openFoodModal } = useCart();

  useEffect(() => {
    let isMounted = true;
    async function fetchFeatured() {
      try {
        const data = await foodService.getFeaturedFoods();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setDishes(data);
        }
      } catch {
        // Fallback to initial sample state
      }
    }
    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDetails = (dish) => {
    if (onOpenFoodDetails) {
      onOpenFoodDetails(dish);
    } else {
      openFoodModal(dish);
    }
  };

  const tabs = [
    { id: 'All', label: 'All Signatures' },
    { id: 'North Indian', label: 'North Indian' },
    { id: 'Rice & Biryani', label: 'Biryani & Rice' },
    { id: 'Street Food', label: 'Street Food' },
    { id: 'South Indian', label: 'South Indian' },
  ];

  const displayedDishes = dishes.filter((dish) => {
    if (activeTab === 'All') return true;
    return dish.category === activeTab;
  });

  return (
    <section className="py-24 bg-[#0a0909] border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chef's Selection & Bestsellers</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            The Indian Rasoi Signatures
          </h2>
          <p className="text-sm text-stone-400 font-sans leading-relaxed">
            Our most celebrated dishes, freshly cooked to order and delivered ready to enjoy.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60 scale-105'
                  : 'bg-stone-900/90 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedDishes.slice(0, 6).map((dish) => (
            <FoodCard
              key={dish._id}
              food={dish}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>

        {/* Bottom CTA to View Full Menu */}
        <div className="mt-14 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-850 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white font-medium text-sm transition-all shadow-xl group"
          >
            <span>Explore Complete Menu ({sampleFoods.length} dishes)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
