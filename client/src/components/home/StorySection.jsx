// ============================================================================
// The Indian Rasoi — Restaurant Story & Heritage Section
// The narrative of royal Awadhi and Punjabi culinary heritage.
// ============================================================================

import { Sparkles, Quote, Award, Heart, CheckCircle2 } from 'lucide-react';
import { storyData } from '../../data/testimonials';

export default function StorySection() {
  return (
    <section id="story" className="py-24 bg-[#0d0c0c] border-t border-stone-850 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with 2 Images */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Image: Sommelier & Chef Artisanal Craft */}
              <div className="rounded-3xl overflow-hidden border border-amber-950/60 shadow-2xl bg-stone-900 aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                  alt="Royal Kitchen at The Indian Rasoi"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              {/* Secondary Overlapping Image: Wine & Cazuela Detail */}
              <div className="hidden sm:block absolute -bottom-10 -right-8 w-3/5 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-stone-900 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80"
                  alt="Authentic Spices and Clay Tandoor Craft"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Heritage Badge */}
              <div className="absolute -top-4 -left-4 p-4 rounded-2xl bg-[#161413]/95 border border-amber-500/40 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="font-serif text-sm font-bold text-white">Founded in 1998</p>
                    <p className="text-[10px] text-stone-400">Delhi & Connaught Place</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story Text, Philosophy & Chef Quote */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story · Daily Craft & Devotion</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {storyData.headline}
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-amber-300/90">
              « {storyData.subhead} »
            </p>

            <div className="space-y-4 text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
              {storyData.narrative.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Chef Quote Card */}
            <div className="p-6 rounded-2xl bg-[#161413] border border-amber-500/20 relative shadow-xl">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-relaxed relative z-10 mb-3">
                {storyData.chefQuote.quote}
              </p>
              <div className="flex items-center justify-between border-t border-stone-850 pt-3">
                <div>
                  <h4 className="font-serif text-sm font-bold text-white">
                    {storyData.chefQuote.author}
                  </h4>
                  <p className="text-xs text-amber-400/80">
                    {storyData.chefQuote.title}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Heart className="w-4 h-4 fill-amber-500/30" />
                </div>
              </div>
            </div>

            {/* Key Craft Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-300">
                  100% Pure Desi Cow Ghee & hand-ground garam masala
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-300">
                  Charcoal-fired clay tandoor & slow dum handi cooking
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-300">
                  Farm-fresh dairy paneer and premium long-grain Basmati
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-300">
                  Insulated spill-proof thermal delivery fleet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
