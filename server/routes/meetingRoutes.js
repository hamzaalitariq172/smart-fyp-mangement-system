const express = require('express');
const router = express.Router();
const { getMeetings, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMeetings);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

module.exports = router;
