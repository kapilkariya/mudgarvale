// API Configuration
// Change this to your backend URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls with auth token
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Merge options carefully to handle FormData (which shouldn't have Content-Type set)
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Remove Content-Type if body is FormData (browser will set it with boundary)
  if (options.body instanceof FormData) {
    delete mergedOptions.headers['Content-Type'];
  }

  const response = await fetch(url, mergedOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  sendSignupOTP: (data) => fetchWithAuth(`${API_URL}/auth/send-signup-otp`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  verifySignup: (data) => fetchWithAuth(`${API_URL}/auth/verify-signup`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  sendLoginOTP: (data) => fetchWithAuth(`${API_URL}/auth/send-login-otp`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  verifyLogin: (data) => fetchWithAuth(`${API_URL}/auth/verify-login`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getMe: () => fetchWithAuth(`${API_URL}/auth/me`),
  
  logout: () => fetchWithAuth(`${API_URL}/auth/logout`, { method: 'POST' }),
};

// Products API calls
export const productAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`${API_URL}/products?${queryString}`);
  },
  
  getByCategory: (category) => fetchWithAuth(`${API_URL}/products/category/${category}`),
  
  getById: (id) => fetchWithAuth(`${API_URL}/products/${id}`),
  
  create: (formData) => fetchWithAuth(`${API_URL}/products`, {
    method: 'POST',
    body: formData,
  }),
  
  update: (id, formData) => fetchWithAuth(`${API_URL}/products/${id}`, {
    method: 'PUT',
    body: formData,
  }),
  
  delete: (id) => fetchWithAuth(`${API_URL}/products/${id}`, { method: 'DELETE' }),
};

// Orders API calls
export const orderAPI = {
  create: (data) => fetchWithAuth(`${API_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  verifyPayment: (data) => fetchWithAuth(`${API_URL}/orders/verify-payment`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  cancelPending: (data) => fetchWithAuth(`${API_URL}/orders/cancel-pending`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMyOrders: () => fetchWithAuth(`${API_URL}/orders/my-orders`),

  getOrderById: (id) => fetchWithAuth(`${API_URL}/orders/${id}`),
};

// Address API calls
export const addressAPI = {
  getAll: () => fetchWithAuth(`${API_URL}/addresses`),

  add: (data) => fetchWithAuth(`${API_URL}/addresses`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchWithAuth(`${API_URL}/addresses/${id}`, { method: 'DELETE' }),

  setDefault: (id) => fetchWithAuth(`${API_URL}/addresses/${id}/default`, { method: 'PUT' }),
};

// Cart API calls (persistent cart)
export const cartAPI = {
  get: () => fetchWithAuth(`${API_URL}/cart`),

  add: (data) => fetchWithAuth(`${API_URL}/cart`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateQuantity: (itemId, quantity) => fetchWithAuth(`${API_URL}/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  remove: (itemId) => fetchWithAuth(`${API_URL}/cart/${itemId}`, { method: 'DELETE' }),

  clear: () => fetchWithAuth(`${API_URL}/cart`, { method: 'DELETE' }),

  sync: (items) => fetchWithAuth(`${API_URL}/cart/sync`, {
    method: 'POST',
    body: JSON.stringify({ items }),
  }),
};

// Config API calls
export const configAPI = {
  get: () => fetchWithAuth(`${API_URL}/config`),
};

// Admin API calls
export const adminAPI = {
  // Products
  getAllProducts: () => fetchWithAuth(`${API_URL}/admin/products`),
  updateProduct: (id, data) => fetchWithAuth(`${API_URL}/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id) => fetchWithAuth(`${API_URL}/admin/products/${id}`, { method: 'DELETE' }),
  
  // Orders - Original (fetches all orders)
  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`${API_URL}/admin/orders${queryString ? `?${queryString}` : ''}`);
  },
  
  // NEW - Paginated orders (for admin orders page - fetches 20 at a time)
  getOrdersPaginated: (page = 1, limit = 20) => {
    return fetchWithAuth(`${API_URL}/admin/orders/paginated?page=${page}&limit=${limit}`);
  },
  
  // Date range filter
  getOrdersByDateRange: (from, to) => {
    return fetchWithAuth(`${API_URL}/admin/orders/date-range?from=${from}&to=${to}`);
  },
  
  // Order management
  updateOrder: (id, data) => fetchWithAuth(`${API_URL}/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getOrderStats: () => fetchWithAuth(`${API_URL}/admin/orders/stats`),
  updateOrderStatus: (id, status) => fetchWithAuth(`${API_URL}/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ orderStatus: status }),
  }),
};
