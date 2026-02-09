import axios from 'axios';

// Create axios instance pointing to backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => 
    API.post('/auth/login', { email, password }),
  
  register: (name, email, password, confirmPassword) => 
    API.post('/auth/register', { name, email, password, confirmPassword }),
  
  verify: () => 
    API.get('/auth/verify'),
  
  forgotPassword: (email) => 
    API.post('/auth/forgot-password', { email })
};

// ==================== TICKET API ====================
export const ticketAPI = {
  getAll: () => 
    API.get('/tickets'),
  
  getById: (id) => 
    API.get(`/tickets/${id}`),
  
  create: (title, description, category, priority, userId) => 
    API.post('/tickets', { title, description, category, priority, userId }),
  
  update: (id, data) => 
    API.put(`/tickets/${id}`, data),
  
  assign: (id, agentId) => 
    API.post(`/tickets/${id}/assign`, { agentId }),
  
  addNote: (id, agentId, content) => 
    API.post(`/tickets/${id}/notes`, { agentId, content }),
  
  close: (id, resolution, rating, feedback) => 
    API.post(`/tickets/${id}/close`, { resolution, rating, feedback }),
  
  getByStatus: (status) => 
    API.get(`/tickets/status/${status}`),
  
  getUserTickets: (userId) => 
    API.get(`/tickets/user/${userId}`),
  
  getAgentTickets: (agentId) => 
    API.get(`/tickets/agent/${agentId}`)
};

// ==================== USER API ====================
export const userAPI = {
  getAll: () => 
    API.get('/users'),
  
  getById: (id) => 
    API.get(`/users/${id}`),
  
  update: (id, data) => 
    API.put(`/users/${id}`, data),
  
  getAgents: () => 
    API.get('/users/role/agent')
};

export default API;
