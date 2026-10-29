// ============================================================================
// CASA TÒPAZ — Axios API Client
// Reusable API client powered by VITE_API_URL.
// Communicates with Express/MongoDB backend with JWT authorization
// and centralized error propagation.
// ============================================================================

import axios from 'axios';

// Resolve base URL from VITE_API_URL or fallback to relative /api
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBaseUrl
  ? `${rawBaseUrl.replace(/\/+$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('casa_topaz_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Foods Service
export const foodService = {
  async getAllFoods(params = {}) {
    const queryParams = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.category && params.category !== 'All') queryParams.category = params.category;
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params.vegetarian) queryParams.vegetarian = 'true';
    if (params.sort) queryParams.sort = params.sort;
    if (params.dietary) queryParams.dietary = params.dietary;

    const response = await api.get('/foods', { params: queryParams });
    return response.data;
  },

  async getFeaturedFoods() {
    const response = await api.get('/foods/featured');
    return response.data.data || response.data;
  },

  async getFoodById(id) {
    const response = await api.get(`/foods/${id}`);
    return response.data.data || response.data;
  },

  async getCategories() {
    const response = await api.get('/foods/categories');
    return response.data.data || response.data;
  }
};

// Auth Service
export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data.data || response.data;
  }
};

// Orders Service
export const orderService = {
  // Payload sends product IDs and quantities, deliveryAddress, contact, paymentMethod
  async createOrder(orderPayload) {
    const response = await api.post('/orders', orderPayload);
    return response.data;
  },

  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data.data || response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data.data || response.data;
  },

  async cancelOrder(id) {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};

export default api;
