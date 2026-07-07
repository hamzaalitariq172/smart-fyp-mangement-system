const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');
const Project = require('../models/Project');
const { createNotification } = require('../utils/helpers');

const getReports = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      const projects = await Project.find({ teamMembers: req.user._id }).select('_id');
      query.project = { $in: projects.map((p) => p._id) };
    } else if (req.user.role === 'supervisor') {
      const projects = await Project.find({ supervisor: req.user._id }).select('_id');
      query.project = { $in: projects.map((p) => p._id) };
    }

    const reports = await Report.find(query)
      .populate('project', 'title')
      .populate('evaluatedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitReport = async (req, res) => {
  try {
    const { project, title, type } = req.body;

    const report = await Report.create({
      project,
      title,
      type: type || 'progress',
      fileUrl: req.file ? req.file.path : '',
      origFileName: req.file ? req.file.originalname : '',
      fileSize: req.file ? req.file.size : 0,
    });

    const projectData = await Project.findById(project).populate('teamMembers', '_id');
    for (const member of projectData.teamMembers) {
      await createNotification(
        member._id,
        'Report Submitted',
        `Report submitted: ${title}`,
        'success'
      );
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('project', 'supervisor teamMembers');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (!report.fileUrl) return res.status(404).json({ message: 'No file attached to this report' });

    const project = report.project;
    const isSupervisor = project?.supervisor?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isTeamMember = project?.teamMembers?.some((m) => m.toString() === req.user._id.toString());

    if (!isSupervisor && !isAdmin && !isTeamMember) {
      return res.status(403).json({ message: 'Not authorized to download this report' });
    }

    const filePath = path.resolve(report.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    const fileName = report.origFileName || `${report.title}.pdf`;
    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewReport = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, feedback, evaluatedBy: req.user._id },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const project = await Project.findById(report.project);
    if (project) {
      for (const member of project.teamMembers) {
        await createNotification(
          member._id,
          'Report Reviewed',
          `Your report "${report.title}" has been ${status}`,
          status === 'approved' ? 'success' : 'warning'
        );
      }
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports, submitReport, reviewReport, downloadReport };
