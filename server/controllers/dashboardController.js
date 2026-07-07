const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const Report = require('../models/Report');

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSupervisors = await User.countDocuments({ role: 'supervisor' });
    const totalProjects = await Project.countDocuments();
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const inProgressProjects = await Project.countDocuments({ status: 'in_progress' });

    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const recentProjects = await Project.find()
      .populate('teamMembers', 'name')
      .populate('supervisor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: { totalUsers, totalStudents, totalSupervisors, totalProjects, pendingProjects, completedProjects, inProgressProjects },
      projectsByStatus,
      recentProjects,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSupervisorDashboard = async (req, res) => {
  try {
    const assignedProjects = await Project.countDocuments({ supervisor: req.user._id });
    const pendingRequests = await Project.countDocuments({ supervisor: req.user._id, status: 'pending' });
    const completed = await Project.countDocuments({ supervisor: req.user._id, status: 'completed' });
    const inProgress = await Project.countDocuments({ supervisor: req.user._id, status: 'in_progress' });

    const recentProjects = await Project.find({ supervisor: req.user._id })
      .populate('teamMembers', 'name email regNo')
      .sort({ updatedAt: -1 })
      .limit(5);

    const upcomingMeetings = await Meeting.find({ createdBy: req.user._id, date: { $gte: new Date() } })
      .populate('attendees', 'name')
      .sort({ date: 1 })
      .limit(5);

    const recentNotifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: { assignedProjects, pendingRequests, completed, inProgress },
      recentProjects,
      upcomingMeetings,
      recentNotifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    const myProjects = await Project.find({ teamMembers: req.user._id });
    const totalProjects = myProjects.length;
    const pendingProjects = myProjects.filter((p) => p.status === 'pending').length;
    const approvedProjects = myProjects.filter((p) => p.status === 'approved' || p.status === 'in_progress').length;
    const completedProjects = myProjects.filter((p) => p.status === 'completed').length;

    const tasks = await Task.find({ assignedTo: req.user._id });
    const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;

    const upcomingMeetings = await Meeting.find({ attendees: req.user._id, date: { $gte: new Date() } })
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .limit(5);

    const recentNotifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const projectProgress = myProjects.map((p) => ({
      name: p.title,
      progress: p.progress,
      status: p.status,
    }));

    res.json({
      stats: { totalProjects, pendingProjects, approvedProjects, completedProjects, pendingTasks, completedTasks },
      projectProgress,
      upcomingMeetings,
      recentNotifications,
      tasks: tasks.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminDashboard, getSupervisorDashboard, getStudentDashboard };
