import axios from 'axios';
import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Instance axios avec le token JWT automatique
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ────────────────────────────────────────────────
export async function loginApi(username, password) {
  const res = await api.post('/api/auth/login', { username, password });
  return res.data; // { token, role, username, userId }
}

export async function registerApi(data) {
  const res = await api.post('/api/auth/register', data);
  return res.data;
}

// ─── PRODUITS ────────────────────────────────────────────
export async function getProducts() {
  const res = await api.get('/api/products');
  return res.data;
}

export async function getProduct(id) {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
}

export async function getProductsByCategory(categoryId) {
  const res = await api.get(`/api/products/category/${categoryId}`);
  return res.data;
}

// ─── CATEGORIES ──────────────────────────────────────────
export async function getCategories() {
  const res = await api.get('/api/categories');
  return res.data;
}

// ─── COMMANDES ───────────────────────────────────────────
export async function createOrder(orderData) {
  const res = await api.post('/api/orders', orderData);
  return res.data; // { orderId, newRole }
}

export async function getMyOrders() {
  const res = await api.get('/api/orders/my');
  return res.data;
}