# IBM Helpdesk - Backend API Documentation

## Server Status
✅ **Backend Server**: Running on `http://localhost:5000`
✅ **Database**: MongoDB connected - `ibm_helpdesk`
✅ **Default Port**: 5000

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer {token}
```

---

## API Endpoints

### 1. Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "user123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@gmail.com",
    "role": "user"
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": { ... user data ... }
}
```

#### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@gmail.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset instructions sent to email"
}
```

---

### 2. Users Routes (`/api/users`)

#### Get All Users (Admin only)
```
GET /api/users
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "count": 7,
  "data": [ { user objects... } ]
}
```

#### Get User by ID
```
GET /api/users/{userId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { ... user data ... }
}
```

#### Update User Profile
```
PUT /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "department": "Support",
  "avatar": "https://..."
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... updated user ... }
}
```

#### Get All Agents
```
GET /api/users/role/agent
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "count": 2,
  "data": [ { agent objects... } ]
}
```

---

### 3. Tickets Routes (`/api/tickets`)

#### Get All Tickets
```
GET /api/tickets
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "count": 8,
  "data": [ { ticket objects... } ]
}
```

#### Get Ticket by ID
```
GET /api/tickets/{ticketId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "ticketNumber": "TKT-202602-00001",
    "title": "Login Issue",
    "description": "Cannot login to my account",
    "category": "account",
    "priority": "high",
    "status": "open",
    "userId": { ... user data ... },
    "assignedTo": { ... agent data ... },
    "notes": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create New Ticket
```
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Cannot access dashboard",
  "description": "Dashboard is not loading properly",
  "category": "technical",
  "priority": "high",
  "userId": "507f1f77bcf86cd799439011"
}

Response (201):
{
  "success": true,
  "message": "Ticket created successfully",
  "data": { ... ticket data ... }
}
```

#### Update Ticket
```
PUT /api/tickets/{ticketId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in-progress",
  "priority": "medium"
}

Response (200):
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": { ... updated ticket ... }
}
```

#### Assign Ticket to Agent
```
POST /api/tickets/{ticketId}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentId": "507f1f77bcf86cd799439011"
}

Response (200):
{
  "success": true,
  "message": "Ticket assigned successfully",
  "data": { ... updated ticket ... }
}
```

#### Add Note to Ticket
```
POST /api/tickets/{ticketId}/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentId": "507f1f77bcf86cd799439011",
  "content": "Investigating the issue now..."
}

Response (200):
{
  "success": true,
  "message": "Note added successfully",
  "data": { ... ticket with new note ... }
}
```

#### Close/Resolve Ticket
```
POST /api/tickets/{ticketId}/close
Authorization: Bearer {token}
Content-Type: application/json

{
  "resolution": "Issue resolved by updating user password",
  "rating": 5,
  "feedback": "Great support!"
}

Response (200):
{
  "success": true,
  "message": "Ticket closed successfully",
  "data": { ... closed ticket ... }
}
```

#### Get Tickets by Status
```
GET /api/tickets/status/{status}
Authorization: Bearer {token}

Status values: open, in-progress, on-hold, resolved, closed

Response (200):
{
  "success": true,
  "count": 3,
  "data": [ { ticket objects... } ]
}
```

#### Get User's Tickets
```
GET /api/tickets/user/{userId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "count": 4,
  "data": [ { ticket objects... } ]
}
```

#### Get Agent's Assigned Tickets
```
GET /api/tickets/agent/{agentId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "count": 5,
  "data": [ { ticket objects... } ]
}
```

---

## Test Credentials

After seeding, you can log in with these credentials:

| Email | Password | Role |
|-------|----------|------|
| superadmin@gmail.com | superadmin123 | Superadmin |
| admin@gmail.com | admin123 | Admin |
| agent1@gmail.com | agent123 | Agent |
| agent2@gmail.com | agent123 | Agent |
| user@gmail.com | user123 | User |
| jane@gmail.com | jane123 | User |
| robert@gmail.com | user123 | User |

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 - Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 - Not Found
```json
{
  "error": "User not found"
}
```

### 500 - Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Environment Variables

Create a `.env` file in the backend folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ibm_helpdesk
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@gmail.com",
    "password": "user123"
  }'
```

### Get All Tickets
```bash
curl -X GET http://localhost:5000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Ticket
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Ticket",
    "description": "This is a test",
    "category": "technical",
    "priority": "high",
    "userId": "USER_ID_HERE"
  }'
```

---

## Next Steps

1. **Frontend Integration**: Connect your React frontend to these endpoints
2. **Admin Routes**: Implement `/api/admin` routes for admin operations
3. **Agent Routes**: Implement `/api/agents` routes for agent operations
4. **Superadmin Routes**: Implement `/api/superadmin` routes for system administration
5. **Email Integration**: Add email notifications for ticket updates
6. **File Uploads**: Add attachment support to tickets
7. **Analytics**: Add dashboard and reporting endpoints

---

## Server Health Check

```bash
GET http://localhost:5000/api/health

Response (200):
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```
