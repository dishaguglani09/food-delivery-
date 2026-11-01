// ============================================================================
// The Indian Rasoi — Categories Showcase Section
// Dynamic database-driven category universe powered by MongoDB Atlas.
// ============================================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { foodService } from '../../services/api';

export default function CategoryCarousel() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setIsLoading(true);
        const data = await foodService.getCategories();
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.warn('Categories fetch notice:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalDishes = categories.reduce((acc, c) => acc + (c.count || 0), 0);

  return (
    <section className="py-20 bg-[#0d0c0c] border-t border-stone-850 relative w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Universes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug">
              The Palette of Delights
            </h2>
            <p className="text-sm text-stone-300 max-w-xl font-normal leading-relaxed">
              From rich Awadhi gravies and slow-cooked biryanis to crispy South Indian dosas and golden tandoori breads, explore our categories celebrating authentic Indian cuisine.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors group self-start md:self-end"
          >
            <span>
              View Full Menu {totalDishes > 0 ? `(${totalDishes} dishes)` : ''}
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl aspect-[16/10] sm:aspect-[4/3] bg-stone-900/60 border border-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.name}
                to={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-3xl overflow-hidden border border-amber-950/40 hover:border-amber-500/50 transition-all duration-500 bg-[#141312] shadow-xl hover:shadow-2xl hover:shadow-amber-950/40 cursor-pointer"
              >
                {/* Category Image with Zoom Effect */}
                <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-stone-900 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/40 to-transparent" />

                  {/* Tag Pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300">
                    {cat.tag || `${cat.count} Creations`}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 font-normal">
                      {cat.count} Authentic {cat.count === 1 ? 'Dish' : 'Dishes'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-900/90 border border-stone-800 flex items-center justify-center text-stone-400 group-hover:text-amber-300 group-hover:border-amber-500/40 group-hover:bg-amber-950/40 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
