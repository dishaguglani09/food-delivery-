// ============================================================================
// The Indian Rasoi — Restaurant Context
// Provides dynamic database-driven restaurant information, branding,
// culinary story, contact coordinates, hours, why-us philosophy, and testimonials.
// ============================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { restaurantService } from '../services/api';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getRestaurantInfo();
      if (data) {
        setRestaurant(data);
      }
    } catch (err) {
      console.error('Failed to load restaurant profile from MongoDB Atlas:', err);
      setError(err.message || 'Unable to load restaurant details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    restaurantService
      .getRestaurantInfo()
      .then((data) => {
        if (active && data) setRestaurant(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load restaurant details');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        loading,
        error,
        refreshRestaurant: fetchRestaurant
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export default RestaurantContext;
