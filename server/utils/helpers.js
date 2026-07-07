const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

const createActivityLog = async (userId, action, description, resource, resourceId) => {
  try {
    await ActivityLog.create({ user: userId, action, description, resource, resourceId });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

const createNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    await Notification.create({ user: userId, title, message, type, link });
  } catch (error) {
    console.error('Notification error:', error);
  }
};

const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
};

module.exports = { createActivityLog, createNotification, calculateProgress };
