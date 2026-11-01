// ============================================================================
// THE INDIAN RASOI — Customer Order & Live Tracking Context
// Manages real orders fetched dynamically from Express/MongoDB via orderService.
// Zero hardcoded sample orders or mock data arrays.
// ============================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState(() => {
    try {
      const sessionOrders = localStorage.getItem('indian_rasoi_session_orders');
      return sessionOrders ? JSON.parse(sessionOrders) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load orders for authenticated user or retrieve session orders
  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      try {
        const sessionOrders = localStorage.getItem('indian_rasoi_session_orders');
        setOrders(sessionOrders ? JSON.parse(sessionOrders) : []);
      } catch {
        setOrders([]);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getMyOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Notice loading order history:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      return () => {
        active = false;
      };
    }

    orderService
      .getMyOrders()
      .then((data) => {
        if (active && Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch((err) => {
        console.warn('Notice loading order history:', err.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, user]);

  // Place order via API
  const placeOrder = async (orderPayload) => {
    setIsLoading(true);
    try {
      const response = await orderService.createOrder(orderPayload);
      const newOrder = response.data || response;

      // Update state with newly created order
      setOrders((prev) => [newOrder, ...prev]);

      // Cache order number in session storage for guest tracking
      try {
        const stored = localStorage.getItem('indian_rasoi_session_orders');
        const sessionList = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          'indian_rasoi_session_orders',
          JSON.stringify([newOrder, ...sessionList.filter((o) => (o._id || o.id) !== (newOrder._id || newOrder.id))])
        );
      } catch {
        // Ignore storage error
      }

      showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
      return newOrder;
    } catch (err) {
      // Re-throw so the checkout view handles and displays a single, context-aware notification
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel order via API
  const cancelOrder = async (orderId) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      const cancelledOrder = response.data || response;

      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId || ord.orderNumber === orderId
            ? { ...ord, orderStatus: 'Cancelled', status: 'Cancelled' }
            : ord
        )
      );

      showToast(`Order #${cancelledOrder.orderNumber || orderId} has been cancelled.`, 'info');
      return cancelledOrder;
    } catch (err) {
      showToast(err.message || 'Failed to cancel order.', 'error');
      throw err;
    }
  };

  // Find order by ID or orderNumber
  const getOrder = (identifier) => {
    return orders.find(
      (o) => o._id === identifier || o.orderNumber === identifier || o.id === identifier
    ) || null;
  };

  const fetchOrderById = async (identifier) => {
    try {
      const data = await orderService.getOrderById(identifier);
      if (data) {
        setOrders((prev) => {
          const exists = prev.some((o) => (o._id || o.id) === (data._id || data.id));
          return exists ? prev.map((o) => (o._id || o.id) === (data._id || data.id) ? data : o) : [data, ...prev];
        });
      }
      return data;
    } catch (err) {
      console.warn('Error fetching order by ID:', err);
      return null;
    }
  };

  const updateOrderStatus = async (identifier, status) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord._id === identifier || ord.orderNumber === identifier || ord.id === identifier
          ? { ...ord, orderStatus: status, status }
          : ord
      )
    );
  };

  const activeOrders = orders.filter(
    (o) => (o.orderStatus || o.status) !== 'Delivered' && (o.orderStatus || o.status) !== 'Cancelled'
  );

  const pastOrders = orders.filter(
    (o) => (o.orderStatus || o.status) === 'Delivered' || (o.orderStatus || o.status) === 'Cancelled'
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrders,
        pastOrders,
        isLoading,
        error,
        placeOrder,
        createOrder: placeOrder,
        cancelOrder,
        getOrder,
        getOrderById: getOrder,
        fetchOrderById,
        updateOrderStatus,
        refreshOrders
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

export default OrderContext;
