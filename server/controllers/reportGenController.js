const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const Report = require('../models/Report');

const generateReport = async (req, res) => {
  try {
    const { type, format = 'json' } = req.query;
    let data = {};

    switch (type) {
      case 'projects':
        data = await Project.find()
          .populate('teamMembers', 'name email')
          .populate('supervisor', 'name email')
          .sort({ createdAt: -1 });
        break;
      case 'students':
        data = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
        break;
      case 'supervisors':
        data = await User.find({ role: 'supervisor' }).select('-password').sort({ name: 1 });
        break;
      case 'tasks':
        data = await Task.find()
          .populate('assignedTo', 'name')
          .populate('project', 'title')
          .sort({ createdAt: -1 });
        break;
      case 'meetings':
        data = await Meeting.find()
          .populate('attendees', 'name')
          .populate('project', 'title')
          .sort({ date: -1 });
        break;
      case 'submissions':
        data = await Report.find({ status: { $ne: 'draft' } })
          .populate('project', 'title')
          .populate('evaluatedBy', 'name')
          .sort({ submissionDate: -1 });
        break;
      case 'summary':
        data = {
          totalProjects: await Project.countDocuments(),
          totalStudents: await User.countDocuments({ role: 'student' }),
          totalSupervisors: await User.countDocuments({ role: 'supervisor' }),
          pendingProjects: await Project.countDocuments({ status: 'pending' }),
          completedProjects: await Project.countDocuments({ status: 'completed' }),
          totalTasks: await Task.countDocuments(),
          completedTasks: await Task.countDocuments({ status: 'completed' }),
          totalMeetings: await Meeting.countDocuments(),
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({ type, generatedAt: new Date().toISOString(), data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport };
