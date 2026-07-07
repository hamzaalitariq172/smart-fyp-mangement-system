const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportGenController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin'), generateReport);

module.exports = router;
