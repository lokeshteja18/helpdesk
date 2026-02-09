# Help Desk IBM - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@gmail.com",
    "role": "user"
  }
}
```

---

### 1.2 Register
**POST** `/auth/register`

Request:
```json
{
  "name": "Jane Smith",
  "email": "jane@gmail.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "user"
}
```

Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 6,
    "name": "Jane Smith",
    "email": "jane@gmail.com",
    "role": "user"
  },
  "message": "User registered successfully"
}
```

---

### 1.3 Forgot Password
**POST** `/auth/forgot-password`

Request:
```json
{
  "email": "user@gmail.com"
}
```

Response (200):
```json
{
  "message": "Password reset link sent to email",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. TICKET ENDPOINTS

### 2.1 Create Ticket
**POST** `/tickets`
*Requires: User role*

Request:
```json
{
  "title": "Cannot login to account",
  "description": "Getting error message when trying to login",
  "category": "account",
  "priority": "high"
}
```

Response (201):
```json
{
  "message": "Ticket created successfully",
  "ticket": {
    "id": 10,
    "userId": 4,
    "title": "Cannot login to account",
    "description": "Getting error message when trying to login",
    "status": "open",
    "priority": "high",
    "category": "account",
    "createdAt": "2024-02-04T10:30:00Z",
    "updatedAt": "2024-02-04T10:30:00Z",
    "assignedTo": null,
    "notes": []
  }
}
```

---

### 2.2 Get All Tickets
**GET** `/tickets`
*Requires: Auth (filtered by role)*

Response (200):
```json
{
  "tickets": [
    {
      "id": 1,
      "userId": 4,
      "title": "Login Issue",
      "description": "Cannot login",
      "status": "open",
      "priority": "high",
      "category": "account",
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-15T08:00:00Z",
      "assignedTo": 3,
      "userName": "John Doe",
      "agentName": "Agent John"
    }
  ]
}
```

---

### 2.3 Get Ticket by ID
**GET** `/tickets/:ticketId`

Response (200):
```json
{
  "ticket": {
    "id": 1,
    "userId": 4,
    "title": "Login Issue",
    "description": "Cannot login to my account",
    "status": "open",
    "priority": "high",
    "category": "account",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T08:00:00Z",
    "assignedTo": 3,
    "notes": [
      {
        "author": "Agent John",
        "text": "Investigating the issue",
        "timestamp": "2024-01-16T10:00:00Z"
      }
    ],
    "userName": "John Doe",
    "agentName": "Agent John"
  }
}
```

---

### 2.4 Update Ticket
**PUT** `/tickets/:ticketId`

Request:
```json
{
  "status": "in-progress",
  "priority": "medium",
  "description": "Updated description"
}
```

Response (200):
```json
{
  "message": "Ticket updated successfully",
  "ticket": {
    "id": 1,
    "userId": 4,
    "title": "Login Issue",
    "status": "in-progress",
    "priority": "medium",
    "updatedAt": "2024-02-04T10:30:00Z"
  }
}
```

---

### 2.5 Close Ticket
**PUT** `/tickets/:ticketId/close`

Request:
```json
{
  "resolutionNotes": "Issue resolved by resetting user password"
}
```

Response (200):
```json
{
  "message": "Ticket closed successfully",
  "ticket": {
    "id": 1,
    "status": "closed",
    "resolutionNotes": "Issue resolved by resetting user password",
    "updatedAt": "2024-02-04T10:35:00Z"
  }
}
```

---

## 3. USER ENDPOINTS

### 3.1 Get User Dashboard
**GET** `/users/dashboard`

Response (200):
```json
{
  "dashboard": {
    "totalTickets": 12,
    "openTickets": 5,
    "closedTickets": 7,
    "inProgressTickets": 0,
    "recentTickets": [
      {
        "id": 1,
        "title": "Login Issue",
        "status": "open",
        "priority": "high",
        "createdAt": "2024-01-15T08:00:00Z"
      }
    ]
  }
}
```

---

### 3.2 Get User Profile
**GET** `/users/profile`

Response (200):
```json
{
  "profile": {
    "id": 4,
    "name": "John Doe",
    "email": "user@gmail.com",
    "role": "user",
    "createdAt": "2023-12-01T00:00:00Z",
    "isActive": true,
    "department": "Sales",
    "phone": "+1-555-0123"
  }
}
```

---

### 3.3 Update User Profile
**PUT** `/users/profile`

Request:
```json
{
  "name": "John Doe",
  "phone": "+1-555-0123",
  "department": "Sales"
}
```

Response (200):
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": 4,
    "name": "John Doe",
    "email": "user@gmail.com",
    "phone": "+1-555-0123",
    "department": "Sales"
  }
}
```

