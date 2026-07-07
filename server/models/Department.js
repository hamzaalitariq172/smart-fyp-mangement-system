const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
