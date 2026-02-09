# Help Desk IBM - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional - currently uses in-memory database)

### Project Structure
```
Help-Desk-IBM/
├── frontend/               (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── backend/               (Node.js + Express)
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── models/
    ├── utils/
    ├── server.js
    └── package.json
```

---

## 📦 Installation & Running

### 1. Frontend Setup

```bash
# Navigate to frontend
cd Help-Desk-IBM

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

### 2. Backend Setup

```bash
# Navigate to backend
cd Help-Desk-IBM/backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Copy from backend/.env template

# Run development server
npm run dev

# OR run production server
npm start
```

Backend runs on: `http://localhost:5000`

---

## 🔑 Default Login Credentials

### User Account
```
Email: user@gmail.com
Password: user123
```

### Agent Account
```
Email: agent@gmail.com
Password: agent123
```

### Admin Account
```
Email: admin@gmail.com
Password: admin123
```

### Super Admin Account
```
Email: superadmin@gmail.com
Password: superadmin123
```

---

## 📊 Dashboard Features

### USER DASHBOARD
✅ View personal tickets (Total, Open, Closed, In-Progress)
✅ Create new tickets
✅ Track ticket status
✅ Update profile information
✅ View ticket timeline

**Navigation:**
- Dashboard (Home)
- Create Ticket
- My Tickets
- Profile

---

### AGENT DASHBOARD
✅ View assigned tickets
✅ Update ticket status
✅ Add notes to tickets
✅ Track performance metrics
✅ View quality score

**Navigation:**
- Dashboard (Home)
- Assigned Tickets
- Profile

**Metrics Shown:**
- Assigned Tickets Count
- Resolved Tickets Count
- Pending Tickets Count
- Performance Data
- Quality Score

---

### ADMIN DASHBOARD
✅ View all tickets in system
✅ Assign tickets to agents
✅ View agent performance
✅ Generate detailed reports
✅ Monitor ticket trends
✅ Track response times

**Navigation:**
- Dashboard (Home)
- All Tickets
- Reports
- Profile

**Reports Include:**
- Total Tickets
- By Status (Open/In-Progress/Closed)
- By Priority (High/Medium/Low)
- By Category
- Average Resolution Time
- Satisfaction Rate

---

### SUPER ADMIN DASHBOARD
✅ Manage all users (Create, Read, Update, Delete)
✅ View system-wide analytics
✅ Configure system settings
✅ Monitor system health
✅ User role management

**Navigation:**
- Dashboard (Home)
- Users Management
- Settings
- Profile

**User Management:**
- View all users
- Create new user
- Edit user details
- Change user roles
- Deactivate/Activate users
- Delete users

**System Settings:**
- Ticket Priorities
- Ticket Statuses
- Categories
- Available Roles
- SLA Times
- Max Tickets Per Agent

---

## 🔄 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password recovery

### Tickets
- `GET /api/tickets` - Get tickets (filtered by role)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `PUT /api/tickets/:id/close` - Close ticket

### User Routes
- `GET /api/users/dashboard` - User dashboard stats
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/my-tickets` - User's tickets

### Agent Routes
- `GET /api/agents/dashboard` - Agent dashboard
- `GET /api/agents/assigned-tickets` - Assigned tickets
- `PUT /api/agents/ticket/:id/status` - Update status
- `POST /api/agents/ticket/:id/note` - Add note
- `GET /api/agents/profile` - Agent profile

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/tickets` - All tickets
- `PUT /api/admin/ticket/:id/assign` - Assign to agent
- `GET /api/admin/reports` - System reports
- `GET /api/admin/profile` - Admin profile

### Super Admin Routes
- `GET /api/superadmin/dashboard` - Dashboard
- `GET /api/superadmin/users` - All users
- `POST /api/superadmin/users` - Create user
- `PUT /api/superadmin/users/:id` - Update user
- `DELETE /api/superadmin/users/:id` - Delete user
- `GET /api/superadmin/settings` - System settings
- `GET /api/superadmin/profile` - Profile

---

## 🗄️ Database Schema

### Users
```javascript
{
  id: number,
  name: string,
  email: string,
  password: string,
  role: 'user' | 'agent' | 'admin' | 'superadmin',
  createdAt: date,
  isActive: boolean,
  department: string,
  phone: string
}
```

### Tickets
```javascript
{
  id: number,
  userId: number,
  title: string,
  description: string,
  status: 'open' | 'in-progress' | 'closed' | 'on-hold',
  priority: 'low' | 'medium' | 'high' | 'critical',
  category: string,
  createdAt: date,
  updatedAt: date,
  assignedTo: number,
  notes: array,
  resolutionNotes: string
}
```

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions per role
- **Protected Routes**: All sensitive operations require authentication
- **Token Expiry**: Tokens expire in 24 hours
- **Password Security**: (Ready for bcrypt in production)

