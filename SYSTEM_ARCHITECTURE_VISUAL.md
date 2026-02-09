# 🏗️ System Architecture & How Everything Connects

## 📐 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Frontend)                          │
│  http://localhost:5173                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React App                                               │  │
│  │  ├── Login Page        [Login_New.jsx]                 │  │
│  │  ├── Dashboard         [Dashboard.jsx]                 │  │
│  │  ├── Create Ticket     [CreateTicket_New.jsx]         │  │
│  │  ├── My Tickets        [MyTickets_New.jsx]            │  │
│  │  └── Ticket Detail     [TicketDetail_New.jsx]         │  │
│  │                                                          │  │
│  │  Services:                                              │  │
│  │  └── api.js (axios instance)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (JSON)
                         │
                    :5000 API Calls
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         EXPRESS SERVER (Backend)                                │
│  http://localhost:5000                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  server.js                                               │  │
│  │  ├── Route: /api/auth                                   │  │
│  │  │   ├── POST /login          → authController         │  │
│  │  │   ├── POST /register       → authController         │  │
│  │  │   ├── GET  /verify         → authController         │  │
│  │  │   └── POST /forgot-password→ authController         │  │
│  │  │                                                       │  │
│  │  ├── Route: /api/tickets                                │  │
│  │  │   ├── GET  /               → ticketController       │  │
│  │  │   ├── GET  /:id            → ticketController       │  │
│  │  │   ├── POST /               → ticketController       │  │
│  │  │   ├── PUT  /:id            → ticketController       │  │
│  │  │   ├── POST /:id/assign     → ticketController       │  │
│  │  │   ├── POST /:id/notes      → ticketController       │  │
│  │  │   └── POST /:id/close      → ticketController       │  │
│  │  │                                                       │  │
│  │  └── Route: /api/users                                  │  │
│  │      ├── GET  /               → userController         │  │
│  │      ├── GET  /:id            → userController         │  │
│  │      ├── PUT  /:id            → userController         │  │
│  │      └── GET  /role/agent     → userController         │  │
│  │                                                          │  │
│  │  Middleware:                                            │  │
│  │  ├── cors()                (Allow localhost:5173)      │  │
│  │  ├── express.json()        (Parse JSON)               │  │
│  │  ├── authenticate          (Verify JWT)               │  │
│  │  └── authorize             (Check roles)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Query/Insert
                         │ (Mongoose)
                         │
              :27017 MongoDB Protocol
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         MONGODB (Database)                                      │
│  mongodb://127.0.0.1:27017/ibm_helpdesk                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database: ibm_helpdesk                                 │  │
│  │  ├── Collection: users                                  │  │
│  │  │   └── 7 documents (superadmin, admin, agents, users)│  │
│  │  │                                                       │  │
│  │  ├── Collection: tickets                                │  │
│  │  │   └── 8 documents (various statuses)                │  │
│  │  │                                                       │  │
│  │  ├── Collection: adminsettings                         │  │
│  │  │   └── 5 documents (system config)                   │  │
│  │  │                                                       │  │
│  │  └── Collection: activitylogs                          │  │
│  │      └── activity audit trail                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: Login

