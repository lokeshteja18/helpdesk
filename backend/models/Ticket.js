import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["account", "technical", "billing", "feature-request", "bug", "security", "other"],
      default: "other"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "on-hold", "resolved", "closed"],
      default: "open",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: [
      {
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    resolution: String,
    resolvedAt: Date,
    rating: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

// Pre-save hook to auto-generate ticket number
ticketSchema.pre('save', async function() {
  if (!this.ticketNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketNumber = `TKT-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
});

export default mongoose.model("Ticket", ticketSchema);
