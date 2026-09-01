import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerService = {
  // Fetch all customers with optional filters
  getCustomers: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  // Fetch due customers (due today + overdue)
  getDueCustomers: async () => {
    const response = await api.get('/customers/due');
    return response.data;
  },

  // Fetch summary metrics
  getMetrics: async () => {
    const response = await api.get('/customers/metrics');
    return response.data;
  },

  // Fetch single customer
  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Update existing customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Mark customer as contacted
  markContacted: async (id, payload = {}) => {
    const response = await api.post(`/customers/${id}/contact`, payload);
    return response.data;
  },
};

export default api;
