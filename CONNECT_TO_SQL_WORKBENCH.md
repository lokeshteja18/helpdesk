# Connect Your Project to SQL Workbench (MySQL)

## 📋 Step 1: Install MySQL & SQL Workbench

### Option 1: Download MySQL Community Edition (Recommended)
1. Go to [mysql.com/downloads/community](https://mysql.com/downloads/community)
2. Download **MySQL Community Server**
3. Run installer and follow setup wizard
4. Remember the password you set for root user
5. MySQL will run on port `3306` by default

### Option 2: Download MySQL Installer Bundle (Includes Workbench)
1. Go to [mysql.com/downloads/installer](https://mysql.com/downloads/installer)
2. Download **MySQL Installer for Windows**
3. Run and select:
   - MySQL Server
   - MySQL Workbench
   - MySQL Shell
4. Complete installation

### Verify Installation
```bash
mysql --version
```

---

## 🔧 Step 2: Install SQL Workbench

### Download
1. Go to [mysql.com/products/workbench](https://mysql.com/products/workbench)
2. Download **MySQL Workbench**
3. Run installer and follow setup

### Launch Workbench
- Search for "MySQL Workbench" in Windows
- Open it

---

## 🗄️ Step 3: Create Database in Workbench

### Step 3.1: Connect to MySQL Server
1. Open MySQL Workbench
2. Click on **MySQL Connections** or **+** button
3. Enter:
   - **Connection Name**: `IBM Helpdesk`
   - **Hostname**: `127.0.0.1`
   - **Port**: `3306`
   - **Username**: `root`
   - **Password**: (Your MySQL root password)
4. Click **OK**

### Step 3.2: Create New Database
1. Double-click the connection to open it
2. Right-click in left panel → **Create Schema**
3. Name: `ibm_helpdesk`
4. Click **Apply**

### Step 3.3: Create Tables
Go to [SQL_DATABASE_ALTERNATIVE.md](../SQL_DATABASE_ALTERNATIVE.md) and copy the MySQL SQL code:

1. Go to **File** → **New Query Tab**
2. Paste the SQL code from the file
3. Click **Execute** (or press Ctrl+Enter)
4. Tables created! ✅

---

## 🔌 Step 4: Update Backend to Use MySQL

### Step 4.1: Install Sequelize (SQL ORM)
```bash
cd backend
npm install sequelize mysql2 dotenv
```

### Step 4.2: Update `.env` File
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ibm_helpdesk

PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Step 4.3: Create New Database Connection File

Create `backend/models/db_sequelize.js`:

```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

// Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');
    return sequelize;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

export default sequelize;
```

---

## 🏗️ Step 5: Create Sequelize Models

### Step 5.1: Create `backend/models/User_SQL.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from './db_sequelize.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'agent', 'admin', 'superadmin'),
    defaultValue: 'user'
  },
  department: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Method to compare passwords
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
```

### Step 5.2: Create `backend/models/Ticket_SQL.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from './db_sequelize.js';
import User from './User_SQL.js';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticketNumber: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('account', 'technical', 'billing', 'feature-request', 'bug', 'security', 'other'),
    defaultValue: 'other'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'in-progress', 'on-hold', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tickets',
  timestamps: false
});

// Associations
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'agent' });

export default Ticket;
```

---

## 🛠️ Step 6: Update Controllers for SQL

### Create `backend/controllers/authController_SQL.js`

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User_SQL.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret_key_change_this',
    { expiresIn: '24h' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user',
      isActive: true
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_this');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Password reset instructions sent to email'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};
```

---

## 🗂️ Step 7: Create SQL Seed Script

Create `backend/seed_sql.js`:

