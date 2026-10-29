// ============================================================================
// CASA TÒPAZ — Customer Order & Live Tracking Context
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
    _id: 'CT-84920',
    orderNumber: 'CT-84920',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 17 * 60 * 1000).toISOString(), // 17 mins remaining
    status: 'Dispatched', // 'Confirmed' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled'
    orderStatus: 'Dispatched',
    statusStep: 3, // 1 to 4
    items: [
      {
        food: sampleFoods[0], // Le Suisse Raclette
        quantity: 2,
        price: 13.50,
        specialInstructions: 'Extra crunchy sourdough crust'
      },
      {
        food: sampleFoods[6], // Cazuela de Chorizo Ibérico al Vino Tinto
        quantity: 1,
        price: 22.00,
        specialInstructions: 'Piping hot in terracotta cocotte'
      },
      {
        food: sampleFoods[12], // Sangria de la Casa
        quantity: 1,
        price: 12.50,
        specialInstructions: 'Fresh sliced oranges'
      }
    ],
    pricing: {
      subtotal: 61.50,
      discount: 6.15,
      deliveryFee: 0.00,
      packagingFee: 2.50,
      total: 57.85
    },
    deliveryAddress: {
      street: 'Rue du Lac 24',
      building: 'Résidence Belle-Vue, Apt 4B',
      city: 'Biel/Bienne',
      postalCode: '2502',
      deliveryNotes: 'Ring bell 4B or leave with concierge Mateo.'
    },
    contact: {
      name: 'Elena Rostova',
      phone: '+41 79 482 19 88',
      email: 'elena.rostova@gastronomie.ch'
    },
    paymentMethod: 'twint',
    paymentStatus: 'Paid',
    courier: {
      name: 'Mateo De La Vega',
      phone: '+41 78 440 22 19',
      transport: 'Thermal Sealed Cargo E-Bike (Zero Emission)',
      currentLocation: 'Passing Place Centrale, 600m away',
      rating: 4.98
    }
  },
  {
    _id: 'CT-79214',
    orderNumber: 'CT-79214',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    estimatedDeliveryTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
    status: 'Delivered',
    orderStatus: 'Delivered',
    statusStep: 4,
    items: [
      {
        food: sampleFoods[8], // Planche Découverte Casa Tòpaz
        quantity: 1,
        price: 36.00,
        specialInstructions: 'Include extra pan con tomate'
      },
      {
        food: sampleFoods[10], // Tarta de Queso Vasca Brûlée
        quantity: 2,
        price: 13.50,
        specialInstructions: ''
      },
      {
        food: sampleFoods[14], // Rioja Gran Reserva
        quantity: 1,
        price: 54.00,
        specialInstructions: 'Temperature controlled bottle pack'
      }
    ],
    pricing: {
      subtotal: 117.00,
      discount: 11.70,
      deliveryFee: 0.00,
      packagingFee: 2.50,
      total: 107.80
    },
    deliveryAddress: {
      street: 'Rue du Lac 24',
      building: 'Résidence Belle-Vue, Apt 4B',
      city: 'Biel/Bienne',
      postalCode: '2502',
      deliveryNotes: 'Concierge desk'
    },
    contact: {
      name: 'Elena Rostova',
      phone: '+41 79 482 19 88',
      email: 'elena.rostova@gastronomie.ch'
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    courier: {
      name: 'Lucia Fontana',
      phone: '+41 78 300 11 22',
      transport: 'Boutique Van',
      rating: 5.0
    }
  }
];

export const OrderProvider = ({ children }) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('casa_topaz_orders');
      return stored ? JSON.parse(stored) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  // Sync orders to localStorage whenever orders state changes
  useEffect(() => {
    try {
      localStorage.setItem('casa_topaz_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not persist orders to localStorage:', e);
    }
  }, [orders]);

  // Load authenticated customer's real orders from backend on mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem('casa_topaz_token');
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
        packagingFee: createdOrder.packagingFee || 2.50,
        total: createdOrder.total || createdOrder.totalAmount
      }
    };

    setOrders((prev) => [formattedOrder, ...prev]);
    showToast(`Order #${formattedOrder.orderNumber} confirmed successfully!`, 'success');
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
            packagingFee: fetched.packagingFee || 2.50,
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
