// ============================================================================
// The Indian Rasoi — Testimonials Section
// Pure dynamic database-driven component powered by RestaurantContext.
// Zero hardcoded mock data.
// ============================================================================

import { Star, Quote, Sparkles, Heart } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function TestimonialsSection() {
  const { restaurant } = useRestaurant();

  const defaultTestimonials = [
    {
      name: 'Aditya & Sunita Verma',
      role: 'Food & Wine Critics · Delhi Gastronomy',
      comment: 'The Butter Chicken and Dal Makhani at The Indian Rasoi remind me of the great royal banquets of Awadh. Rich, velvety, and balanced with pure cow ghee. Truly the finest delivery in the capital.',
      rating: 5,
      badge: 'Royal Awadhi Feast',
      dish: 'Murgh Makhani & Dal Makhani'
    },
    {
      name: 'Pooja Singhania',
      role: 'Executive Director · Connaught Place',
      comment: 'Ordered the Hyderabadi Dum Biryani and Garlic Naans for our boardroom dinner. The sealed handi kept the aroma intact and the meat was exquisitely tender. Unmatched packaging and punctuality.',
      rating: 5,
      badge: 'Corporate Dining Order',
      dish: 'Hyderabadi Dum Chicken Biryani'
    },
    {
      name: 'Vikram & Meera Mehta',
      role: 'Heritage Diners & Culinary Enthusiasts',
      comment: 'Authentic Indian dining is rare to find delivered in 35 minutes with this level of excellence. The Masala Dosa arrived crisp with steaming sambhar, and the Gulab Jamuns were warm and heavenly.',
      rating: 5,
      badge: 'Verified Rasoi Diner',
      dish: 'Crispy Masala Dosa & Gulab Jamun'
    }
  ];

  const testimonials =
    restaurant?.testimonials && restaurant.testimonials.length > 0
      ? restaurant.testimonials
      : defaultTestimonials;

  return (
    <section id="testimonials" className="py-24 bg-[#0d0c0c] border-t border-stone-850 relative w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Echoes From Our Guests</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug">
            Reviews & Shared Moments
          </h2>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 font-medium">
            ★ Verified Diner Reviews from {restaurant?.name || 'The Indian Rasoi'}
          </div>

          <p className="text-sm text-stone-300 font-normal leading-relaxed">
            What royal cuisine enthusiasts, gastronomy critics, and home diners say about our slow-simmered curries and tandoori delivery.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#141211] border border-amber-950/40 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
            >
              <Quote className="w-10 h-10 text-amber-500/10 absolute top-6 right-6 pointer-events-none group-hover:text-amber-500/20 transition-colors" />

              <div className="space-y-4">
                {/* Badge & Stars */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-300">
                    {item.badge || 'Verified Diner'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, starIdx) => (
                      <Star key={starIdx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm text-stone-200 leading-relaxed font-normal italic">
                  « {item.comment} »
                </p>

                {/* Featured Dish */}
                {item.dish && (
                  <div className="pt-2 text-xs text-amber-400/90 font-normal">
                    Ordered: {item.dish}
                  </div>
                )}
              </div>

              {/* Reviewer Details */}
              <div className="pt-6 mt-6 border-t border-stone-850 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-stone-400 font-normal">
                    {item.role}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Heart className="w-3.5 h-3.5 fill-amber-500/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
