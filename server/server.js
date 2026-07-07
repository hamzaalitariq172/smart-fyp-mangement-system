const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

dotenv.config();

const app = express();
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] },
});

connectDB();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Smart FYP Management System API' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/milestones', require('./routes/milestoneRoutes'));
app.use('/api/weekly-reports', require('./routes/weeklyReportRoutes'));
app.use('/api/projects', require('./routes/fileRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/reports/generate', require('./routes/reportGenRoutes'));
app.use('/api/deadlines', require('./routes/deadlineRoutes'));

app.use(errorHandler);

const onlineUsers = new Set();

io.on('connection', (socket) => {
  let currentUserId = null;

  socket.on('join', (userId) => {
    currentUserId = userId;
    socket.join(userId);
    onlineUsers.add(userId.toString());
    socket.broadcast.emit('userOnline', userId.toString());
  });

  socket.on('sendMessage', async (data) => {
    try {
      const message = await Message.create({
        conversation: data.conversationId,
        sender: data.senderId,
        content: data.content || '',
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
      });

      await Conversation.findByIdAndUpdate(data.conversationId, { lastMessage: message._id });

      const populated = await Message.findById(message._id).populate('sender', 'name email avatar');

      const conversation = await Conversation.findById(data.conversationId);
      if (conversation) {
        conversation.participants.forEach((participant) => {
          const pid = participant.toString();
          io.to(pid).emit('newMessage', populated.toObject());
        });
      }

      socket.emit('messageSent', populated.toObject());
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('messageError', { error: error.message });
    }
  });

  socket.on('typing', ({ conversationId, senderId }) => {
    socket.broadcast.emit('userTyping', { conversationId, senderId });
  });

  socket.on('stopTyping', ({ conversationId, senderId }) => {
    socket.broadcast.emit('userStoppedTyping', { conversationId, senderId });
  });

  socket.on('markRead', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, isRead: false },
        { isRead: true }
      );
      socket.broadcast.emit('messagesRead', { conversationId, userId });
    } catch (error) {
      console.error('markRead error:', error);
    }
  });

  socket.on('disconnect', () => {
    if (currentUserId) {
      onlineUsers.delete(currentUserId.toString());
      socket.broadcast.emit('userOffline', currentUserId.toString());
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
