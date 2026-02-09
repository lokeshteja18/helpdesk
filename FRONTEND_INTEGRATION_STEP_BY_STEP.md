# Step-by-Step Frontend Integration Guide

## Part 1: Install Dependencies

### Step 1.1: Go to your project root
```bash
cd c:\Users\lokes\Downloads\IBM-project-frontend-and-backend-main\IBM-project-frontend-and-backend-main
```

### Step 1.2: Install Axios (for API calls)
```bash
npm install axios
```

Expected output:
```
added 1 package in 2.34s
```

---

## Part 2: Create API Service

### Step 2.1: Create API directory
Create folder: `src/services/`

### Step 2.2: Create `src/services/api.js`
This file will handle all API calls:

```javascript
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
      // Token expired, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
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

// Ticket API calls
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

// User API calls
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
```

---

## Part 3: Create Login Component

### Step 3.1: Create `src/pages/auth/Login.jsx`
Replace existing with this:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Save token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on role
      const { role } = response.data.user;
      if (role === 'superadmin') navigate('/superadmin');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'agent') navigate('/agent');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>IBM Helpdesk</h1>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@gmail.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="test-credentials">
          <p>Test Credentials:</p>
          <small>👤 user@gmail.com / user123</small>
          <small>🕵️ agent1@gmail.com / agent123</small>
        </div>
      </div>
    </div>
  );
}
```

---

## Part 4: Create Ticket Components

### Step 4.1: Create `src/pages/user/TicketList.jsx`

```javascript
import { useState, useEffect } from 'react';
import { ticketAPI } from '../../services/api';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user.role === 'user') {
        response = await ticketAPI.getUserTickets(user._id);
      } else if (user.role === 'agent') {
        response = await ticketAPI.getAgentTickets(user._id);
      } else {
        response = await ticketAPI.getAll();
      }
      
      setTickets(response.data.data);
    } catch (err) {
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tickets-container">
      <h2>Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket.ticketNumber}</td>
              <td>{ticket.title}</td>
              <td><span className={`status ${ticket.status}`}>{ticket.status}</span></td>
              <td><span className={`priority ${ticket.priority}`}>{ticket.priority}</span></td>
              <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => window.location.href = `/tickets/${ticket._id}`}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Step 4.2: Create `src/pages/user/CreateTicket.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../../services/api';

export default function CreateTicket() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ticketAPI.create(
        formData.title,
        formData.description,
        formData.category,
        formData.priority,
        user._id
      );
      
      alert('Ticket created successfully!');
      navigate('/user/tickets');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <h2>Create New Ticket</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief description of issue"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="account">Account</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="feature-request">Feature Request</option>
              <option value="bug">Bug</option>
              <option value="security">Security</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
}
```

---

## Part 5: Update Your App.jsx

### Step 5.1: Add API integration to App.jsx

```javascript
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';

// Import your layouts and pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserLayout from './layouts/UserLayout';
import AgentLayout from './layouts/AgentLayout';
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/permission-denied" />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token on app load
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.verify();
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }
        />

        {/* Agent Routes */}
        <Route
          path="/agent/*"
          element={
            <ProtectedRoute allowedRoles={['agent', 'admin', 'superadmin']}>
              <AgentLayout />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Superadmin Routes */}
        <Route
          path="/superadmin/*"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## Part 6: Setup Environment

### Step 6.1: Create `.env` file in frontend root (if not exists)

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 6.2: Update vite.config.js if needed

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

## Part 7: Test Everything

### Step 7.1: Verify Backend is Running
```bash
# Open new terminal, check if backend is running on 5000
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running","timestamp":"2026-02-06T..."}
```

### Step 7.2: Start Frontend
```bash
# In project root
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 7.3: Test Login
1. Open `http://localhost:5173`
2. Login with: `user@gmail.com` / `user123`
3. Should see dashboard

---

## Part 8: Common Issues & Fixes

### Issue: CORS errors
**Solution**: Backend already has CORS enabled for localhost:5173

### Issue: Token expires on page refresh
**Solution**: The API middleware automatically refreshes from localStorage

### Issue: 401 Unauthorized errors
**Solution**: Make sure token is saved: `localStorage.getItem('token')`

### Issue: POST requests failing
**Solution**: Add `Content-Type: application/json` header (axios does this automatically)

---

## Part 9: Summary

✅ Created API service file with all endpoints
✅ Created Login component
✅ Created Ticket components
✅ Updated App.jsx with protected routes
✅ Added environment setup
✅ Ready to test!

**Next Steps:**
1. Run backend: `cd backend && node server.js`
2. Run frontend: `npm run dev`
3. Test login at `http://localhost:5173`
4. Complete remaining components (Dashboard, Reports, etc.)
