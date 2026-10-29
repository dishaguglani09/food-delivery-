// ============================================================================
// CASA TÒPAZ — Testimonials Section
// Clearly identified sample guest & critic reviews for initial UI phase.
// ============================================================================

import { Star, Quote, Sparkles, Heart } from 'lucide-react';
import { sampleTestimonials } from '../../data/testimonials';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#0d0c0c] border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Sample Content Disclaimer */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Echoes From Our Guests</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Reviews & Shared Moments
          </h2>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
            ★ Representative guest reviews for demonstration (Sample Content)
          </div>

          <p className="text-sm text-stone-400 font-sans leading-relaxed">
            What culinary columnists, sommeliers, and tapas aficionados say about our dining delivery and cellar pairings.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-[#141211] border border-amber-950/40 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
            >
              <Quote className="w-10 h-10 text-amber-500/10 absolute top-6 right-6 pointer-events-none group-hover:text-amber-500/20 transition-colors" />

              <div className="space-y-4">
                {/* Badge & Stars */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 font-medium">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans italic">
                  {item.content}
                </p>

                {/* Favorite Dish Pill */}
                {item.favoriteDish && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>Favorite dish: <strong className="text-stone-300">{item.favoriteDish}</strong></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-stone-850 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border border-amber-500/30"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">
                    {item.author}
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                    {item.role}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {item.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
