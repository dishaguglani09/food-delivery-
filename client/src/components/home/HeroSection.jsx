// ============================================================================
// The Indian Rasoi — Cinematic Hero Section
// High-definition Indian food photography, royal Mughlai atmosphere,
// floating culinary privilege badges, and working Explore Menu CTA.
// ============================================================================

import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, ShieldCheck, Flame } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center overflow-hidden bg-[#0d0c0c] pt-8 pb-16 lg:py-24">
      {/* Background Cinematic Ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="The Indian Rasoi Royal Ambience"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0c] via-[#0d0c0c]/80 to-[#0d0c0c]/60" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentic Culinary Heritage & Royal Tandoor</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              The Heritage of Royal Flavors & <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Authentic Indian Rasoi
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Experience the timeless recipes of Delhi, Awadh, and Punjab united with slow-cooked dum traditions and fresh hand-ground spices. 
              Velvety Butter Chicken, fragrant Hyderabadi Dum Biryani, crisp tandoori garlic naans, 
              and artisanal street delights delivered piping hot to your table.
            </p>

            {/* Interactive CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm sm:text-base tracking-wide transition-all shadow-xl shadow-amber-950/60 flex items-center justify-center gap-3 group border border-amber-400/30 hover:scale-[1.02]"
              >
                <span>Explore the Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#story"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#1c1a18]/90 hover:bg-[#252220] text-stone-200 hover:text-white font-medium text-sm sm:text-base tracking-wide transition-all border border-stone-800 hover:border-amber-500/40 flex items-center justify-center gap-2"
              >
                <span>Our Story</span>
              </a>
            </div>

            {/* Value Guarantees Row */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 block">30 min</span>
                <span className="text-[11px] sm:text-xs text-stone-400">Insulated thermal delivery</span>
              </div>
              <div className="space-y-0.5 border-l border-stone-800 pl-4">
                <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 block">Pure Desi Ghee</span>
                <span className="text-[11px] sm:text-xs text-stone-400">Hand-ground spices</span>
              </div>
              <div className="space-y-0.5 border-l border-stone-800 pl-4">
                <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 block">4.95 ★</span>
                <span className="text-[11px] sm:text-xs text-stone-400">+5,000 delighted diners</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80"
                  alt="Murgh Makhani Butter Chicken Signature"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Overlay Card Details */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#141211]/90 backdrop-blur-md border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif uppercase tracking-wider text-amber-400">
                      Signature Dish Spotlight
                    </span>
                    <span className="font-serif text-base font-bold text-amber-300">
                      ₹380
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Murgh Makhani (Butter Chicken) — मुर्ग मक्खनी
                  </h3>
                  <p className="text-xs text-stone-300 leading-snug">
                    Tender boneless tandoori chicken simmered in a velvety tomato & cashew nut gravy, finished with fresh cream, kasuri methi, and pure butter.
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Flame className="w-3.5 h-3.5" /> Steaming & Fresh to Serve
                    </span>
                    <Link
                      to="/menu"
                      className="text-amber-300 hover:underline flex items-center gap-1 font-medium"
                    >
                      Order Now <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Chef Recommendation Pill */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3.5 rounded-2xl bg-[#191715]/95 border border-amber-500/40 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Culinary Heritage Winner</p>
                  <p className="text-[11px] text-stone-400 font-serif">Best Indian Kitchen 2026</p>
                </div>
              </div>

              {/* Floating Packaging Guarantee Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 p-3 rounded-2xl bg-[#191715]/95 border border-amber-500/40 shadow-xl backdrop-blur-md flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Thermal Insulated Packaging</p>
                  <p className="text-[10px] text-stone-400">Leak-proof handi containers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
