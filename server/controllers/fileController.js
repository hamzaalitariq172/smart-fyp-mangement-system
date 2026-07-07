const Project = require('../models/Project');

const downloadFile = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const doc = project.documents.id(docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.download(doc.url, doc.name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).select('documents title');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project.documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProjectFile = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.documents = project.documents.filter((d) => d._id.toString() !== docId);
    await project.save();
    res.json({ message: 'File removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { downloadFile, getProjectFiles, deleteProjectFile };
