// ============================================================================
// The Indian Rasoi — Interactive Search Modal
// Real-time keyword filtering across names, ingredients, categories,
// and dietary preferences with instant quick-add.
// Pure database-driven via foodService. Zero mock data fallbacks.
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { foodService } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { addToCart, openFoodModal } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Load available categories dynamically
  useEffect(() => {
    let active = true;
    async function loadCats() {
      try {
        const catData = await foodService.getCategories();
        if (active && Array.isArray(catData)) {
          const names = catData.map((c) => c.name);
          setCategories(['All', ...names]);
        }
      } catch (err) {
        console.warn('Category fetch error in search modal:', err);
      }
    }
    if (isOpen) {
      loadCats();
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Fetch search results from MongoDB Atlas
  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const params = { limit: 12 };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory !== 'All') params.category = selectedCategory;

        const res = await foodService.getAllFoods(params);
        const data = res.data || res;
        if (active && Array.isArray(data)) {
          setDishes(data);
        }
      } catch {
        if (active) setDishes([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedCategory]);

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#141312] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 text-stone-200 animate-in zoom-in-95 duration-150 mb-12">
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center gap-3 bg-[#181615]">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search curries, biryanis, naans, ingredients..."
            className="w-full bg-transparent border-none text-white text-base sm:text-lg placeholder-stone-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-2.5 py-1 rounded-lg text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Dynamic Category Pill Filters */}
        <div className="p-3 border-b border-stone-800/80 bg-[#121110] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-serif whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <div
                key={dish._id || dish.id}
                className="group p-3 rounded-2xl bg-stone-900/60 hover:bg-[#1c1a18] border border-stone-850 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4"
              >
                <div
                  onClick={() => {
                    handleClose();
                    openFoodModal(dish);
                  }}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-800 group-hover:border-amber-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                        {dish.name}
                      </h4>
                      {dish.hindiName && (
                        <span className="text-xs text-amber-500/80 font-sans truncate hidden sm:inline">
                          ({dish.hindiName})
                        </span>
                      )}
                      {dish.isVegetarian && (
                        <span className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center p-0.5 rounded-sm shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5 font-sans">
                      {dish.description}
                    </p>
                    <span className="font-serif text-xs font-bold text-amber-300 mt-1 block">
                      ₹{dish.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(dish, 1);
                    }}
                    className="p-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 transition-all cursor-pointer"
                    title="Quick add to order"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <Search className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm text-stone-400">
                {searchTerm
                  ? `No dishes found matching "${searchTerm}".`
                  : 'No dishes available in this category.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-amber-400 hover:underline"
              >
                Clear search and filters
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#11100f] border-t border-stone-850 flex items-center justify-between text-xs text-stone-500">
          <span>{dishes.length} menu items found</span>
          <button
            onClick={() => {
              handleClose();
              navigate(
                selectedCategory !== 'All'
                  ? `/menu?category=${encodeURIComponent(selectedCategory)}`
                  : '/menu'
              );
            }}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-serif cursor-pointer"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
