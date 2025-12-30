require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { initializeSocket } = require('./services/socketService');
const NotificationService = require('./services/notificationService');
const LevelService = require('./services/levelService');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Initialize socket service
initializeSocket(io);

// Initialize notification service
const notificationService = new NotificationService(io);

// Initialize level service
const levelService = new LevelService(io);

// Make services accessible to routes
app.set('io', io);
app.set('notificationService', notificationService);
app.set('levelService', levelService);

connectDB();

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // serve resumes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// Initialize ratings routes with services
const ratingsRouter = require('./routes/ratings');
ratingsRouter.setServices({ levelService, notificationService });
app.use('/api/ratings', ratingsRouter);

app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/wallet', require('./routes/wallet'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ msg: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server running on ${PORT} with WebSocket support`));
