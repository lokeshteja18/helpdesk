# Database Setup Guide

## Overview
This project uses **MongoDB** with **Mongoose** as the ODM (Object Document Mapper).

## Database Structure

### Collections

#### 1. **Users**
Stores all user information including admins, agents, and regular users.

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  phone: String,
  role: String (enum: 'user', 'agent', 'admin', 'superadmin'),
  department: String,
  isActive: Boolean (default: true),
  avatar: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` - For quick lookup by email
- `role` - For filtering by role

#### 2. **Tickets**
Stores support tickets with full tracking and history.

```javascript
{
  _id: ObjectId,
  ticketNumber: String (unique, auto-generated format: TKT-YYYYMM-00001),
  title: String (required),
  description: String (required),
  category: String (enum: 'account', 'technical', 'billing', 'feature-request', 'bug', 'security', 'other'),
  priority: String (enum: 'low', 'medium', 'high', 'critical'),
  status: String (enum: 'open', 'in-progress', 'on-hold', 'resolved', 'closed'),
  userId: ObjectId (ref: User, required),
  assignedTo: ObjectId (ref: User),
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  notes: [{
    agentId: ObjectId (ref: User),
    content: String,
    createdAt: Date
  }],
  resolution: String,
  resolvedAt: Date,
  rating: Number (1-5),
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` - For fetching user's tickets
- `assignedTo` - For fetching agent's tickets
- `status` - For filtering by status
- `priority` - For filtering by priority
- `ticketNumber` - For quick lookup

#### 3. **Admin Settings**
Configuration and settings for system administration.

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  value: Any,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **Activity Logs**
Logs all user actions for audit trail.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  action: String (required),
  resourceType: String,
  resourceId: ObjectId,
  details: Any,
  ipAddress: String,
  createdAt: Date
}
```

**Indexes:**
- `userId` - For user activity queries
- `createdAt` - For time-based queries

## Setup Instructions

### 1. Install MongoDB

**Windows:**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow the installation wizard
- MongoDB will run as a Windows service

**Alternative - MongoDB Atlas (Cloud):**
- Go to [mongodb.com/cloud](https://mongodb.com/cloud)
- Create a free account
- Create a cluster
- Update `MONGO_URI` in `backend/models/db.js`

### 2. Update Database Configuration

Edit `backend/models/db.js`:

```javascript
// Local MongoDB (default)
const MONGO_URI = 'mongodb://127.0.0.1:27017/ibm_helpdesk';

// Or MongoDB Atlas (Cloud)
const MONGO_URI = 'mongodb+srv://username:password@cluster.mongodb.net/ibm_helpdesk?retryWrites=true&w=majority';
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Seed the Database

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

This will create:
- 7 sample users (superadmin, admin, 2 agents, 3 regular users)
- 8 sample tickets with various statuses and priorities
- Admin settings

### 5. Verify Connection

Start the server and check for the "✅ MongoDB connected" message:

```bash
npm start
```

## Sample Data

### Default Users (after seeding)

| Email | Password | Role | 
|-------|----------|------|
| superadmin@gmail.com | superadmin123 | Superadmin |
| admin@gmail.com | admin123 | Admin |
| agent1@gmail.com | agent123 | Agent |
| agent2@gmail.com | agent123 | Agent |
| user@gmail.com | user123 | User |
| jane@gmail.com | jane123 | User |
| robert@gmail.com | user123 | User |

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ibm_helpdesk
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## MongoDB Commands Reference

### Connect to MongoDB Shell
```bash
mongosh
```

### View All Databases
```javascript
show dbs
```

### Switch to IBM Helpdesk Database
```javascript
use ibm_helpdesk
```

### View Collections
```javascript
show collections
```

### Query Examples

**Find all users:**
```javascript
db.users.find().pretty()
```

**Find all open tickets:**
```javascript
db.tickets.find({ status: 'open' }).pretty()
```

**Find tickets assigned to an agent:**
```javascript
db.tickets.find({ assignedTo: ObjectId("...") }).pretty()
```

**Count tickets by status:**
```javascript
db.tickets.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
]).pretty()
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in `db.js`
- Verify firewall allows MongoDB port (27017)

### Unique Key Constraint Error
- Clear the database: `db.dropDatabase()`
- Re-run seed script

### Performance Issues
- Verify indexes are created (should be automatic)
- Check MongoDB memory usage
- Consider pagination for large result sets

## Backup and Restore

### Backup Database
```bash
mongodump --db ibm_helpdesk --out ./backup
```

### Restore Database
```bash
mongorestore --db ibm_helpdesk ./backup/ibm_helpdesk
```

## Next Steps

1. Update your backend controllers to use the new schemas
2. Apply data migrations if needed
3. Set up scheduled backups
4. Configure MongoDB Atlas for production deployment