---

### 3.4 Get My Tickets
**GET** `/users/my-tickets`

Response (200):
```json
{
  "tickets": [
    {
      "id": 1,
      "title": "Login Issue",
      "status": "open",
      "priority": "high",
      "category": "account",
      "createdAt": "2024-01-15T08:00:00Z",
      "agentName": "Agent John"
    }
  ]
}
```

---

## 4. AGENT ENDPOINTS

### 4.1 Get Agent Dashboard
**GET** `/agents/dashboard`
*Requires: Agent role*

Response (200):
```json
{
  "dashboard": {
    "assignedTickets": 5,
    "resolvedTickets": 3,
    "pendingTickets": 2,
    "performance": {
      "totalAssigned": 5,
      "resolved": 3,
      "pending": 2,
      "avgResolutionTime": "4.5 hours",
      "qualityScore": 4.7
    },
    "recentTickets": [...]
  }
}
```

---

### 4.2 Get Assigned Tickets
**GET** `/agents/assigned-tickets`
*Requires: Agent role*

Response (200):
```json
{
  "tickets": [
    {
      "id": 1,
      "title": "Login Issue",
      "status": "open",
      "priority": "high",
      "category": "account",
      "createdAt": "2024-01-15T08:00:00Z",
      "userName": "John Doe"
    }
  ]
}
```

---

### 4.3 Update Ticket Status
**PUT** `/agents/ticket/:ticketId/status`
*Requires: Agent role*

Request:
```json
{
  "status": "in-progress",
  "notes": "Started investigating the issue"
}
```

Response (200):
```json
{
  "message": "Ticket status updated",
  "ticket": {
    "id": 1,
    "status": "in-progress",
    "notes": [
      {
        "author": "Agent John",
        "text": "Started investigating the issue",
        "timestamp": "2024-02-04T10:30:00Z"
      }
    ]
  }
}
```

---

### 4.4 Add Ticket Note
**POST** `/agents/ticket/:ticketId/note`
*Requires: Agent role*

Request:
```json
{
  "note": "User password has been reset successfully"
}
```

Response (200):
```json
{
  "message": "Note added successfully",
  "ticket": {
    "id": 1,
    "notes": [
      {
        "author": "Agent John",
        "text": "User password has been reset successfully",
        "timestamp": "2024-02-04T10:35:00Z"
      }
    ]
  }
}
```

---

### 4.5 Get Agent Profile
**GET** `/agents/profile`
*Requires: Agent role*

Response (200):
```json
{
  "profile": {
    "id": 3,
    "name": "Agent John",
    "email": "agent@gmail.com",
    "role": "agent",
    "stats": {
      "assigned": 5,
      "resolved": 3,
      "avgRating": 4.7
    }
  }
}
```

---

## 5. ADMIN ENDPOINTS

### 5.1 Get Admin Dashboard
**GET** `/admin/dashboard`
*Requires: Admin role*

Response (200):
```json
{
  "dashboard": {
    "stats": {
      "totalTickets": 20,
      "openTickets": 8,
      "closedTickets": 12,
      "inProgressTickets": 0
    },
    "agentPerformance": [
      {
        "agentId": 3,
        "agentName": "Agent John",
        "assigned": 5,
        "resolved": 3
      }
    ],
    "recentTickets": [...]
  }
}
```

---

### 5.2 Get All Tickets
**GET** `/admin/tickets`
*Requires: Admin role*

Response (200):
```json
{
  "tickets": [
    {
      "id": 1,
      "title": "Login Issue",
      "status": "open",
      "priority": "high",
      "assignedTo": 3,
      "userName": "John Doe",
      "agentName": "Agent John"
    }
  ]
}
```

---

### 5.3 Assign Ticket to Agent
**PUT** `/admin/ticket/:ticketId/assign`
*Requires: Admin role*

Request:
```json
{
  "agentId": 3
}
```

Response (200):
```json
{
  "message": "Ticket assigned successfully",
  "ticket": {
    "id": 1,
    "title": "Login Issue",
    "assignedTo": 3,
    "updatedAt": "2024-02-04T10:30:00Z"
  }
}
```

---

### 5.4 Get Reports
**GET** `/admin/reports`
*Requires: Admin role*

