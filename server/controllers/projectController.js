const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { createActivityLog, createNotification } = require('../utils/helpers');

const getProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (req.user.role === 'student') {
      query.teamMembers = req.user._id;
    } else if (req.user.role === 'supervisor') {
      query.supervisor = req.user._id;
    }

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('teamMembers', 'name email regNo')
      .populate('supervisor', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email regNo avatar')
      .populate('supervisor', 'name email department')
      .populate('feedbacks.by', 'name');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, technologies } = req.body;
    const project = await Project.create({
      title,
      description,
      technologies: technologies || [],
      teamMembers: [req.user._id],
      status: 'pending',
    });

    await createActivityLog(req.user._id, 'create_project', `Created project: ${title}`, 'Project', project._id);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.supervisor = supervisorId;
    await project.save();

    await createNotification(
      supervisorId,
      'Supervisor Request',
      `A student has requested you as supervisor for project: ${project.title}`,
      'info',
      `/supervisor/projects/${project._id}`
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveProject = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const project = await Project.findById(req.params.id).populate('teamMembers', 'email name');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.status = status;
    if (feedback) {
      project.feedbacks.push({ comment: feedback, by: req.user._id, date: new Date() });
    }
    await project.save();

    for (const member of project.teamMembers) {
      await createNotification(
        member._id,
        `Project ${status}`,
        `Your project "${project.title}" has been ${status}`,
        status === 'approved' ? 'success' : 'error',
        `/student/projects/${project._id}`
      );
    }

    await createActivityLog(req.user._id, `${status}_project`, `${status} project: ${project.title}`, 'Project', project._id);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { comment } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.feedbacks.push({ comment, by: req.user._id, date: new Date() });
    await project.save();

    const populated = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email')
      .populate('feedbacks.by', 'name');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { type, name } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.documents.push({
      name: name || req.file.originalname,
      url: req.file.path,
      type: type || 'other',
    });
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { supervisor: supervisorId, status: 'approved' },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    const total = await Project.countDocuments();
    res.json({ stats, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  requestSupervisor,
  approveProject,
  addFeedback,
  uploadDocument,
  assignSupervisor,
  getProjectStats,
};
