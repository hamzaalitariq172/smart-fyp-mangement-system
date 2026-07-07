const express = require('express');
const router = express.Router();
const {
  getUsers, getUserById, createUser, updateUser, deleteUser, getSupervisors, getStudents,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/supervisors', getSupervisors);
router.get('/students', getStudents);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUserById);
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
