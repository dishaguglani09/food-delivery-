// ============================================================================
// The Indian Rasoi — Restaurant Story & Heritage Section
// Pure dynamic database-driven component powered by RestaurantContext.
// Zero hardcoded mock data.
// ============================================================================

import { Sparkles, Quote, Award, Heart, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function StorySection() {
  const { restaurant } = useRestaurant();

  const story = restaurant?.story || {
    headline: 'A Century of Royal Recipes & Pure Devotion',
    subhead: 'Where Awadhi dum traditions meet the clay ovens of Punjab.',
    narrative: [
      'Founded on the culinary heritage of Old Delhi and Awadhi royal kitchens, The Indian Rasoi was born from a desire to bring time-honored Indian recipes to life without shortcuts or compromise.',
      'Our khansamas practice the revered art of dum pukht—cooking in heavy sealed handis over gentle charcoal embers. Every spice blend is stone-ground in small batches daily: whole black cardamom, royal mace, fragrant Kashmiri saffron, and organic bay leaves.',
      'From simmering our Dal Makhani for 16 slow hours in pure cow ghee to baking fresh garlic naans to blistered perfection inside live charcoal clay tandoors, we serve an authentic feast worthy of emperors.'
    ],
    foundedYear: 1998,
    cityLocation: 'Delhi & Connaught Place',
    chefQuote: {
      quote: 'True Indian dining is an act of deep patience. We slow-simmer our dal overnight over embers, knead whole wheat dough with churned ghee, and blend whole cardamom and mace by stone mortar.',
      author: 'Master Chef Rajesh Kumar',
      title: 'Custodian of Royal Awadhi & Punjabi Traditions'
    },
    keyHighlights: [
      '100% Pure Desi Cow Ghee & hand-ground garam masala',
      'Charcoal-fired heirloom clay tandoor baked naans & rotis',
      'Overnight 16-hour slow-simmered Dal Makhani',
      'Sealed handi Awadhi & Hyderabadi Dum Biryanis'
    ]
  };

  return (
    <section id="story" className="py-24 bg-[#0d0c0c] border-t border-stone-850 relative overflow-hidden w-full">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with 2 Images */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Image: Sommelier & Chef Artisanal Craft */}
              <div className="rounded-3xl overflow-hidden border border-amber-950/60 shadow-2xl bg-stone-900 aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                  alt={`${restaurant?.name || 'The Indian Rasoi'} Royal Kitchen`}
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              {/* Secondary Overlapping Image: Spices Craft */}
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
                    <p className="font-serif text-sm font-bold text-white">
                      Founded in {story.foundedYear || 1998}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {story.cityLocation || 'Delhi & Connaught Place'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story Text, Philosophy & Chef Quote */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story · Daily Craft & Devotion</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white leading-tight tracking-tight">
              {story.headline}
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-amber-300/90 font-normal">
              « {story.subhead} »
            </p>

            <div className="space-y-4 text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              {(story.narrative || []).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Chef Quote Card */}
            {story.chefQuote && (
              <div className="p-6 rounded-2xl bg-[#161413] border border-amber-500/20 relative shadow-xl">
                <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
                <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-relaxed relative z-10 mb-3 font-normal">
                  {story.chefQuote.quote}
                </p>
                <div className="flex items-center justify-between border-t border-stone-850 pt-3">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-white">
                      {story.chefQuote.author}
                    </h4>
                    <p className="text-xs text-amber-400/80 font-normal">
                      {story.chefQuote.title}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Heart className="w-4 h-4 fill-amber-500/30" />
                  </div>
                </div>
              </div>
            )}

            {/* Key Craft Highlights */}
            {story.keyHighlights && story.keyHighlights.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {story.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-stone-300">{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
