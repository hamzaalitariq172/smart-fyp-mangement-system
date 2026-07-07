const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
  try {
    const query = { isActive: true };
    if (req.user.role !== 'admin') {
      query.$or = [{ targetRole: 'all' }, { targetRole: req.user.role }];
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetRole } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      targetRole: targetRole || 'all',
      createdBy: req.user._id,
    });
    const populated = await Announcement.findById(announcement._id).populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
