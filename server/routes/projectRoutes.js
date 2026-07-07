const express = require('express');
const router = express.Router();
const {
  getProjects, getProjectById, createProject, updateProject, deleteProject,
  requestSupervisor, approveProject, addFeedback, uploadDocument, assignSupervisor, getProjectStats,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/stats', authorize('admin'), getProjectStats);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authorize('student'), createProject);
router.put('/:id', updateProject);
router.delete('/:id', authorize('admin'), deleteProject);
router.post('/:id/request-supervisor', authorize('student'), requestSupervisor);
router.put('/:id/approve', authorize('admin', 'supervisor'), approveProject);
router.post('/:id/feedback', authorize('supervisor'), addFeedback);
router.post('/:id/upload', upload.single('file'), uploadDocument);
router.put('/:id/assign-supervisor', authorize('admin'), assignSupervisor);

module.exports = router;
