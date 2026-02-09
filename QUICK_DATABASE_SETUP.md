## Database Setup - Quick Start

### Step 1: Create `.env` file in `backend/` folder

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Or create `backend/.env` with:
```
MONGO_URI=mongodb://127.0.0.1:27017/ibm_helpdesk
PORT=5000
JWT_SECRET=your_secret_key_here
```

### Step 2: Install MongoDB

**Option A: Local Installation (Recommended for Development)**
- Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Install and run as a Windows service
- MongoDB will automatically run on port 27017

**Option B: Cloud (MongoDB Atlas)**
- Go to [mongodb.com/cloud](https://mongodb.com/cloud)
- Create account and cluster
- Update `MONGO_URI` in `.env` with your connection string

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `mongoose` (MongoDB ORM)
- `express` (Server)
- `bcryptjs` (Password hashing)
- And other dependencies

### Step 4: Seed the Database

Populate with sample data:

```bash
npm run seed
```

**Output should show:**
```
🌱 Seeding database...
✅ Users created: 7
✅ Tickets created: 8
✅ Admin settings created
🎉 Database seeded successfully!
```

### Step 5: Start the Server

```bash
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
Server running on port 5000
```

## Test the Database

### Using MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Connect to `mongodb://127.0.0.1:27017`
3. View databases → `ibm_helpdesk`
4. Explore collections

### Using MongoDB Shell
```bash
mongosh
use ibm_helpdesk
db.users.find().pretty()
db.tickets.find().pretty()
```

## Login Test

After seeding, try logging in with:
- **Email:** user@gmail.com
- **Password:** user123

Or:
- **Email:** agent1@gmail.com
- **Password:** agent123

## Troubleshooting

**"MongoDB connection failed"**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify port 27017 is accessible

**"Module not found: mongoose"**
- Run `npm install` in backend folder
- Check `node_modules` exists

**"Seed failed"**
- Delete database: `mongosh` → `use ibm_helpdesk` → `db.dropDatabase()`
- Re-run seed: `npm run seed`

## Files Created

✅ `backend/models/schemas.js` - All MongoDB schemas
✅ `backend/seed.js` - Sample data seeder
✅ `backend/.env.example` - Environment variables template
✅ `backend/models/db.js` - Updated MongoDB connection
✅ `DATABASE_SETUP.md` - Full documentation
✅ `SQL_DATABASE_ALTERNATIVE.md` - SQL alternative schemas

You're ready to go! 🚀