```
1. User enters credentials
   ↓
   user@gmail.com
   password: user123
   
2. Frontend calls API
   ↓
   authAPI.login(email, password)
   POST http://localhost:5000/api/auth/login
   
3. Backend receives request
   ↓
   Express server → routes/auth.js
   
4. Controller processes
   ↓
   authController.login()
   ├── Find user in MongoDB
   ├── Compare password (bcryptjs)
   └── Generate JWT token
   
5. Response sent
   ↓
   {
     "success": true,
     "token": "eyJhbGc...",
     "user": { _id, name, email, role }
   }
   
6. Frontend saves
   ↓
   localStorage.setItem('token', response.token)
   localStorage.setItem('user', JSON.stringify(response.user))
   
7. Redirect
   ↓
   window.location.href = '/user' (or /admin, /agent, etc)
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────┐
│   User at Login Page                │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Enter Email & Password            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Call authAPI.login()              │
│   POST /api/auth/login              │
└────────────┬────────────────────────┘
             │
             ▼
    ╔═════════════════════╗
    ║  BACKEND PROCESSES  ║
    ║  - Check email      ║
    ║  - Verify password  ║
    ║  - Generate JWT     ║
    ╚═════════════════════╝
             │
             ▼
┌─────────────────────────────────────┐
│   Return JWT Token                  │
│   Return User Data                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Save Token to localStorage        │
│   Save User to localStorage         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Future API Requests               │
│   Automatically add header:         │
│   Authorization: Bearer TOKEN       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Backend verifies token            │
│   Allows request if valid           │
│   Rejects (401) if invalid/expired  │
└─────────────────────────────────────┘
```

---

## 🎫 Create Ticket Flow

```
User Form:
┌──────────────────────────┐
│ Title:     [____________]│
│ Desc:      [____________]│
│ Category:  [Technical ▼] │
│ Priority:  [High ▼]      │
│ [Create Ticket Button]   │
└──────────────┬───────────┘
               │
               ▼
    ticketAPI.create(
      title,
      description,
      category,
      priority,
      userId
    )
    POST /api/tickets
               │
               ▼
    ╔═════════════════════╗
    ║  BACKEND PROCESSES  ║
    ║  - Validate input   ║
    ║  - Check user       ║
    ║  - Generate #TKT... ║
    ║  - Save to DB       ║
    ╚═════════════════════╝
               │
               ▼
    Response:
    {
      "success": true,
      "data": {
        "_id": "507f1f...",
        "ticketNumber": "TKT-202602-00001",
        "title": "...",
        "status": "open",
        ...
      }
    }
               │
               ▼
    ✅ Show success message
    ✅ Redirect to tickets list
```

---

## 📦 Data Models

### User Model
```
User {
  _id: ObjectId
  name: String              (John Doe)
  email: String             (john@example.com)  
  password: String          (hashed)
  phone: String             (+1234567890)
  role: String              (user|agent|admin|superadmin)
  department: String        (Support, Management)
  isActive: Boolean         (true)
  avatar: String            (URL)
  lastLogin: Date           (2026-02-06T...)
  createdAt: Date
  updatedAt: Date
}

Indexes:
- email (unique)
- role
```

### Ticket Model
```
Ticket {
  _id: ObjectId
  ticketNumber: String      (TKT-202602-00001)  ← Auto-generated
  title: String             ("Login Issue")
  description: String       ("Cannot login...")
  category: String          (account|technical|billing|...)
  priority: String          (low|medium|high|critical)
  status: String            (open|in-progress|on-hold|resolved|closed)
  userId: ObjectId          (ref: User) ← Who created
  assignedTo: ObjectId      (ref: User) ← Which agent
  notes: [{
    agentId: ObjectId       (ref: User)
    content: String
    createdAt: Date
  }]
  attachments: [{
    filename: String
    url: String
    uploadedAt: Date
  }]
  resolution: String        (resolved description)
  resolvedAt: Date
  rating: Number            (1-5)
  feedback: String
  createdAt: Date
  updatedAt: Date
}

Indexes:
- userId
- assignedTo
- status
- priority
- ticketNumber (unique)
```

---

## 🔑 API Response Format

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

### Error Response (400/401/403/500)
```json
{
  "error": "Error message"
}
```

### Login Response (200)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🛡️ Security Measures

### Frontend
```javascript
- JWT token stored in localStorage
- Token sent with every API request
- Token validated on page load
- Redirects to /login if token expired
- User data stored in localStorage
```

