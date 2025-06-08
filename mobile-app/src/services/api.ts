import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockAuthApi, mockMenuApi, mockProductsApi, mockTransactionsApi } from './mockApi';

const BASE_URL = REACT_APP_API_URL;
console.log('API Base URL:', BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: mockAuthApi.login,
  verifyOtp: mockAuthApi.verifyOtp,
};

export const products = {
  getAll: mockProductsApi.getAll,
  getByProvider: async (providerCode: string) => {
    const response = await api.get(`/products/provider/${providerCode}`);
    return response.data;
  },
};

export const transactions = {
  create: mockTransactionsApi.create,
  getAll: mockTransactionsApi.getAll,
  getById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
};

export const providers = {
  getByPrefix: async (prefix: string) => {
    const response = await api.get(`/provider/prefix/${prefix}`);
    return response.data;
  },
  getByCode: async (code: string) => {
    const response = await api.get(`/provider/code/${code}`);
    return response.data;
  },
};

export const menu = {
  getAll: mockMenuApi.getAll,
  // getAll: async () => {
  //   const response = await api.get('/menu');
  //   return response.data;
  // },
}

export default api;
