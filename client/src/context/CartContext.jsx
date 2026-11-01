// ============================================================================
// THE INDIAN RASOI — Shopping Cart Context
// Shared basket state with input sanitization, anti-manipulation guards,
// free delivery threshold progress, and persistence in INR (₹).
// ============================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const FREE_DELIVERY_THRESHOLD = 499.00;
const STANDARD_DELIVERY_FEE = 40.00;
const THERMAL_PACKAGING_FEE = 20.00;

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('indian_rasoi_cart') || localStorage.getItem('casa_topaz_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Sanitize any corrupted quantities
          return parsed.map((item) => ({
            ...item,
            quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [fixedDiscount, setFixedDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Quick view / detail modal state
  const [activeModalDish, setActiveModalDish] = useState(null);

  useEffect(() => {
    localStorage.setItem('indian_rasoi_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (food, quantity = 1, specialInstructions = '') => {
    if (!food) return;

    // Strict positive integer quantity validation
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
    const foodId = food._id || food.id;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.food._id || item.food.id) === foodId
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const updatedQty = next[existingIndex].quantity + safeQty;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: updatedQty,
          specialInstructions: specialInstructions || next[existingIndex].specialInstructions
        };
        return next;
      }
      return [...prev, { food, quantity: safeQty, specialInstructions }];
    });

    showToast(`Added ${safeQty}× ${food.name} to your selection.`, 'success');
  };

  const updateQuantity = (foodId, delta) => {
    const safeDelta = Number(delta);
    setItems((prev) => {
      return prev
        .map((item) => {
          const currentId = item.food._id || item.food.id;
          if (currentId === foodId) {
            const nextQty = item.quantity + safeDelta;
            // Prevent non-positive quantities
            return nextQty > 0 ? { ...item, quantity: Math.floor(nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (foodId) => {
    const item = items.find((i) => (i.food._id || i.food.id) === foodId);
    setItems((prev) => prev.filter((i) => (i.food._id || i.food.id) !== foodId));
    if (item) {
      showToast(`Removed ${item.food.name} from your selection.`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setDiscountPercent(0);
    setFixedDiscount(0);
    localStorage.removeItem('indian_rasoi_cart');
    localStorage.removeItem('casa_topaz_cart');
  };

  // Prepares safe checkout payload containing only product IDs and sanitized quantities
  const getCheckoutItems = () => {
    return items.map((item) => ({
      food: item.food._id || item.food.id,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      specialInstructions: item.specialInstructions || ''
    }));
  };

  const applyPromo = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'RASOI10' || cleanCode === 'TOPAZ10') {
      setDiscountPercent(10);
      setFixedDiscount(0);
      setAppliedPromo({ code: cleanCode, label: '10% Royal Dining Privilege' });
      showToast('Privilege code RASOI10 applied: 10% off your entire order!', 'success');
      return true;
    } else if (cleanCode === 'DESI15' || cleanCode === 'BELLOTA15') {
      setDiscountPercent(15);
      setFixedDiscount(0);
      setAppliedPromo({ code: cleanCode, label: '15% Desi Feast Privilege' });
      showToast('Privilege code DESI15 applied: 15% off!', 'success');
      return true;
    } else if (cleanCode === 'BHOJAN50' || cleanCode === 'TERROIR5') {
      setDiscountPercent(0);
      setFixedDiscount(50);
      setAppliedPromo({ code: cleanCode, label: '₹50 Shahi Courtesy' });
      showToast('Privilege code BHOJAN50 applied: ₹50.00 off!', 'success');
      return true;
    } else {
      showToast('Invalid privilege code. Try RASOI10, DESI15 or BHOJAN50', 'error');
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setDiscountPercent(0);
    setFixedDiscount(0);
    setPromoCode('');
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + (Number(item.food.price) || 0) * item.quantity,
    0
  );

  const percentDiscountAmount = (subtotal * discountPercent) / 100;
  const totalDiscount = Math.min(subtotal, percentDiscountAmount + fixedDiscount);

  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const packagingFee = subtotal > 0 ? THERMAL_PACKAGING_FEE : 0;
  const total = Math.max(0, subtotal - totalDiscount + deliveryFee + packagingFee);

  const amountUntilFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        totalDiscount,
        deliveryFee,
        packagingFee,
        total,
        FREE_DELIVERY_THRESHOLD,
        amountUntilFreeDelivery,
        freeDeliveryProgress,
        appliedPromo,
        promoCode,
        setPromoCode,
        applyPromo,
        removePromo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCheckoutItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        activeModalDish,
        openFoodModal: (dish) => setActiveModalDish(dish),
        closeFoodModal: () => setActiveModalDish(null)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
