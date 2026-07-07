const WeeklyReport = require('../models/WeeklyReport');

const getWeeklyReports = async (req, res) => {
  try {
    const query = {};
    if (req.query.project) query.project = req.query.project;
    if (req.user.role === 'student') query.student = req.user._id;
    const reports = await WeeklyReport.find(query)
      .populate('student', 'name email')
      .populate('project', 'title')
      .sort({ weekNumber: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWeeklyReport = async (req, res) => {
  try {
    const { project, weekNumber, startDate, endDate, workDone, workPlanned, challenges, hoursSpent } = req.body;
    const existing = await WeeklyReport.findOne({ project, student: req.user._id, weekNumber });
    if (existing) return res.status(400).json({ message: 'Weekly report for this week already exists' });
    const report = await WeeklyReport.create({
      project, student: req.user._id, weekNumber, startDate, endDate,
      workDone, workPlanned, challenges, hoursSpent, status: 'submitted',
    });
    const populated = await WeeklyReport.findById(report._id).populate('student', 'name email').populate('project', 'title');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWeeklyReport = async (req, res) => {
  try {
    const report = await WeeklyReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('student', 'name email').populate('project', 'title');
    if (!report) return res.status(404).json({ message: 'Weekly report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWeeklyReport = async (req, res) => {
  try {
    const report = await WeeklyReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Weekly report not found' });
    res.json({ message: 'Weekly report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWeeklyReports, createWeeklyReport, updateWeeklyReport, deleteWeeklyReport };
