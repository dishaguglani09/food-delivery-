// ============================================================================
// CASA TÒPAZ — Main Application Router & Shell
// High performance, code-split routes with luxury aesthetic
// and global context providers.
// ============================================================================

import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import SearchModal from './components/common/SearchModal';
import FoodDetailModal from './components/common/FoodDetailModal';

// Code-Split Lazy Loaded Page Components for optimal chunking and speed
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const FoodDetailPage = lazy(() => import('./pages/FoodDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Contexts
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

// Helper component to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Atmospheric Page Loading Screen
function PageLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0d0c0c] text-stone-200">
      <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-2xl animate-pulse">
        T
      </div>
      <span className="font-serif italic text-amber-400/90 text-sm mt-3 tracking-widest uppercase">
        CASA TÒPAZ
      </span>
    </div>
  );
}

// Inner App with context access for global modals
function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { activeModalDish, closeFoodModal } = useCart();

  // Global hotkey: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0c0c] text-stone-200">
      <ScrollToTop />

      {/* Global Navigation */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/dish/:id" element={<FoodDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/track/:orderId" element={<OrderTrackingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      {activeModalDish && (
        <FoodDetailModal
          food={activeModalDish}
          onClose={closeFoodModal}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
