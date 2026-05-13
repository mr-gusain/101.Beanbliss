const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const productsAPI = {
  getAll: (params) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiCall(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiCall(`/products/${id}`),
  create: (data) =>
    apiCall('/products', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }),
};


export const authAPI = {
  register: (data) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => apiCall('/auth/me'),
};


export const cartAPI = {
  get: () => apiCall('/cart'),
  addItem: (productId, quantity = 1) =>
    apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateItem: (itemId, quantity) =>
    apiCall(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (itemId) =>
    apiCall(`/cart/${itemId}`, {
      method: 'DELETE',
    }),
  clear: () =>
    apiCall('/cart', {
      method: 'DELETE',
    }),
};


export const ordersAPI = {
  create: (orderData) =>
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getAll: () => apiCall('/orders'),
  getAllAdmin: () => apiCall('/orders/admin/all'),
  getById: (id) => apiCall(`/orders/${id}`),
  deleteAdmin: (id) =>
    apiCall(`/orders/admin/${id}`, {
      method: 'DELETE',
    }),
};


export const usersAPI = {
  getProfile: () => apiCall('/users/profile'),
  getAll: () => apiCall('/users'),
  adminDelete: (id) =>
    apiCall(`/users/admin/${id}`, {
      method: 'DELETE',
    }),
  updateProfile: (data) =>
    apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  addAddress: (address) =>
    apiCall('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  updateAddress: (id, address) =>
    apiCall(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),
  deleteAddress: (id) =>
    apiCall(`/users/addresses/${id}`, {
      method: 'DELETE',
    }),
  addPaymentMethod: (data) =>
    apiCall('/users/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deletePaymentMethod: (id) =>
    apiCall(`/users/payment-methods/${id}`, {
      method: 'DELETE',
    }),
  markNotificationRead: (id) =>
    apiCall(`/users/notifications/${id}/read`, {
      method: 'PUT',
    }),
  markAllNotificationsRead: () =>
    apiCall('/users/notifications/read-all', {
      method: 'PUT',
    }),
  deleteNotification: (id) =>
    apiCall(`/users/notifications/${id}`, {
      method: 'DELETE',
    }),
  clearNotifications: () =>
    apiCall('/users/notifications', {
      method: 'DELETE',
    }),
};


export const paymentAPI = {
  createPaymentIntent: (shippingMethod) =>
    apiCall('/payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ shippingMethod })
    })
};

export const aiAPI = {
  chat: (messages) =>
    apiCall('/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    }),
};