---

## 🧪 Testing the System

### Test User Flow
1. Login as **user@gmail.com**
2. Create a ticket
3. View in My Tickets
4. Wait for agent assignment

### Test Agent Flow
1. Login as **agent@gmail.com**
2. View assigned tickets
3. Update ticket status to "in-progress"
4. Add notes
5. Close ticket

### Test Admin Flow
1. Login as **admin@gmail.com**
2. View all system tickets
3. Assign unassigned tickets to agents
4. Generate reports
5. Monitor agent performance

### Test Super Admin Flow
1. Login as **superadmin@gmail.com**
2. Create new user (agent, admin, or user)
3. Edit existing user
4. View system analytics
5. Configure system settings
6. Delete test user

---

## 📝 File Structure Details

### Backend Organization
```
backend/
├── controllers/
│   ├── authController.js      # Login, Register, Forgot Password
│   ├── ticketController.js    # Ticket CRUD operations
│   ├── userController.js      # User dashboard & profile
│   ├── agentController.js     # Agent operations
│   ├── adminController.js     # Admin operations
│   └── superadminController.js# Super admin operations
│
├── routes/
│   ├── auth.js               # Auth endpoints
│   ├── tickets.js            # Ticket endpoints
│   ├── users.js              # User endpoints
│   ├── agents.js             # Agent endpoints
│   ├── admin.js              # Admin endpoints
│   └── superadmin.js         # Super admin endpoints
│
├── middleware/
│   └── auth.js               # JWT verification & role checks
│
├── models/
│   └── database.js           # In-memory database
│
├── utils/
│   └── helpers.js            # Utility functions
│
├── server.js                 # Express app setup
├── .env                      # Environment variables
└── package.json
```

---

## 🔧 Environment Variables

Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### CORS Issues
```javascript
// Already handled in backend/server.js
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
```

### JWT Token Issues
- Clear browser localStorage and login again
- Check token expiry (24 hours)
- Ensure JWT_SECRET matches in .env

### Database Issues
- Current version uses in-memory storage (resets on restart)
- To persist data, implement MongoDB integration
- See backend/README.md for migration steps

---

## 📚 Documentation Files

1. **DASHBOARD_FLOWCHARTS.md** - Complete flowcharts for all dashboards
2. **API_DOCUMENTATION.md** - Detailed API endpoint documentation
3. **backend/README.md** - Backend setup and configuration
4. **This file** - Quick start guide

---

## 🚀 Deployment Ready

### Frontend Deployment
```bash
npm run build
# Outputs to dist/ folder
# Deploy to Vercel, Netlify, GitHub Pages, etc.
```

### Backend Deployment
```bash
# Option 1: Deploy to Heroku
heroku create your-app-name
git push heroku main

# Option 2: Deploy to AWS Lambda
# Requires serverless framework setup

# Option 3: Deploy to DigitalOcean
# Use App Platform or Droplets
```

---

## 📞 Support & Next Steps

### To Add Features
1. Create new controller in `backend/controllers/`
2. Create new route in `backend/routes/`
3. Add to `server.js` if new module
4. Update API_DOCUMENTATION.md

### To Switch to MongoDB
1. Install: `npm install mongoose`
2. Create schema files in `models/`
3. Replace in-memory database with MongoDB queries
4. Update connection string in .env

### To Add Email Notifications
1. Install: `npm install nodemailer`
2. Configure SMTP in .env
3. Create email service module
4. Add to ticket create/update flows

### To Add File Uploads
1. Install: `npm install multer`
2. Configure upload directory
3. Add file upload routes
4. Store file paths in database

---

## ✅ Checklist for Production

- [ ] Update JWT_SECRET in .env
- [ ] Enable HTTPS/SSL
- [ ] Implement MongoDB for persistence
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Hash passwords with bcrypt
- [ ] Add comprehensive logging
- [ ] Set up error monitoring
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Document API thoroughly
- [ ] Set up CI/CD pipeline
- [ ] Configure environment-specific configs
- [ ] Add input validation
- [ ] Add email notifications
- [ ] Set up backup strategy

---

## 🎯 Key Metrics

The system tracks:
- **User Metrics**: Total tickets, open, closed, in-progress
- **Agent Metrics**: Assigned tickets, resolved tickets, quality score
- **Admin Metrics**: System health, agent performance, SLA compliance
- **System Metrics**: Total users, staff count, ticket trends

---

## 📧 Support

For issues or questions:
1. Check DASHBOARD_FLOWCHARTS.md for flow diagrams
2. Check API_DOCUMENTATION.md for endpoint details
3. Check backend/README.md for backend setup
4. Review code comments in controllers and routes

Happy Coding! 🎉
