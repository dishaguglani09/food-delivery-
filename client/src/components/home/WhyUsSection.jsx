// ============================================================================
// CASA TÒPAZ — Why Choose Us / Culinary Philosophy
// Highlights of artisanal craftsmanship, thermal earthenware delivery,
// grand cru sommelier pairings, and sustainable values.
// ============================================================================

import { 
  Sparkles, 
  Flame, 
  Wine, 
  Leaf, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function WhyUsSection() {
  const pillars = [
    {
      icon: Flame,
      title: 'Piping-Hot Cocotte Delivery',
      subtitle: 'Thermal earthenware cookware',
      description: 'Your hot cazuelas and pinchos are not delivered in soggy cardboard. We deliver in artisan terracotta cocottes preheated to 140°C that retain the sizzle, juices, and aroma right to your table.',
      badge: 'Thermal Cookware'
    },
    {
      icon: ShieldCheck,
      title: 'Certified Terroir & 100% Bellota',
      subtitle: 'Jabugo & Valais AOP origins',
      description: 'We never compromise on provenance: knife-carved charcuterie from free-range pigs fed exclusively on acorns, and raw milk alpine cheeses with protected AOP status.',
      badge: 'Artisan Terroir'
    },
    {
      icon: Wine,
      title: 'Signature Sommelier Cellar',
      subtitle: 'Rare vintages & bespoke pairings',
      description: 'Every dish features an astute sommelier pairing: library vintages of Rioja Gran Reserva, crisp alpine Petite Arvine, and our 48-hour macerated citrus house sangria.',
      badge: 'Certified Sommelier'
    },
    {
      icon: Leaf,
      title: 'Zero Plastic & Electric Couriers',
      subtitle: 'Swiss eco-responsibility',
      description: 'All containers are recyclable or refundable earthenware. Our delivery brigade operates exclusively on whisper-quiet, zero-emission thermal cargo e-bikes.',
      badge: '100% Eco-Circular'
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-[#0a0909] border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Uncompromising Standards</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Why Choose Casa Tòpaz?
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-sans leading-relaxed">
            Redefining fine dining delivery: the refinement of a grand restaurant and the soul of an Iberian taberna, at your door in 35 minutes.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative p-8 rounded-3xl bg-[#141211] border border-amber-950/40 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-amber-950/20"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="font-serif italic text-xs text-amber-500/80 mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-850 flex items-center gap-2 text-xs text-stone-400 group-hover:text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Guaranteed culinary standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
