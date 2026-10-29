// ============================================================================
// CASA TÒPAZ — Home Page View
// Assembles all signature sections into an atmospheric, seamless culinary journey.
// ============================================================================

import HeroSection from '../components/home/HeroSection';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturedDishes from '../components/home/FeaturedDishes';
import StorySection from '../components/home/StorySection';
import WhyUsSection from '../components/home/WhyUsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const { openFoodModal } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryCarousel />
      <FeaturedDishes onOpenFoodDetails={openFoodModal} />
      <StorySection />
      <WhyUsSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
