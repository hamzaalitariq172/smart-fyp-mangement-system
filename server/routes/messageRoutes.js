const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

module.exports = router;
