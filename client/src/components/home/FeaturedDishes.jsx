// ============================================================================
// The Indian Rasoi — Featured Dishes & Bestsellers
// Dynamic database-driven showcase of signature creations with instant cart integration.
// Zero hardcoded mock data.
// ============================================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import FoodCard from '../common/FoodCard';
import { foodService } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function FeaturedDishes({ onOpenFoodDetails }) {
  const [activeTab, setActiveTab] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openFoodModal } = useCart();

  useEffect(() => {
    let isMounted = true;
    async function fetchFeatured() {
      try {
        setIsLoading(true);
        const data = await foodService.getFeaturedFoods();
        if (isMounted && Array.isArray(data)) {
          setDishes(data);
        }
      } catch (err) {
        console.warn('Featured dishes notice:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
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
    <section className="py-24 bg-[#0a0909] border-t border-stone-850 relative w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef's Masterpieces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug">
              Signatures & Royal Specialties
            </h2>
            <p className="text-sm text-stone-300 max-w-xl font-normal leading-relaxed">
              Hand-picked bestsellers prepared with heirloom stone-ground spices, pure cow ghee, and live charcoal tandoor craftsmanship.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-950/60 border border-amber-500/30'
                    : 'bg-[#161413] text-stone-300 hover:text-white hover:bg-stone-850 border border-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl h-96 bg-stone-900/60 border border-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : displayedDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedDishes.map((dish) => (
              <FoodCard
                key={dish._id || dish.id}
                food={dish}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-400 font-sans">
            No featured dishes found for this category.
          </div>
        )}

        {/* Bottom CTA to Full Menu */}
        <div className="mt-16 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#141211] hover:bg-[#1a1715] text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400/50 font-serif font-medium text-sm transition-all shadow-xl group"
          >
            <span>Explore All Authentic Indian Dishes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
