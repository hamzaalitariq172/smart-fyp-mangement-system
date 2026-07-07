const express = require('express');
const router = express.Router();
const { getAdminDashboard, getSupervisorDashboard, getStudentDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/supervisor', protect, authorize('supervisor'), getSupervisorDashboard);
router.get('/student', protect, authorize('student'), getStudentDashboard);

module.exports = router;
