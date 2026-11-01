// ============================================================================
// The Indian Rasoi — Complete Restaurant Footer
// Brand narrative, opening hours, delivery radius, culinary notes,
// newsletter subscription, and authentic quality guarantees.
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Check
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function Footer() {
  const { showToast } = useToast();
  const { restaurant } = useRestaurant();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const contact = restaurant?.contact || {
    address: 'Block B, Connaught Place, New Delhi, Delhi 110001, India',
    phone: '+91 98765 43210',
    email: 'contact@theindianrasoi.com',
    hours: {
      delivery: '12:00 PM – 11:30 PM (Daily)',
      lunch: '12:00 PM – 3:30 PM',
      dinner: '7:00 PM – 11:30 PM'
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to The Indian Rasoi Privilege Circle! Your invitation is on its way.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0a0909] text-stone-300 border-t border-amber-900/30 pt-16 pb-12 relative overflow-hidden w-full">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-600/5 blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Top Newsletter & Club Privilège Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#171513] via-[#211a18] to-[#171513] border border-amber-500/20 p-8 sm:p-10 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rasoi Privilege Circle</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                Royal Feasts, Fragrant Biryanis & Heirloom Delicacies
              </h3>
              <p className="text-sm text-stone-400 max-w-xl leading-relaxed">
                Join our exclusive culinary circle. Receive priority allocations of slow-cooked dum biryanis, chef specials, and festival feasts.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your personal email address"
                  className="flex-1 px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-sm font-medium transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <span>Join Circle</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 4 Columns Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-xl">
                {restaurant?.monogram || 'IR'}
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-[#fbf9f5] uppercase">
                  {restaurant?.name || 'The Indian Rasoi'}
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-amber-500/90 font-medium">
                  {restaurant?.tagline || 'Authentic Indian Flavors & Royal Biryanis'}
                </span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              The authentic celebration of royal Awadhi and Punjabi culinary heritage. Hand-ground heirloom spices, charcoal-tandoor rotis, and slow-simmered handi curries delivered piping hot to your table.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <span className="text-xs text-stone-500 ml-2 font-mono">#TheIndianRasoi</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-white tracking-wider uppercase font-medium">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">
                  Atmosphere & Overview
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-amber-300 transition-colors">
                  Complete Menu
                </Link>
              </li>
              <li>
                <a href="/#story" className="hover:text-amber-300 transition-colors">
                  Story & Chef Philosophy
                </a>
              </li>
              <li>
                <a href="/#why-us" className="hover:text-amber-300 transition-colors">
                  Artisanal Standard
                </a>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-300 transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Culinary Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-white tracking-wider uppercase font-medium">
              Menu Highlights
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/menu?category=North Indian" className="hover:text-amber-300 transition-colors">
                  Butter Chicken & Dal Makhani
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Rice %26 Biryani" className="hover:text-amber-300 transition-colors">
                  Hyderabadi Dum Biryani
                </Link>
              </li>
              <li>
                <Link to="/menu?category=South Indian" className="hover:text-amber-300 transition-colors">
                  Crispy Masala Dosa & Sambhar
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Breads" className="hover:text-amber-300 transition-colors">
                  Garlic Naan & Tandoori Roti
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Desserts" className="hover:text-amber-300 transition-colors">
                  Gulab Jamun & Rasmalai
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-white tracking-wider uppercase font-medium">
              Hours & Contact
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{contact.email}</span>
              </div>
              <div className="pt-2 border-t border-stone-800/60 text-stone-400 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-300 font-medium">Delivery Hours:</span>
                  <span>{contact.hours?.delivery || '12:00 PM – 11:30 PM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-300 font-medium">Lunch Service:</span>
                  <span>{contact.hours?.lunch || '12:00 PM – 3:30 PM'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Guarantees */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} The Indian Rasoi. All rights reserved.</span>
            <span>·</span>
            <span>Authentic Indian Gastronomy & Royal Kitchens</span>
            <span>·</span>
            <span className="text-amber-500/70">Insulated thermal & spill-proof packaging</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Secure 256-bit SSL (UPI, Debit/Credit Cards, Net Banking, COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
