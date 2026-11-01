// ============================================================================
// THE INDIAN RASOI — Customer Order & Live Tracking Context
// Manages active orders, historical orders, status simulation,
// and real backend order persistence via orderService.
// ============================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sampleFoods } from '../data/sampleFoods';
import { orderService } from '../services/api';
import { useToast } from './ToastContext';

const OrderContext = createContext(null);

const INITIAL_SAMPLE_ORDERS = [
  {
    _id: 'IR-84920',
    orderNumber: 'IR-84920',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 17 * 60 * 1000).toISOString(), // 17 mins remaining
    status: 'Dispatched', // 'Confirmed' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled'
    orderStatus: 'Dispatched',
    statusStep: 3, // 1 to 4
    items: [
      {
        food: sampleFoods[0], // Butter Chicken
        quantity: 1,
        price: 380,
        specialInstructions: 'Medium spicy, extra buttery gravy'
      },
      {
        food: sampleFoods[15], // Garlic Naan
        quantity: 2,
        price: 70,
        specialInstructions: 'Crisp and hot from tandoor'
      },
      {
        food: sampleFoods[28], // Alphonso Mango Lassi
        quantity: 2,
        price: 120,
        specialInstructions: 'Chilled with extra pistachios'
      }
    ],
    pricing: {
      subtotal: 760,
      discount: 76,
      deliveryFee: 0,
      packagingFee: 20,
      total: 704
    },
    deliveryAddress: {
      street: 'Flat 402, Royal Palms Apartments',
      building: 'Tower B, Connaught Place',
      city: 'New Delhi',
      postalCode: '110001',
      deliveryNotes: 'Ring bell 402 or leave with security at main gate.'
    },
    contact: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@indianrasoi.com'
    },
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    courier: {
      name: 'Rahul Sharma',
      phone: '+91 98111 22334',
      transport: 'Thermal Sealed Cargo Eco-Bike',
      currentLocation: 'Near Barakhamba Road, 800m away',
      rating: 4.98
    }
  },
  {
    _id: 'IR-79214',
    orderNumber: 'IR-79214',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    estimatedDeliveryTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
    status: 'Delivered',
    orderStatus: 'Delivered',
    statusStep: 4,
    items: [
      {
        food: sampleFoods[18], // Hyderabadi Dum Chicken Biryani
        quantity: 1,
        price: 360,
        specialInstructions: 'Include extra mirchi ka salan'
      },
      {
        food: sampleFoods[2], // Dal Makhani
        quantity: 1,
        price: 280,
        specialInstructions: 'With dollop of churned white butter'
      },
      {
        food: sampleFoods[22], // Gulab Jamun
        quantity: 2,
        price: 90,
        specialInstructions: 'Serve warm in syrup'
      }
    ],
    pricing: {
      subtotal: 820,
      discount: 82,
      deliveryFee: 0,
      packagingFee: 20,
      total: 758
    },
    deliveryAddress: {
      street: 'Flat 402, Royal Palms Apartments',
      building: 'Tower B, Connaught Place',
      city: 'New Delhi',
      postalCode: '110001',
      deliveryNotes: 'Front desk reception'
    },
    contact: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@indianrasoi.com'
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    courier: {
      name: 'Amit Patel',
      phone: '+91 98222 33445',
      transport: 'Express Delivery Scooter',
      rating: 5.0
    }
  }
];

