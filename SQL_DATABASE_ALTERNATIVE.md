# SQL Database Schema (PostgreSQL/MySQL Alternative)

If you prefer to use SQL instead of MongoDB, here are the schemas for PostgreSQL or MySQL:

## Using PostgreSQL

```sql
-- Create database
CREATE DATABASE ibm_helpdesk;
\c ibm_helpdesk;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin', 'superadmin')),
  department VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  avatar VARCHAR(255),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(30) DEFAULT 'other' CHECK (category IN ('account', 'technical', 'billing', 'feature-request', 'bug', 'security', 'other')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'on-hold', 'resolved', 'closed')),
  user_id INTEGER NOT NULL,
  assigned_to INTEGER,
  resolution TEXT,
  resolved_at TIMESTAMP,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Attachments table
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  agent_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin Settings table
CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Insert sample users
INSERT INTO users (name, email, password, phone, role, department) VALUES
('Super Admin', 'superadmin@gmail.com', 'hashed_password_1', '+1234567890', 'superadmin', 'Management'),
('Admin User', 'admin@gmail.com', 'hashed_password_2', '+1234567891', 'admin', 'Management'),
('Agent John', 'agent1@gmail.com', 'hashed_password_3', '+1234567892', 'agent', 'Support'),
('Agent Sarah', 'agent2@gmail.com', 'hashed_password_4', '+1234567893', 'agent', 'Support'),
('John Doe', 'user@gmail.com', 'hashed_password_5', '+1234567894', 'user', 'Operations'),
('Jane Smith', 'jane@gmail.com', 'hashed_password_6', '+1234567895', 'user', 'Marketing'),
('Robert Wilson', 'robert@gmail.com', 'hashed_password_7', '+1234567896', 'user', 'HR');

-- Insert sample tickets
INSERT INTO tickets (ticket_number, title, description, category, priority, status, user_id, assigned_to) VALUES
('TKT-202601-00001', 'Login Issue', 'Cannot login to my account', 'account', 'high', 'open', 5, 3),
('TKT-202601-00002', 'Password Reset', 'Need to reset password', 'security', 'medium', 'in-progress', 6, 3),
('TKT-202601-00003', 'Dashboard Not Loading', 'Dashboard page is blank', 'technical', 'high', 'open', 5, 4),
('TKT-202601-00004', 'Feature Request: Dark Mode', 'Would like dark mode option', 'feature-request', 'low', 'open', 6, NULL);

-- Insert admin settings
INSERT INTO admin_settings (name, value, description) VALUES
('max_open_tickets_per_agent', '10', 'Maximum number of open tickets per agent'),
('ticket_response_time_sla', '4', 'SLA response time in hours'),
('enable_email_notifications', 'true', 'Enable email notifications'),
('company_name', 'IBM Helpdesk', 'Company name'),
('support_email', 'support@ibm-helpdesk.com', 'Support email address');
```

## Using MySQL

```sql
-- Create database
CREATE DATABASE ibm_helpdesk;
USE ibm_helpdesk;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'agent', 'admin', 'superadmin') DEFAULT 'user',
  department VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  avatar VARCHAR(255),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('account', 'technical', 'billing', 'feature-request', 'bug', 'security', 'other') DEFAULT 'other',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('open', 'in-progress', 'on-hold', 'resolved', 'closed') DEFAULT 'open',
  user_id INT NOT NULL,
  assigned_to INT,
  resolution TEXT,
  resolved_at TIMESTAMP NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_ticket_number (ticket_number)
);

-- Attachments table
CREATE TABLE attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  agent_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin Settings table
CREATE TABLE admin_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  value LONGTEXT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INT,
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert sample data (same as above)
```

## Migration to SQL

If you want to switch from MongoDB to SQL, you'll need to:

1. **Install a database driver** (PostgreSQL or MySQL)
2. **Use an ORM like Sequelize or TypeORM**
3. **Update your controllers** to use the new ORM

### Example with Sequelize (SQL ORM):

```bash
npm install sequelize sequelize-cli pg pg-hstore
```

### Example with Prisma (Modern ORM):

```bash
npm install @prisma/client
npx prisma init
```

For now, **MongoDB is recommended** as it's already partially set up in your project.

To migrate later, refer back to this file or consult the ORM documentation.
