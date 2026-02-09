# Frontend Integration Checklist ✅

## 🚀 Quick Start (5 minutes)

### Step 1: Install Axios
```bash
npm install axios
```

### Step 2: Copy Files Created for You
These files are already in your project:

✅ `src/services/api.js` - API service (ready to use)
✅ `src/pages/auth/Login_New.jsx` - Updated Login component
✅ `src/pages/user/MyTickets_New.jsx` - Ticket list component
✅ `src/pages/user/CreateTicket_New.jsx` - Create ticket form
✅ `src/pages/user/TicketDetail_New.jsx` - Ticket detail view

### Step 3: Use These Components

Replace your existing files OR create new routes using these components:

**Option A: Replace existing files**
```
src/pages/auth/Login.jsx → Copy from Login_New.jsx
src/pages/user/MyTickets.jsx → Copy from MyTickets_New.jsx
src/pages/user/CreateTicket.jsx → Copy from CreateTicket_New.jsx
```

**Option B: Update your App.jsx to import new components**
```javascript
import Login from './pages/auth/Login_New';
import MyTickets from './pages/user/MyTickets_New';
import CreateTicket from './pages/user/CreateTicket_New';
import TicketDetail from './pages/user/TicketDetail_New';
```

### Step 4: Start Backend
```bash
cd backend
node server.js
```

Expected output:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:5000
```

### Step 5: Start Frontend
```bash
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 6: Test Login
Go to `http://localhost:5173` and login with:
- Email: `user@gmail.com`
- Password: `user123`

---

## 📋 What Each File Does

### `src/services/api.js`
- Handles all API calls to backend
- Automatically adds JWT token to requests
- Redirects to login if token expires
- Contains 3 main API objects:
  - `authAPI` - Login, Register, Verify
  - `ticketAPI` - Create, read, update tickets
  - `userAPI` - Get users, agents, profile

### `src/pages/auth/Login_New.jsx`
- User login page
- Connects to `/api/auth/login` endpoint
- Saves token and user to localStorage
- Redirects based on user role

### `src/pages/user/MyTickets_New.jsx`
- Shows all tickets for current user
- Filter by status
- Color-coded priority and status badges
- Links to ticket details

### `src/pages/user/CreateTicket_New.jsx`
- Form to create new support ticket
- Categories: Account, Technical, Billing, etc.
- Priority levels: Low, Medium, High, Critical
- Shows success message with ticket number

### `src/pages/user/TicketDetail_New.jsx`
- Shows full ticket details
- Displays all notes/updates
- Allows adding new notes
- Shows resolution if ticket is closed

---

## 🔧 How to Use the API Service

### Example 1: Login
```javascript
import { authAPI } from './services/api';

const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Login failed:', error.response.data.error);
  }
};
```

### Example 2: Get all tickets
```javascript
import { ticketAPI } from './services/api';

const fetchTickets = async () => {
  try {
    const response = await ticketAPI.getAll();
    console.log(response.data.data); // Array of tickets
  } catch (error) {
    console.error('Failed to fetch tickets');
  }
};
```

### Example 3: Create ticket
```javascript
const handleCreateTicket = async () => {
  try {
    const response = await ticketAPI.create(
      'Issue Title',
      'Detailed description',
      'technical',
      'high',
      userId
    );
    console.log('Created:', response.data.data);
  } catch (error) {
    console.error('Failed to create ticket');
  }
};
```

### Example 4: Add note to ticket
```javascript
const handleAddNote = async (ticketId, content) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    await ticketAPI.addNote(ticketId, user._id, content);
    console.log('Note added!');
  } catch (error) {
    console.error('Failed to add note');
  }
};
```

---

## 🧭 Complete App Flow

### User Flow
1. User visits `http://localhost:5173`
2. Redirected to `/login` (no token)
3. Enters credentials and logs in
4. Backend returns JWT token
5. Token saved to localStorage
6. Redirected to `/user` dashboard
7. Can create, view, and update tickets

### Protected Routes
- `/login` - Public
- `/register` - Public
- `/user/*` - Requires 'user' role
- `/agent/*` - Requires 'agent' role
- `/admin/*` - Requires 'admin' role
- `/superadmin/*` - Requires 'superadmin' role

---

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find module 'axios'"
**Solution:**
```bash
npm install axios
```

### Issue: "CORS error in console"
**Solution:** Backend already has CORS enabled. Make sure:
- Backend is running on port 5000
- Frontend is on port 5173
- Check FRONTEND_URL in backend .env

### Issue: "401 Unauthorized when fetching data"
**Solution:** Token is missing or expired:
```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token:', token);

// Re-login if needed
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

### Issue: "Cannot read property '_id' of null"
**Solution:** User data not loaded, check:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
  window.location.href = '/login';
}
```

### Issue: Form not submitting
**Solution:** Check browser console for errors and ensure:
```javascript
- Event is preventDefault()
- Fields are not disabled
- Token is valid
```

---

## 📊 Backend API Summary

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/auth/forgot-password` | Reset password |

### Ticket Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets |
| GET | `/api/tickets/:id` | Get ticket by ID |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| POST | `/api/tickets/:id/assign` | Assign to agent |
| POST | `/api/tickets/:id/notes` | Add note |
| POST | `/api/tickets/:id/close` | Close ticket |
| GET | `/api/tickets/status/:status` | Get by status |
| GET | `/api/tickets/user/:userId` | Get user's tickets |
| GET | `/api/tickets/agent/:agentId` | Get agent's tickets |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| GET | `/api/users/role/agent` | Get all agents |

---

## ✅ Verification Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] `axios` installed in frontend
- [ ] `src/services/api.js` exists and imported
- [ ] Can login with `user@gmail.com / user123`
- [ ] Token saved to localStorage after login
- [ ] Can view tickets
- [ ] Can create new ticket
- [ ] Can add notes to ticket
- [ ] No CORS errors in console

---

## 🎯 Next Steps After Frontend Works

1. **Implement Protected Routes** - Use role-based access
2. **Create Dashboard** - Show statistics and quick actions
3. **Add Admin Pages** - User management, reports
4. **Add Agent Pages** - Ticket assignment, queue management
5. **Add Notifications** - Real-time ticket updates
6. **Add File Uploads** - Ticket attachments
7. **Deploy to Production** - Use cloud services

---

## 📚 Reference Files

- [API_DOCUMENTATION_COMPLETE.md](../API_DOCUMENTATION_COMPLETE.md) - All API endpoints
- [BACKEND_INTEGRATION_COMPLETE.md](../BACKEND_INTEGRATION_COMPLETE.md) - Backend setup
- [DATABASE_SETUP.md](../DATABASE_SETUP.md) - Database info
- [FRONTEND_INTEGRATION_STEP_BY_STEP.md](../FRONTEND_INTEGRATION_STEP_BY_STEP.md) - Detailed guide

---

## 🆘 Need Help?

Check these files for detailed information:
- Error details in browser Console (F12)
- Backend logs in terminal
- MongoDB logs if database error

---

**You're all set! Start with Step 1 above and you'll have a working app in 5 minutes.** 🚀
