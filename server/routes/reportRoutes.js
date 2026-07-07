const express = require('express');
const router = express.Router();
const { getReports, submitReport, reviewReport, downloadReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.get('/', getReports);
router.post('/', authorize('student'), upload.single('file'), submitReport);
router.get('/:id/download', downloadReport);
router.put('/:id/review', authorize('supervisor', 'admin'), reviewReport);

module.exports = router;
