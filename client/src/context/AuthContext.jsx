// ============================================================================
// THE INDIAN RASOI — Authentication Context
// Integrates with Express /api/auth endpoints for login and registration.
// Stores JWT in localStorage and handles session persistence.
// ============================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  _id: 'usr_rasoi_priya',
  name: 'Priya Sharma',
  email: 'priya.sharma@indianrasoi.com',
  phone: '+91 98765 43210',
  role: 'customer',
  memberTier: 'The Indian Rasoi Shahi Club',
  addresses: [
    {
      _id: 'addr-1',
      label: 'Home Residency',
      street: 'Flat 402, Royal Palms Apartments',
      building: 'Tower B, Connaught Place',
      city: 'New Delhi',
      postalCode: '110001',
      country: 'India',
      isDefault: true,
      deliveryNotes: 'Ring bell 402 or leave with security at main gate.'
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('indian_rasoi_user') || localStorage.getItem('casa_topaz_user');
      return stored ? JSON.parse(stored) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('indian_rasoi_token') || localStorage.getItem('casa_topaz_token') || 'demo_jwt_token_aura');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('indian_rasoi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('indian_rasoi_user');
      localStorage.removeItem('casa_topaz_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('indian_rasoi_token', token);
    } else {
      localStorage.removeItem('indian_rasoi_token');
      localStorage.removeItem('casa_topaz_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      const authenticatedUser = data.user || data.data;
      const authToken = data.token || data.data?.token;

      setUser(authenticatedUser);
      if (authToken) {
        setToken(authToken);
      }
      showToast(`Welcome to The Indian Rasoi, ${authenticatedUser.name}!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Sign in failed. Please verify your credentials.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      // Try backend authentication with demo account
      const data = await authService.login('priya.sharma@indianrasoi.com', 'Customer2026!').catch(() =>
        authService.login('elena.rostova@gastronomie.ch', 'Customer2026!')
      );
      const authenticatedUser = data.user || data.data;
      setUser(authenticatedUser);
      setToken(data.token || data.data?.token);
      showToast(`Signed in as member ${authenticatedUser.name} (Shahi Club)`, 'success');
      return true;
    } catch {
      // Fallback demo session
      setUser(DEFAULT_DEMO_USER);
      setToken('demo_jwt_token_aura');
      showToast('Signed in as privilege guest (Priya Sharma)', 'success');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      const registeredUser = data.user || data.data;
      const authToken = data.token || data.data?.token;

      setUser(registeredUser);
      if (authToken) {
        setToken(authToken);
      }
      showToast(`Account created successfully! Welcome to The Indian Rasoi, ${registeredUser.name}.`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to create account.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('indian_rasoi_user');
    localStorage.removeItem('indian_rasoi_token');
    localStorage.removeItem('casa_topaz_user');
    localStorage.removeItem('casa_topaz_token');
    showToast('You have been signed out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemo,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
