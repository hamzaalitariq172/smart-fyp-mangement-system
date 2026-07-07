const mongoose = require('mongoose');

const milestoneSchema = mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  dueDate: { type: Date },
  completedAt: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending',
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
