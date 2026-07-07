const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Notification = require('../models/Notification');

const checkDeadlines = async (req, res) => {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const overdue = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const query = {};
    if (req.user.role === 'student') {
      query.assignedTo = req.user._id;
    } else if (req.user.role === 'supervisor') {
      query.assignedBy = req.user._id;
    }

    const [tasksDue24h, tasksDue3d, overdueTasks, milestonesDue24h, overdueMilestones] = await Promise.all([
      Task.find({ ...query, dueDate: { $gte: now, $lte: in24h }, status: { $ne: 'completed' } })
        .populate('project', 'title'),
      Task.find({ ...query, dueDate: { $gte: in24h, $lte: in3days }, status: { $ne: 'completed' } })
        .populate('project', 'title'),
      Task.find({ ...query, dueDate: { $lte: overdue }, status: { $ne: 'completed' } })
        .populate('project', 'title'),
      Milestone.find({ dueDate: { $gte: now, $lte: in24h }, status: { $ne: 'completed' } })
        .populate('project', 'title'),
      Milestone.find({ dueDate: { $lte: overdue }, status: { $ne: 'completed' } })
        .populate('project', 'title'),
    ]);

    for (const task of overdueTasks) {
      const exists = await Notification.findOne({ user: req.user._id, title: 'Task Overdue', link: `/tasks/${task._id}` });
      if (!exists) {
        await Notification.create({
          user: req.user._id,
          title: 'Task Overdue',
          message: `Task "${task.title}" is overdue!`,
          type: 'error',
          link: `/tasks/${task._id}`,
        });
      }
    }

    res.json({
      dueWithin24h: tasksDue24h,
      dueWithin3days: tasksDue3d,
      overdue: overdueTasks,
      milestonesDue24h,
      overdueMilestones,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkDeadlines };
