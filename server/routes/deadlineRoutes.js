const express = require('express');
const router = express.Router();
const { checkDeadlines } = require('../controllers/deadlineController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', checkDeadlines);

module.exports = router;