```javascript
import sequelize, { connectDB } from './models/db_sequelize.js';
import User from './models/User_SQL.js';
import Ticket from './models/Ticket_SQL.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding SQL database...');

    // Sync database (create tables if not exist)
    await sequelize.sync({ alter: true });

    // Clear existing data
    await Ticket.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create users
    const users = await User.bulkCreate([
      {
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: 'superadmin123',
        role: 'superadmin',
        phone: '+1234567890',
        department: 'Management',
        isActive: true
      },
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567891',
        department: 'Management',
        isActive: true
      },
      {
        name: 'Agent John',
        email: 'agent1@gmail.com',
        password: 'agent123',
        role: 'agent',
        phone: '+1234567892',
        department: 'Support',
        isActive: true
      },
      {
        name: 'Agent Sarah',
        email: 'agent2@gmail.com',
        password: 'agent123',
        role: 'agent',
        phone: '+1234567893',
        department: 'Support',
        isActive: true
      },
      {
        name: 'John Doe',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567894',
        department: 'Operations',
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@gmail.com',
        password: 'jane123',
        role: 'user',
        phone: '+1234567895',
        department: 'Marketing',
        isActive: true
      },
      {
        name: 'Robert Wilson',
        email: 'robert@gmail.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567896',
        department: 'HR',
        isActive: true
      }
    ]);

    console.log('✅ Users created:', users.length);

    // Create tickets
    const tickets = await Ticket.bulkCreate([
      {
        ticketNumber: 'TKT-202602-00001',
        title: 'Login Issue',
        description: 'Cannot login to my account',
        category: 'account',
        priority: 'high',
        status: 'open',
        userId: users[4].id,
        assignedTo: users[2].id
      },
      {
        ticketNumber: 'TKT-202602-00002',
        title: 'Password Reset',
        description: 'Need to reset password',
        category: 'security',
        priority: 'medium',
        status: 'in-progress',
        userId: users[5].id,
        assignedTo: users[2].id
      },
      {
        ticketNumber: 'TKT-202602-00003',
        title: 'Dashboard Not Loading',
        description: 'Dashboard page is blank',
        category: 'technical',
        priority: 'high',
        status: 'open',
        userId: users[4].id,
        assignedTo: users[3].id
      },
      {
        ticketNumber: 'TKT-202602-00004',
        title: 'Feature Request: Dark Mode',
        description: 'Would like dark mode option',
        category: 'feature-request',
        priority: 'low',
        status: 'open',
        userId: users[5].id,
        assignedTo: null
      },
      {
        ticketNumber: 'TKT-202602-00005',
        title: 'Billing Query',
        description: 'Why was I charged twice',
        category: 'billing',
        priority: 'high',
        status: 'in-progress',
        userId: users[6].id,
        assignedTo: users[2].id
      }
    ]);

    console.log('✅ Tickets created:', tickets.length);
    console.log('🎉 SQL database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
```

---

## 📝 Step 8: Update package.json

Add seed script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed_sql.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "sequelize": "^6.33.0",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"
  }
}
```

---

## 🚀 Step 9: Update server.js for SQL

Replace the MongoDB connection with:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './models/db_sequelize.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Connect to MySQL
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Server running on http://localhost:5000');
    app.listen(PORT, () => {
      console.log(`🚀 Ready to accept requests!`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

startServer();
```

---

## 🔄 Step 10: Test SQL Connection

### Run Seed
```bash
npm run seed
```

### Check in Workbench
1. Open SQL Workbench
2. Double-click connection
3. Go to **Schemas** → **ibm_helpdesk**
4. Expand **Tables**
5. See: `users`, `tickets` tables with data

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"user123"}'
```

---

## 📊 Quick Comparison

| Feature | MongoDB | MySQL |
|---------|---------|-------|
| Type | NoSQL Document | Relational SQL |
| Connection | Mongoose | Sequelize |
| Setup | More complex | Simpler |
| Relationships | Manual | Automatic |
| Queries | JSON-like | SQL |
| UI Tool | Compass | Workbench |
| Port | 27017 | 3306 |

---

## 🎯 Summary

**MongoDB Path** (Current - Already Done)
- ✅ Backend connected to MongoDB
- ✅ No changes needed

**SQL Path** (What to do now)
1. ✅ Install MySQL + Workbench
2. ✅ Create database in Workbench
3. Create SQL models (User_SQL.js, Ticket_SQL.js)
4. Create SQL controllers
5. Update server.js to use Sequelize
6. Run seed_sql.js
7. Test with frontend

---

## 🆘 Troubleshooting

### "Cannot connect to MySQL"
- Verify MySQL is running
- Check DB_HOST, DB_PORT in .env
- Check username/password

### "Table doesn't exist"
- Run: `npm run seed`
- Seeds will create tables

### "Port 3306 already in use"
- Change port in .env
- Or kill process on 3306

---

**Choose your path and let me know which database you want to use!**
