const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar role')
      .populate('lastMessage')
      .populate('project', 'title')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConversation = async (req, res) => {
  try {
    const participantIds = req.body.participantIds || req.body.participants || [];
    const { project } = req.body;
    const allParticipants = [...new Set([req.user._id.toString(), ...participantIds])];

    const existingConv = await Conversation.findOne({
      participants: { $all: allParticipants, $size: allParticipants.length },
    });

    if (existingConv) return res.json(existingConv);

    const conversation = await Conversation.create({
      participants: allParticipants,
      project,
    });

    const populated = await Conversation.findById(conversation._id)
      .populate('participants', 'name email avatar role');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user._id,
      content,
    });

    await Conversation.findByIdAndUpdate(req.params.conversationId, { lastMessage: message._id });

    const populated = await Message.findById(message._id).populate('sender', 'name email avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, createConversation, getMessages, sendMessage };
