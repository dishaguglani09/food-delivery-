// ============================================================================
// CASA TÒPAZ — Interactive Search Modal
// Real-time keyword filtering across names, ingredients, categories,
// and dietary preferences with instant quick-add.
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plus, ArrowRight, Flame } from 'lucide-react';
import { sampleFoods } from '../../data/sampleFoods';
import { foodService } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { addToCart, openFoodModal } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dbDishes, setDbDishes] = useState(null);
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

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      try {
        const params = {};
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory !== 'All') params.category = selectedCategory;
        const res = await foodService.getAllFoods(params);
        const data = res.data || res;
        if (active && Array.isArray(data)) {
          setDbDishes(data);
        }
      } catch {
        if (active) setDbDishes(null);
      }
    };

    const timer = setTimeout(fetchResults, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedCategory]);

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

  // Handle escape key
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

  const categories = [
    'All',
    'Pinchos & Tapas',
    'Cazuelas & Plats Chauds',
    'Charcuterie & Fromages',
    'Postres & Douceurs',
    'Vinos & Cocktails'
  ];

  // If live backend search results are returned, prioritize them
  const sampleFiltered = sampleFoods.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = dish.name.toLowerCase().includes(query);
    const matchesSpanish = dish.spanishName?.toLowerCase().includes(query);
    const matchesDesc = dish.description.toLowerCase().includes(query);
    const matchesIngr = dish.ingredients?.some((ing) => ing.toLowerCase().includes(query));
    const matchesDiet = dish.dietary?.some((d) => d.toLowerCase().includes(query));

    return matchesCategory && (matchesName || matchesSpanish || matchesDesc || matchesIngr || matchesDiet);
  });

  const filteredDishes = dbDishes !== null ? dbDishes : sampleFiltered;

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
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for pinchos, Raclette AOP, sangria, Jamón Bellota..."
            className="flex-1 bg-transparent border-none text-white placeholder-stone-500 text-sm sm:text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-stone-400 hover:text-white text-xs px-2 py-1 bg-stone-800 rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 sm:px-6 py-3 border-b border-stone-800/80 bg-[#121110] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white font-medium'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-stone-850">
          {filteredDishes.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 mx-auto flex items-center justify-center text-stone-500">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm text-stone-300 font-serif">
                No dishes matched your search for “{searchTerm}”
              </p>
              <p className="text-xs text-stone-500">
                Try terms such as “Raclette”, “Prawns”, “Bellota”, or “Sangria”.
              </p>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <div
                key={dish._id}
                onClick={() => {
                  onClose();
                  openFoodModal(dish);
                }}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group cursor-pointer hover:bg-stone-900/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-stone-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif text-amber-400/90 truncate">
                        {dish.category}
                      </span>
                      {dish.spiceLevel > 0 && (
                        <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors truncate">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-serif text-sm font-bold text-amber-300">
                    CHF {dish.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dish, 1);
                    }}
                    className="w-8 h-8 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Add to cart"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#121110] border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>{filteredDishes.length} {filteredDishes.length === 1 ? 'dish found' : 'dishes found'}</span>
          <button
            onClick={() => {
              onClose();
              navigate('/menu');
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
