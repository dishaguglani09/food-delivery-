// ============================================================================
// The Indian Rasoi — Dynamic Menu Page
// Fetches real dish catalog from Express/MongoDB via foodService.
// Supports dynamic search, category filtering, vegetarian toggles,
// price sorting, and responsive loading skeletons.
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  X, 
  Sparkles, 
  Leaf, 
  Check, 
  ArrowUpDown,
  AlertCircle,
  RotateCw
} from 'lucide-react';
import FoodCard from '../components/common/FoodCard';
import EmptyState from '../components/common/EmptyState';
import { MenuGridSkeleton } from '../components/common/LoadingSkeleton';
import { foodService } from '../services/api';
import { categories as categoryList } from '../data/categories';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openFoodModal } = useCart();

  // URL Query Sync - directly derived from searchParams for single source of truth
  const selectedCategory = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  // Real data state from MongoDB
  const [dishes, setDishes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchMenuDishes = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const isVegOnly = selectedDietary.includes('Vegetarian');
      const otherDietary = selectedDietary.filter((d) => d !== 'Vegetarian');

      const response = await foodService.getAllFoods({
        category: selectedCategory,
        search: searchQuery,
        vegetarian: isVegOnly,
        dietary: otherDietary.length > 0 ? otherDietary[0] : undefined,
        sort: sortBy,
        limit: 'all'
      });

      const items = Array.isArray(response) ? response : (response.data || []);
      setDishes(items);
      setTotalCount(response.total || items.length);
    } catch (err) {
      console.error('Failed to load menu items:', err);
      setFetchError(err.message || 'Unable to load menu at this moment.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedDietary, sortBy]);

  // Fetch whenever filters change (with small debounce on search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuDishes();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchMenuDishes]);

  const handleCategorySelect = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const toggleDietaryFilter = (diet) => {
    setSelectedDietary((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDietary([]);
    setSortBy('recommended');
    setSearchParams({});
  };

  const dietaryOptions = [
    { id: 'Vegetarian', label: 'Vegetarian' },
    { id: 'Gluten-Free', label: 'Gluten-Free' },
    { id: 'AOP Certified', label: 'AOP Certified' },
    { id: 'Chef Special', label: 'Chef Specials' },
  ];

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    selectedDietary.length > 0 ||
    sortBy !== 'recommended';

  return (
    <div className="min-h-screen bg-[#0d0c0c] pt-8 pb-24 text-stone-200">
      {/* Menu Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Authentic Indian Cuisine & Royal Rasoi</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              The Indian Rasoi Menu
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-xl">
              Every dish is prepared fresh to order using heirloom Indian spice blends, slow-simmered handis, and authentic clay tandoor techniques.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500 self-center sm:self-end">
            {isLoading ? 'Loading menu...' : `Showing ${dishes.length} of ${totalCount} dishes`}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Sort Controls Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141211] border border-amber-950/40 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ingredients, or pairings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="recommended">Chef's Recommendations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            All Dishes
          </button>

          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dietary Filter Tags & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 mr-1 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Dietary & Certifications:
            </span>
            {dietaryOptions.map((opt) => {
              const active = selectedDietary.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleDietaryFilter(opt.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-medium'
                      : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Dynamic Content Grid / Skeletons / Error */}
        {isLoading ? (
          <MenuGridSkeleton count={6} />
        ) : fetchError ? (
          <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-800/40 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-white">
              Menu Service Temporarily Unavailable
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {fetchError}
            </p>
            <button
              onClick={fetchMenuDishes}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-amber-300 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : dishes.length === 0 ? (
          <EmptyState
            title="No dishes matched your filters"
            description="Try adjusting your search keywords, category filters, or dietary toggles."
            actionLabel="Reset all filters"
            onActionClick={clearAllFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {dishes.map((dish) => (
              <FoodCard
                key={dish._id || dish.id}
                food={dish}
                onOpenDetails={openFoodModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