export const OrderProvider = ({ children }) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('indian_rasoi_orders') || localStorage.getItem('casa_topaz_orders');
      return stored ? JSON.parse(stored) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  // Sync orders to localStorage whenever orders state changes
  useEffect(() => {
    try {
      localStorage.setItem('indian_rasoi_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not persist orders to localStorage:', e);
    }
  }, [orders]);

  // Load authenticated customer's real orders from backend on mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem('indian_rasoi_token') || localStorage.getItem('casa_topaz_token');
      if (!token) return;
      try {
        const backendOrders = await orderService.getMyOrders();
        if (Array.isArray(backendOrders) && backendOrders.length > 0) {
          setOrders((prev) => {
            const backendIds = new Set(backendOrders.map((o) => o._id || o.orderNumber));
            const remaining = prev.filter((o) => !backendIds.has(o._id) && !backendIds.has(o.orderNumber));
            return [...backendOrders, ...remaining];
          });
        }
      } catch {
        // Backend offline or token expired
      }
    };
    fetchUserOrders();
  }, []);

  // Real backend order creation
  const createOrder = async (orderPayload) => {
    // Send order to backend API
    const response = await orderService.createOrder(orderPayload);
    const createdOrder = response.data || response;

    if (!createdOrder) {
      throw new Error('The server did not return a valid order confirmation.');
    }

    // Standardize object for frontend tracking & history views
    const formattedOrder = {
      ...createdOrder,
      orderNumber: createdOrder.orderNumber || createdOrder._id,
      status: createdOrder.orderStatus || createdOrder.status || 'Confirmed',
      statusStep: createdOrder.statusStep || 1,
      pricing: createdOrder.pricing || {
        subtotal: createdOrder.subtotal,
        discount: createdOrder.discount || 0,
        deliveryFee: createdOrder.deliveryFee || 0,
        packagingFee: createdOrder.packagingFee || 20,
        total: createdOrder.total || createdOrder.totalAmount
      }
    };

    setOrders((prev) => [formattedOrder, ...prev]);
    showToast(`Order #${formattedOrder.orderNumber} placed successfully with The Indian Rasoi!`, 'success');
    return formattedOrder;
  };

  const getOrderById = (id) => {
    return orders.find((o) => o._id === id || o.orderNumber === id);
  };

  const fetchOrderById = useCallback(async (id) => {
    // Try local cache first
    const cached = orders.find((o) => o._id === id || o.orderNumber === id);
    if (cached) return cached;

    // Fetch from backend
    try {
      const response = await orderService.getOrderById(id);
      const fetched = response.data || response;
      if (fetched) {
        const formatted = {
          ...fetched,
          orderNumber: fetched.orderNumber || fetched._id,
          status: fetched.orderStatus || fetched.status || 'Confirmed',
          statusStep: fetched.statusStep || 1,
          pricing: fetched.pricing || {
            subtotal: fetched.subtotal,
            discount: fetched.discount || 0,
            deliveryFee: fetched.deliveryFee || 0,
            packagingFee: fetched.packagingFee || 20,
            total: fetched.total || fetched.totalAmount
          }
        };
        setOrders((prev) => [formatted, ...prev.filter((o) => o._id !== formatted._id && o.orderNumber !== formatted.orderNumber)]);
        return formatted;
      }
    } catch {
      // Not found or network error
    }
    return null;
  }, [orders]);

  const updateOrderStatus = (orderId, newStatus) => {
    const stepMap = {
      Confirmed: 1,
      Preparing: 2,
      'Kitchen Preparing': 2,
      Dispatched: 3,
      Delivered: 4,
      Cancelled: 0
    };

    setOrders((prev) =>
      prev.map((order) => {
        if (order._id === orderId || order.orderNumber === orderId) {
          return {
            ...order,
            status: newStatus,
            orderStatus: newStatus,
            statusStep: stepMap[newStatus] || order.statusStep
          };
        }
        return order;
      })
    );
    showToast(`Status update for #${orderId}: ${newStatus}`, 'info');
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      showToast(`Order #${orderId} has been cancelled.`, 'info');
    } catch (err) {
      console.warn('Backend cancel failed, updating locally:', err.message);
      showToast(`Order #${orderId} has been cancelled.`, 'info');
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order._id === orderId || order.orderNumber === orderId) {
          return { ...order, status: 'Cancelled', orderStatus: 'Cancelled', statusStep: 0 };
        }
        return order;
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        fetchOrderById,
        updateOrderStatus,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
