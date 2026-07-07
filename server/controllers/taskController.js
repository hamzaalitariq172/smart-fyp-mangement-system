const Task = require('../models/Task');
const Project = require('../models/Project');
const { createNotification, calculateProgress } = require('../utils/helpers');

const getTasks = async (req, res) => {
  try {
    const { status, project, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (project) query.project = project;

    if (req.user.role === 'student') {
      query.assignedTo = req.user._id;
    } else if (req.user.role === 'supervisor') {
      query.assignedBy = req.user._id;
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ tasks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, project } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
      priority: priority || 'medium',
    });

    await createNotification(
      assignedTo,
      'New Task Assigned',
      `You have a new task: ${title}`,
      'info',
      `/student/tasks`
    );

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('project', 'title');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.status === 'completed') {
      task.completedAt = new Date();
      await task.save();

      const tasks = await Task.find({ project: task.project });
      const progress = calculateProgress(tasks);
      await Project.findByIdAndUpdate(task.project, { progress });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('project', 'title');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskById };
