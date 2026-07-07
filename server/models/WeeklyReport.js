const mongoose = require('mongoose');

const weeklyReportSchema = mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  workDone: { type: String },
  workPlanned: { type: String },
  challenges: { type: String },
  hoursSpent: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed'],
    default: 'draft',
  },
  feedback: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WeeklyReport', weeklyReportSchema);
