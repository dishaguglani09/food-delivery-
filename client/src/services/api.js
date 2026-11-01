// ============================================================================
// The Indian Rasoi — Native Fetch API Client
// Standard Fetch-based API client powered by VITE_API_URL.
// Communicates with Express/MongoDB backend with JWT authorization
// and centralized error propagation using standard browser JavaScript.
// ============================================================================

// Resolve base URL from VITE_API_URL or fallback to relative /api
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBaseUrl
  ? `${rawBaseUrl.replace(/\/+$/, '')}/api`
  : '/api';

/**
 * Core HTTP request handler using standard native fetch
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('indian_rasoi_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  let url = `${API_BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (typeof data === 'string' && data ? data : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return { data };
}

const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
};

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