### Backend
```javascript
- Password hashed with bcryptjs (10 salt rounds)
- JWT token verified for every protected route
- Role-based access control (RBAC)
- CORS enabled only for localhost:5173
- Request validation on all endpoints
- Error messages don't expose details
```

### Database
```javascript
- Unique email constraint
- No plaintext passwords stored
- Indexes for performance
- ObjectId references for relationships
```

---

## 🗂️ Project Structure

```
IBM-Helpdesk/
│
├── backend/
│   ├── server.js                   ← Main entry point
│   ├── package.json
│   ├── .env.example
│   │
│   ├── models/
│   │   ├── db.js                  ← MongoDB connection
│   │   └── schemas.js             ← Mongoose schemas
│   │
│   ├── controllers/
│   │   ├── authController_MongoDB.js
│   │   └── ticketController_MongoDB.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tickets_MongoDB.js
│   │   └── users_MongoDB.js
│   │
│   └── middleware/
│       ├── authMiddleware.js
│       └── auth.js
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   │
│   ├── services/
│   │   └── api.js                 ← API service (axios)
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login_New.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── MyTickets_New.jsx
│   │   │   ├── CreateTicket_New.jsx
│   │   │   └── TicketDetail_New.jsx
│   │   │
│   │   ├── agent/
│   │   └── admin/
│   │
│   └── layouts/
│       └── UserLayout.jsx
│
└── docs/
    ├── QUICK_START_GUIDE.md
    ├── API_DOCUMENTATION_COMPLETE.md
    ├── DATABASE_SETUP.md
    └── PROJECT_STATUS_AND_NEXT_STEPS.md
```

---

## 🚀 Deployment Architecture

```
Production Setup:

┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Vercel/       │
│   Netlify       │
└────────┬────────┘
         │
         │ HTTPS
         │
    ┌────▼─────────┐
    │  Backend     │
    │  (Node.js)   │
    │  Heroku/     │
    │  Railway     │
    └────┬─────────┘
         │
    ┌────▼──────────┐
    │  MongoDB      │
    │  Atlas        │
    │  (Cloud)      │
    └───────────────┘
```

---

## 📊 Technology Stack

### Frontend
- React.js - UI Framework
- React Router - Routing
- Axios - HTTP client
- CSS/Tailwind - Styling
- Vite - Build tool

### Backend
- Node.js - Runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing

### Infrastructure
- MongoDB - NoSQL database
- Express - REST API server
- Node.js - JavaScript runtime

### Tools
- Git - Version control
- npm - Package manager
- VS Code - Editor

---

## ♻️ API Request/Response Cycle

```
1. Frontend (Client)
   └─→ Create HTTP request with:
       - Method (GET, POST, PUT, DELETE)
       - URL (/api/tickets)
       - Headers (Content-Type, Authorization)
       - Body (JSON data)

2. Network
   └─→ Send over HTTPS to localhost:5000

3. Backend Server
   └─→ Express receives request
       - Parse headers and body
       - Check CORS rules
       - Match to route handler

4. Middleware
   └─→ Process request:
       - CORS check
       - JWT verification
       - Role authorization

5. Route Handler
   └─→ Call appropriate controller

6. Controller
   └─→ Business logic:
       - Validate input
       - Query database
       - Process data
       - Create response

7. Database
   └─→ MongoDB:
       - Execute query
       - Return results

8. Response Preparation
   └─→ Format response:
       - Set status code (200, 201, 400, 401, 500)
       - Add headers
       - Serialize JSON

9. Network
   └─→ Send response back to frontend

10. Frontend (Client)
    └─→ Receive response:
        - Parse JSON
        - Update state
        - Re-render UI
        - Show data/errors
```

---

## 🎯 Key Takeaways

1. **Frontend** sends requests to **Backend API**
2. **Backend** validates, processes, and queries **Database**
3. **Database** stores and retrieves data
4. **Backend** returns response to **Frontend**
5. **Frontend** displays data to user

Everything is connected and ready to use! 🚀
