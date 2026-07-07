const Meeting = require('../models/Meeting');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');

const getCalendarEvents = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      query.$or = [{ attendees: req.user._id }, { createdBy: req.user._id }];
    } else if (req.user.role === 'supervisor') {
      query.createdBy = req.user._id;
    }

    const [meetings, tasks, milestones] = await Promise.all([
      Meeting.find({ ...query, date: { $gte: new Date(0) } })
        .populate('project', 'title')
        .populate('createdBy', 'name'),
      Task.find(req.user.role === 'student' ? { assignedTo: req.user._id } : { assignedBy: req.user._id })
        .populate('project', 'title'),
      Milestone.find(req.query.project ? { project: req.query.project } : {})
        .populate('project', 'title'),
    ]);

    const events = [
      ...meetings.map((m) => ({
        _id: m._id,
        title: m.title,
        date: m.date,
        type: 'meeting',
        project: m.project?.title,
        status: m.status,
        duration: m.duration,
      })),
      ...tasks.map((t) => ({
        _id: t._id,
        title: t.title,
        date: t.dueDate,
        type: 'task',
        project: t.project?.title,
        status: t.status,
        priority: t.priority,
      })),
      ...milestones.map((m) => ({
        _id: m._id,
        title: m.title,
        date: m.dueDate,
        type: 'milestone',
        project: m.project?.title,
        status: m.status,
      })),
    ];

    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCalendarEvents };
