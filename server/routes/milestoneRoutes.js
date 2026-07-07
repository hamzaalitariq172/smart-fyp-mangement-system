const express = require('express');
const router = express.Router();
const { getMilestones, createMilestone, updateMilestone, deleteMilestone } = require('../controllers/milestoneController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getMilestones);
router.post('/', authorize('supervisor', 'admin', 'student'), createMilestone);
router.put('/:id', authorize('supervisor', 'admin', 'student'), updateMilestone);
router.delete('/:id', authorize('supervisor', 'admin'), deleteMilestone);

module.exports = router;
