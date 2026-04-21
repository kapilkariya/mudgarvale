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

  getMyOrders: () => fetchWithAuth(`${API_URL}/orders/my-orders`),

  getOrderById: (id) => fetchWithAuth(`${API_URL}/orders/${id}`),
};

// Config API calls
export const configAPI = {
  get: () => fetchWithAuth(`${API_URL}/config`),
};
