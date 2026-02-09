# Help Desk IBM - Backend API

A complete Node.js/Express backend for a ticketing system with role-based access control.

## Features

- 🔐 Role-based authentication (User, Agent, Admin, SuperAdmin)
- 🎫 Complete ticket management system
- 👥 User management for Super Admins
- 📊 Dashboard analytics for all roles
- 🔄 Ticket assignment and tracking
- 📝 Ticket notes and status updates

## Project Structure

```
backend/
├── controllers/        # Business logic
├── routes/            # API endpoints
├── middleware/        # Authentication & authorization
├── models/            # Data models
├── utils/             # Helper functions
├── server.js          # Express app entry
├── package.json
└── .env              # Environment variables
```

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot-password` - Request password reset

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - Get tickets (filtered by role)
- `GET /api/tickets/:ticketId` - Get ticket details
- `PUT /api/tickets/:ticketId` - Update ticket
- `PUT /api/tickets/:ticketId/close` - Close ticket

### User Routes
- `GET /api/users/dashboard` - User dashboard stats
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/my-tickets` - User's tickets

### Agent Routes
- `GET /api/agents/dashboard` - Agent dashboard
- `GET /api/agents/assigned-tickets` - Agent's assigned tickets
- `PUT /api/agents/ticket/:ticketId/status` - Update ticket status
- `POST /api/agents/ticket/:ticketId/note` - Add note to ticket
- `GET /api/agents/profile` - Agent profile

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/tickets` - All tickets
- `PUT /api/admin/ticket/:ticketId/assign` - Assign ticket to agent
- `GET /api/admin/reports` - Ticket reports
- `GET /api/admin/profile` - Admin profile

### Super Admin Routes
- `GET /api/superadmin/dashboard` - Super Admin dashboard
- `GET /api/superadmin/users` - All users
- `GET /api/superadmin/users/:userId` - User details
- `POST /api/superadmin/users` - Create user
- `PUT /api/superadmin/users/:userId` - Update user
- `DELETE /api/superadmin/users/:userId` - Delete user
- `GET /api/superadmin/settings` - System settings
- `GET /api/superadmin/profile` - Super Admin profile

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@gmail.com | superadmin123 |
| Admin | admin@gmail.com | admin123 |
| Agent | agent@gmail.com | agent123 |
| User | user@gmail.com | user123 |

## Database

Currently uses in-memory database. To use MongoDB:

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. Implement Mongoose models (schema files ready in models/)

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Tokens expire in 24 hours.

## Error Handling

All errors return JSON with error message and HTTP status code:
```json
{
  "error": "Error message here"
}
```

## Response Format

Success responses:
```json
{
  "message": "Success message",
  "data": {}
}
```

## Development Notes

- Server uses in-memory data storage (resets on restart)
- For production, implement MongoDB or other persistent database
- Add rate limiting and CORS configuration as needed
- Implement email notifications for password resets
- Add file upload for ticket attachments

## Next Steps

1. Replace in-memory database with MongoDB
2. Add email service integration
3. Implement file upload functionality
4. Add real-time notifications with WebSockets
5. Add comprehensive logging
6. Implement caching with Redis
7. Add API rate limiting