Response (200):
```json
{
  "reports": {
    "totalTickets": 20,
    "byStatus": {
      "open": 8,
      "inProgress": 7,
      "closed": 5
    },
    "byPriority": {
      "high": 5,
      "medium": 10,
      "low": 5
    },
    "byCategory": {
      "account": 8,
      "technical": 7,
      "security": 3,
      "billing": 2
    },
    "avgResolutionTime": "5 hours",
    "satisfactionRate": 87
  }
}
```

---

### 5.5 Get Admin Profile
**GET** `/admin/profile`
*Requires: Admin role*

Response (200):
```json
{
  "profile": {
    "id": 2,
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "admin",
    "createdAt": "2023-12-01T00:00:00Z"
  }
}
```

---

## 6. SUPER ADMIN ENDPOINTS

### 6.1 Get Super Admin Dashboard
**GET** `/superadmin/dashboard`
*Requires: SuperAdmin role*

Response (200):
```json
{
  "dashboard": {
    "stats": {
      "totalUsers": 10,
      "staffMembers": 3,
      "totalTickets": 120,
      "openTickets": 15
    },
    "userBreakdown": {
      "users": 7,
      "agents": 2,
      "admins": 1,
      "superadmins": 1
    },
    "recentUsers": [...],
    "recentTickets": [...]
  }
}
```

---

### 6.2 Get All Users
**GET** `/superadmin/users`
*Requires: SuperAdmin role*

Response (200):
```json
{
  "users": [
    {
      "id": 4,
      "name": "John Doe",
      "email": "user@gmail.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-12-01T00:00:00Z"
    }
  ]
}
```

---

### 6.3 Get User by ID
**GET** `/superadmin/users/:userId`
*Requires: SuperAdmin role*

Response (200):
```json
{
  "user": {
    "id": 4,
    "name": "John Doe",
    "email": "user@gmail.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-12-01T00:00:00Z",
    "department": "Sales",
    "phone": "+1-555-0123"
  }
}
```

---

### 6.4 Create User
**POST** `/superadmin/users`
*Requires: SuperAdmin role*

Request:
```json
{
  "name": "Mike Agent",
  "email": "mike@gmail.com",
  "password": "password123",
  "role": "agent"
}
```

Response (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": 7,
    "name": "Mike Agent",
    "email": "mike@gmail.com",
    "role": "agent"
  }
}
```

---

### 6.5 Update User
**PUT** `/superadmin/users/:userId`
*Requires: SuperAdmin role*

Request:
```json
{
  "name": "Mike Updated",
  "role": "admin",
  "isActive": true,
  "department": "IT",
  "phone": "+1-555-0456"
}
```

Response (200):
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 7,
    "name": "Mike Updated",
    "email": "mike@gmail.com",
    "role": "admin",
    "isActive": true,
    "department": "IT",
    "phone": "+1-555-0456"
  }
}
```

---

### 6.6 Delete User
**DELETE** `/superadmin/users/:userId`
*Requires: SuperAdmin role*

Response (200):
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": 7,
    "name": "Mike Updated",
    "email": "mike@gmail.com"
  }
}
```

---

### 6.7 Get System Settings
**GET** `/superadmin/settings`
*Requires: SuperAdmin role*

Response (200):
```json
{
  "settings": {
    "ticketPriorities": ["low", "medium", "high", "critical"],
    "ticketStatuses": ["open", "in-progress", "closed", "on-hold"],
    "categories": ["account", "technical", "security", "billing", "general"],
    "roles": ["user", "agent", "admin", "superadmin"],
    "maxTicketsPerAgent": 10,
    "sla": {
      "low": 72,
      "medium": 48,
      "high": 24,
      "critical": 4
    }
  }
}
```

---

### 6.8 Get Super Admin Profile
**GET** `/superadmin/profile`
*Requires: SuperAdmin role*

Response (200):
```json
{
  "profile": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@gmail.com",
    "role": "superadmin",
    "createdAt": "2023-12-01T00:00:00Z",
    "isActive": true
  }
}
```

---

## ERROR RESPONSES

### 400 - Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 - Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 - Not Found
```json
{
  "error": "Ticket not found"
}
```

### 500 - Server Error
```json
{
  "error": "Something went wrong!"
}
```

---

## TEST CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@gmail.com | superadmin123 |
| Admin | admin@gmail.com | admin123 |
| Agent | agent@gmail.com | agent123 |
| User | user@gmail.com | user123 |

---

## NOTES

- All timestamps are in ISO 8601 format (UTC)
- JWT tokens expire in 24 hours
- Passwords are stored as plain text in current version (use bcrypt in production)
- All user-modifiable data is validated on backend
- Cascading operations: Deleting a user does NOT delete their tickets (maintains history)
