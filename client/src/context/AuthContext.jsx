// ============================================================================
// CASA TÒPAZ — Authentication Context
// Integrates with Express /api/auth endpoints for login and registration.
// Stores JWT in localStorage and handles session persistence.
// ============================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  _id: 'usr_topaz_elena',
  name: 'Elena Rostova',
  email: 'elena.rostova@gastronomie.ch',
  phone: '+41 79 482 19 88',
  role: 'customer',
  memberTier: 'Club Tòpaz Grand Cru',
  addresses: [
    {
      _id: 'addr-1',
      label: 'Home Penthouse',
      street: 'Rue du Lac 24',
      building: 'Résidence Belle-Vue, Apt 4B',
      city: 'Biel/Bienne',
      postalCode: '2502',
      isDefault: true,
      deliveryNotes: 'Ring bell 4B or leave with concierge Mateo.'
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('casa_topaz_user');
      return stored ? JSON.parse(stored) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('casa_topaz_token') || 'demo_jwt_token_aura');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('casa_topaz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('casa_topaz_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('casa_topaz_token', token);
    } else {
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
      showToast(`Welcome, ${authenticatedUser.name}!`, 'success');
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
      // Try backend authentication with demo account first
      const data = await authService.login('elena.rostova@gastronomie.ch', 'Customer2026!');
      const authenticatedUser = data.user || data.data;
      setUser(authenticatedUser);
      setToken(data.token || data.data?.token);
      showToast('Signed in as member Elena Rostova (Grand Cru Club)', 'success');
      return true;
    } catch {
      // Fallback demo session
      setUser(DEFAULT_DEMO_USER);
      setToken('demo_jwt_token_aura');
      showToast('Signed in as privilege guest (Elena Rostova)', 'success');
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
      showToast(`Account created successfully! Welcome to CASA TÒPAZ, ${registeredUser.name}.`, 'success');
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
