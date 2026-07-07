const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['progress', 'final', 'evaluation'],
      default: 'progress',
    },
    fileUrl: {
      type: String,
    },
    origFileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'approved', 'rejected'],
      default: 'submitted',
    },
    feedback: {
      type: String,
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
