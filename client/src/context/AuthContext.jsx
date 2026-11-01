// ============================================================================
// THE INDIAN RASOI — Authentication Context
// Pure database-driven JWT authentication integrating with Express /api/auth.
// Stores JWT in localStorage and validates session against MongoDB on mount.
// Zero hardcoded demo users or mock tokens.
// ============================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('indian_rasoi_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('indian_rasoi_token') || null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('indian_rasoi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('indian_rasoi_user');
    }
  }, [user]);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('indian_rasoi_token', token);
    } else {
      localStorage.removeItem('indian_rasoi_token');
    }
  }, [token]);

  // Verify and fetch fresh user profile directly from MongoDB Atlas when authenticated
  useEffect(() => {
    let active = true;
    if (!token) {
      return () => {
        active = false;
      };
    }

    authService
      .getProfile()
      .then((data) => {
        if (active && data) {
          const profile = data.data || data.user || data;
          setUser(profile);
        }
      })
      .catch((err) => {
        console.warn('Profile synchronization notice:', err.message);
        const errMsg = err.message ? err.message.toLowerCase() : '';
        if (errMsg.includes('authorized') || errMsg.includes('token') || errMsg.includes('jwt')) {
          if (active) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('indian_rasoi_user');
            localStorage.removeItem('indian_rasoi_token');
          }
        }
      });

    return () => {
      active = false;
    };
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
      showToast(`Welcome back, ${authenticatedUser.email}!`, 'success');
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
      // Connects to real seeded account in MongoDB Atlas
      const data = await authService.login('priya.sharma@indianrasoi.com', 'Priya2026!');
      const authenticatedUser = data.user || data.data;
      const authToken = data.token || data.data?.token;

      setUser(authenticatedUser);
      if (authToken) {
        setToken(authToken);
      }
      showToast(`Signed in as ${authenticatedUser.email}`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Unable to connect to demo account.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userDataOrName, email, password, phone) => {
    setIsLoading(true);
    try {
      const payload =
        typeof userDataOrName === 'object' && userDataOrName !== null
          ? userDataOrName
          : { name: userDataOrName, email, password, phone };

      const data = await authService.register(payload);
      const newUser = data.user || data.data;
      const authToken = data.token || data.data?.token;

      setUser(newUser);
      if (authToken) {
        setToken(authToken);
      }
      showToast(`Welcome to Rasoi Club, ${newUser.email}!`, 'success');
      return true;
    } catch (err) {
      const rawMsg = err.message || '';
      let displayMsg = rawMsg;
      if (
        rawMsg.includes('buffering timed out') ||
        rawMsg.includes('timed out after') ||
        rawMsg.includes('ECONNREFUSED') ||
        rawMsg.includes('failed to fetch') ||
        rawMsg.includes('DATABASE_UNAVAILABLE')
      ) {
        displayMsg = 'Unable to connect to the server. Please try again later.';
      }
      showToast(displayMsg || 'Registration failed. Please check your information.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('indian_rasoi_user');
    localStorage.removeItem('indian_rasoi_token');
    showToast('You have been signed out successfully.', 'info');
  };

  const addAddress = async (newAddress) => {
    try {
      const updatedAddresses = await authService.addAddress(newAddress);
      setUser((prev) => (prev ? { ...prev, addresses: updatedAddresses } : null));
      showToast('Delivery address saved successfully.', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to save address.', 'error');
      return false;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const updatedAddresses = await authService.deleteAddress(addressId);
      setUser((prev) => (prev ? { ...prev, addresses: updatedAddresses } : null));
      showToast('Delivery address removed.', 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to remove address.', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        loginDemo,
        register,
        logout,
        addAddress,
        deleteAddress
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

export default AuthContext;
