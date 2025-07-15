import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add interceptor to include JWT token in Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const strapiApi = {
  getProducts: () => api.get('/products?populate=*'),
  getProduct: (id) => api.get(`/products/${id}?populate=*`),
  getProductBySlug: (slug) => api.get(`/products?filters[slug][$eq]=${slug}&populate=*`),
  getProductByDocumentId: (documentId) => api.get(`/products?filters[documentId][$eq]=${documentId}&populate=*`),
  getProductByDocumentIdDirect: (documentId) => api.get(`/products/${documentId}`),
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  uploadFiles: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  login: (identifier, password) => api.post('/auth/local', { identifier, password }),
  register: (username, email, password) => api.post('/auth/local/register', { username, email, password }),
  loginWithGoogle: (params) => api.get('/connect/google', { params }),
};

export default api; 