const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getTaskById } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', authorize('supervisor'), createTask);
router.put('/:id', updateTask);
router.delete('/:id', authorize('supervisor'), deleteTask);

module.exports = router;
