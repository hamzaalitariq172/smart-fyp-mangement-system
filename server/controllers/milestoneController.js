const Milestone = require('../models/Milestone');

const getMilestones = async (req, res) => {
  try {
    const query = {};
    if (req.query.project) query.project = req.query.project;
    const milestones = await Milestone.find(query).sort({ order: 1, dueDate: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMilestone = async (req, res) => {
  try {
    const { project, title, description, dueDate, order } = req.body;
    const milestone = await Milestone.create({ project, title, description, dueDate, order });
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ message: 'Milestone removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMilestones, createMilestone, updateMilestone, deleteMilestone };
