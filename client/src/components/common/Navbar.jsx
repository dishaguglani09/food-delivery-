// ============================================================================
// The Indian Rasoi — Responsive Navigation Bar
// Logo, navigation, live search trigger, account status dropdown,
// and shopping cart drawer trigger with animated count.
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  LogOut, 
  Package
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function Navbar({ onOpenSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { restaurant } = useRestaurant();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Monitor scroll for header background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu & Dishes', path: '/menu' },
    { label: 'Our Story', path: '/#story' },
    { label: 'The Experience', path: '/#why-us' },
    { label: 'Reviews', path: '/#testimonials' },
    { label: 'Contact', path: '/#contact' },
  ];

  const handleNavClick = (path) => {
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/' + path.substring(1));
      } else {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'glass-nav py-3 shadow-2xl border-b border-amber-500/10'
            : 'bg-[#0d0c0c]/90 backdrop-blur-md py-4 sm:py-5 border-b border-stone-800/60'
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-600/30 via-[#2a1719] to-amber-950/40 border border-amber-500/30 flex items-center justify-center shadow-lg group-hover:border-amber-400/60 transition-all">
              {/* Monogram Icon */}
              <span className="font-serif text-amber-300 text-base sm:text-lg font-semibold">
                {restaurant?.monogram || 'IR'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#fbf9f5] group-hover:text-amber-200 transition-colors">
                {restaurant?.name || 'The Indian Rasoi'}
              </span>
              <span className="text-[10px] text-amber-400/80 font-normal">
                {restaurant?.tagline || 'Authentic Indian Flavors & Royal Biryanis'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-sm tracking-normal transition-all duration-200 relative py-1 focus:outline-none cursor-pointer ${
                    isActive
                      ? 'text-amber-300 font-medium'
                      : 'text-stone-300 hover:text-white font-normal'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Search, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-800/80 border border-transparent hover:border-amber-500/20 transition-all focus:outline-none"
              title="Search dishes (Ctrl+K)"
              aria-label="Search dishes and biryanis"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* User Account / Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated && user?.email ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-full bg-stone-900/90 hover:bg-stone-850 border border-amber-500/20 hover:border-amber-500/40 transition-all text-xs text-stone-200 focus:outline-none cursor-pointer group"
                    title={user.email}
                    aria-label={`User account: ${user.email}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-900/50 text-amber-300 border border-amber-500/40 flex items-center justify-center font-serif font-bold text-xs uppercase shrink-0">
                      {user.email.charAt(0)}
                    </div>
                    <span className="font-medium text-stone-300 group-hover:text-amber-200 transition-colors max-w-[110px] sm:max-w-[160px] md:max-w-[210px] truncate lowercase">
                      {user.email}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#161514] border border-amber-500/20 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-stone-800">
                        <p className="text-[11px] text-stone-400 font-normal">
                          Signed in as
                        </p>
                        <p
                          className="text-xs sm:text-sm font-medium text-white truncate lowercase mt-0.5"
                          title={user.email}
                        >
                          {user.email}
                        </p>
                        {user.name && (
                          <p className="text-xs text-stone-400 truncate mt-0.5">
                            {user.name}
                          </p>
                        )}
                        <p className="text-[11px] text-amber-400 font-serif mt-1">
                          {user.role === 'admin'
                            ? 'Master Chef / Administrator'
                            : (user.memberTier || 'Rasoi Privilege Member')}
                        </p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-300 hover:text-white hover:bg-stone-800/60 transition-colors"
                      >
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>My Orders & Receipts</span>
                      </Link>
                      <div className="border-t border-stone-800 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-500/30 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-4 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-xs sm:text-sm shadow-lg shadow-amber-950/40 border border-amber-400/30 hover:border-amber-300 transition-all cursor-pointer focus:outline-none"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-100" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-stone-900 font-bold text-xs shadow">
                  {itemCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs text-amber-200/80">0</span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-850 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#121110] border-b border-amber-900/30 px-6 py-6 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className="text-left text-base font-serif tracking-wide py-2 text-stone-200 hover:text-amber-300 border-b border-stone-800/60 transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  to="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors shadow-md"
                >
                  Order Online
                </Link>

                {isAuthenticated && user?.email ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                      <span className="text-[10px] text-stone-500 uppercase block font-mono">
                        Signed in as
                      </span>
                      <span className="font-medium text-amber-300 truncate block lowercase" title={user.email}>
                        {user.email}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-center py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs hover:bg-stone-700 transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-rose-950/40 text-rose-300 text-xs border border-rose-800/40"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-stone-900 text-stone-300 text-xs hover:bg-stone-800 border border-stone-800"
                  >
                    Sign In / Create Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
