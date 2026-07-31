import axios, { AxiosError, AxiosInstance } from 'axios';
// @ts-ignore - zustand store import
import { useAuthStore } from './store/auth.store';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== INTERCEPTOR: Add token to requests ==========
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== INTERCEPTOR: Handle response errors ==========
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If unauthorized, clear auth and redirect to login
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== API Methods ==========

export const api = {
  // ===== AUTH =====
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      apiClient.post('/api/auth/register', data),
    
    login: (data: { email: string; password: string }) =>
      apiClient.post('/api/auth/login', data),
  },

  // ===== TRANSACTIONS =====
  transactions: {
    getAll: (params?: { page?: number; limit?: number; categoryId?: string }) =>
      apiClient.get('/api/transactions', { params }),
    
    getById: (id: string | number) =>
      apiClient.get(`/api/transactions/${id}`),
    
    create: (data: {
      type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
      amount: number;
      categoryId?: number;
      accountId: number;
      toAccountId?: number;
      date: string;
      description?: string;
    }) =>
      apiClient.post('/api/transactions', data),
    
    update: (id: string | number, data: any) =>
      apiClient.patch(`/api/transactions/${id}`, data),
    
    delete: (id: string | number) =>
      apiClient.delete(`/api/transactions/${id}`),
    
    getStats: (params?: { startDate?: string; endDate?: string }) =>
      apiClient.get('/api/transactions/stats', { params }),
  },

  // ===== ACCOUNTS =====
  accounts: {
    getAll: () =>
      apiClient.get('/api/accounts'),
    
    getById: (id: string | number) =>
      apiClient.get(`/api/accounts/${id}`),
    
    create: (data: {
      name: string;
      type: 'CASH' | 'BANK' | 'CREDIT_CARD' | 'INVESTMENT';
      currency?: string;
      balance?: number;
      description?: string;
    }) =>
      apiClient.post('/api/accounts', data),
    
    update: (id: string | number, data: any) =>
      apiClient.patch(`/api/accounts/${id}`, data),
    
    delete: (id: string | number) =>
      apiClient.delete(`/api/accounts/${id}`),
  },

  // ===== CATEGORIES =====
  categories: {
    getAll: () =>
      apiClient.get('/api/categories'),
    
    create: (data: { name: string; type: string; icon?: string; color?: string }) =>
      apiClient.post('/api/categories', data),
    
    update: (id: string | number, data: any) =>
      apiClient.patch(`/api/categories/${id}`, data),
    
    delete: (id: string | number) =>
      apiClient.delete(`/api/categories/${id}`),
  },

  // ===== BUDGETS =====
  budgets: {
    getAll: () =>
      apiClient.get('/api/budgets'),
    
    getById: (id: string | number) =>
      apiClient.get(`/api/budgets/${id}`),
    
    create: (data: {
      categoryId: number;
      amount: number;
      month: number;
      year: number;
      alertThreshold?: number;
    }) =>
      apiClient.post('/api/budgets', data),
    
    update: (id: string | number, data: any) =>
      apiClient.patch(`/api/budgets/${id}`, data),
    
    delete: (id: string | number) =>
      apiClient.delete(`/api/budgets/${id}`),
  },

  // ===== GOALS =====
  goals: {
    getAll: () =>
      apiClient.get('/api/goals'),
    
    getById: (id: string | number) =>
      apiClient.get(`/api/goals/${id}`),
    
    create: (data: {
      title: string;
      description?: string;
      category?: string;
      targetAmount: number;
      targetDate?: string;
      priority?: number;
    }) =>
      apiClient.post('/api/goals', data),
    
    update: (id: string | number, data: any) =>
      apiClient.patch(`/api/goals/${id}`, data),
    
    delete: (id: string | number) =>
      apiClient.delete(`/api/goals/${id}`),
    
    addContribution: (id: string | number, data: { amount: number; notes?: string }) =>
      apiClient.post(`/api/goals/${id}/contributions`, data),
  },
};

export { apiClient };
export default apiClient;