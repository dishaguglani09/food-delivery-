// ============================================================================
// The Indian Rasoi — Categories Showcase Section
// Visual cards for all culinary universes with high-res food imagery
// and quick filtering into the menu page.
// ============================================================================

import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { categories } from '../../data/categories';

export default function CategoryCarousel() {
  return (
    <section className="py-20 bg-[#0d0c0c] border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Universes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              The Palette of Delights
            </h2>
            <p className="text-sm text-stone-400 max-w-xl font-sans leading-relaxed">
              From rich Awadhi gravies and slow-cooked biryanis to crispy South Indian dosas and golden tandoori breads, explore our categories celebrating authentic Indian cuisine.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors group self-start md:self-end"
          >
            <span>View Full Menu ({categories.reduce((acc, c) => acc + c.count, 0)} dishes)</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className={`group relative rounded-3xl overflow-hidden border border-amber-950/40 hover:border-amber-500/50 transition-all duration-500 bg-[#141312] shadow-xl hover:shadow-2xl hover:shadow-amber-950/40 cursor-pointer ${
                index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
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
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-serif bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300">
                  {cat.tag}
                </span>

                {/* Item Count */}
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-mono bg-stone-900/80 backdrop-blur-md text-stone-300 border border-stone-800">
                  {cat.count} specialties
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 group-hover:text-white group-hover:bg-amber-600 group-hover:border-amber-500 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="font-serif italic text-xs text-amber-500/80">
                  « {cat.hindiTitle || cat.spanishTitle} »
                </p>

                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
