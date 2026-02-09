import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ==================== USER SCHEMA ====================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin', 'superadmin'],
      default: 'user',
    },
    department: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Methods
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Indexes - removed duplicate email index as it's already defined in schema
userSchema.index({ role: 1 });

// ==================== TICKET SCHEMA ====================
const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'account',
        'technical',
        'billing',
        'feature-request',
        'bug',
        'security',
        'other',
      ],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'on-hold', 'resolved', 'closed'],
      default: 'open',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: [
      {
        agentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolution: {
      type: String,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate ticket number
ticketSchema.pre('save', async function () {
  if (!this.isNew) return;
  try {
    const count = await mongoose.model('Ticket').countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.ticketNumber = `TKT-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  } catch (error) {
    throw error;
  }
});

// Indexes - removed duplicate ticketNumber index as sparse unique already creates it
ticketSchema.index({ userId: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });

// ==================== ADMIN SETTINGS SCHEMA ====================
const adminSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: mongoose.Schema.Types.Mixed,
    description: String,
  },
  { timestamps: true }
);

// ==================== ACTIVITY LOG SCHEMA ====================
const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resourceType: String,
    resourceId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true }
);

activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ createdAt: 1 });

// ==================== EXPORT MODELS ====================
export const User = mongoose.model('User', userSchema);
export const Ticket = mongoose.model('Ticket', ticketSchema);
export const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);
export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
