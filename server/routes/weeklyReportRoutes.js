const express = require('express');
const router = express.Router();
const { getWeeklyReports, createWeeklyReport, updateWeeklyReport, deleteWeeklyReport } = require('../controllers/weeklyReportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getWeeklyReports);
router.post('/', authorize('student'), createWeeklyReport);
router.put('/:id', authorize('student', 'supervisor'), updateWeeklyReport);
router.delete('/:id', authorize('student', 'admin'), deleteWeeklyReport);

module.exports = router;
