// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const { Server } = require('socket.io');

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO with proper CORS for frontend (both 3000 & 5173)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000",process.env.FRONTEND_URL,"https://lmsmbu-backend1728.onrender.com"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ API routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/enrollments', require('./src/routes/enrollments'));
app.use('/api/assignments', require('./src/routes/assignments'));
app.use('/api/submissions', require('./src/routes/submissions'));

// ✅ Health check endpoint
app.get('/', (req, res) => res.send('LMS Backend running successfully 🚀'));

// ✅ Socket.IO logic
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // --- Course specific chat rooms ---
  socket.on('joinCourse', ({ courseId }) => {
    socket.join(courseId);
    console.log(`User ${socket.id} joined course: ${courseId}`);
  });

  socket.on('courseMessage', ({ courseId, message, user }) => {
    const msgData = { message, user, createdAt: new Date() };
    io.to(courseId).emit('courseMessage', msgData);
  });

  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", data);
  });

  // --- Global public chat (general room) ---
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

module.exports = { io };
