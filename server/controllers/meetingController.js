const Meeting = require('../models/Meeting');
const { createNotification } = require('../utils/helpers');

const getMeetings = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      query.attendees = req.user._id;
    } else if (req.user.role === 'supervisor') {
      query.createdBy = req.user._id;
    }

    const meetings = await Meeting.find(query)
      .populate('attendees', 'name email')
      .populate('createdBy', 'name')
      .populate('project', 'title')
      .sort({ date: -1 });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMeeting = async (req, res) => {
  try {
    const { title, date, duration, notes, link, project, attendees } = req.body;

    const meeting = await Meeting.create({
      title,
      date,
      duration,
      notes,
      link,
      project,
      attendees: attendees || [],
      createdBy: req.user._id,
    });

    for (const attendeeId of attendees) {
      await createNotification(
        attendeeId,
        'Meeting Scheduled',
        `Meeting: ${title} on ${new Date(date).toLocaleDateString()}`,
        'info',
        '/student/meetings'
      );
    }

    const populated = await Meeting.findById(meeting._id)
      .populate('attendees', 'name email')
      .populate('createdBy', 'name')
      .populate('project', 'title');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ message: 'Meeting removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMeetings, createMeeting, updateMeeting, deleteMeeting };
