
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const http = require('http');
// const { Server } = require('socket.io');
// const cron = require('node-cron');
// const path = require('path');
// const Event = require('./models/Event');
// const cloudinaryRoutes = require('./routes/cloudinaryRoutes'); // Adjust the path as needed

// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const postRoutes = require('./routes/postRoutes');
// const spotifyRoutes = require('./routes/spotifyRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const commentRoutes = require('./routes/commentRoutes');

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001', 'https://rave-connect.onrender.com'],
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// app.use(express.json());

// // CORS configuration
// const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://rave-connect.onrender.com'];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true); // Allow requests with allowed origin
//     } else {
//       callback(new Error('Not allowed by CORS')); // Block others
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight requests

// // Mongoose connection with strictQuery option
// mongoose.set('strictQuery', false);
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err.message));

// // Optional: Listen for MongoDB connection events
// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to DB');
// });
// mongoose.connection.on('error', (err) => {
//   console.error('Mongoose connection error:', err.message);
// });
// mongoose.connection.on('disconnected', () => {
//   console.log('Mongoose disconnected from DB');
// });

// // Graceful shutdown for MongoDB and WebSocket
// process.on('SIGINT', async () => {
//   console.log('Shutting down...');
//   io.close(() => {
//     console.log('Socket.io server closed');
//   });
//   await mongoose.connection.close();
//   console.log('Mongoose connection closed');
//   process.exit(0);
// });

// // Set up API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/spotify', spotifyRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/cloudinary', cloudinaryRoutes);

// // Serve static files from the React app (if applicable)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => {
//     res.send('API Running');
//   });
// }

// // Cron job to delete events 12 hours after they end
// cron.schedule('0 * * * *', async () => {
//   const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
//   console.log(`Cron job running at ${new Date().toISOString()}`);
//   try {
//     const result = await Event.deleteMany({ date: { $lt: twelveHoursAgo } });
//     console.log(`Deleted ${result.deletedCount} events that occurred 12+ hours ago.`);
//   } catch (err) {
//     console.error('Error deleting old events:', err.message);
//   }
// });

// // WebSocket events
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('join', (userId) => {
//     socket.join(userId);
//     console.log(`User with ID: ${userId} joined their room`);
//   });

//   socket.on('sendNotification', (data) => {
//     io.to(data.userId).emit('notification', {
//       message: data.message,
//       type: data.type,
//       _id: new Date().getTime().toString(),
//     });
//   });

//   socket.on('disconnect', (reason) => {
//     console.log(`User disconnected (${socket.id}):`, reason);
//   });

//   socket.on('error', (err) => {
//     console.error(`Socket error on ${socket.id}:`, err.message);
//   });
// });

// // Ensure the app listens on the PORT provided by the environment
// const PORT = process.env.PORT || 5002;
// server.listen(PORT, (err) => {
//   if (err) {
//     console.error('Server failed to start:', err);
//   } else {
//     console.log(`Server running on port ${PORT}`);
//   }
// });



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const path = require('path');
const Event = require('./models/Event');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const postRoutes = require('./routes/postRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://rave-connect.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://rave-connect.onrender.com'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Mongoose connection
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// MongoDB connection events
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err.message));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected from DB'));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  io.close(() => console.log('Socket.io server closed'));
  await mongoose.connection.close();
  console.log('Mongoose connection closed');
  process.exit(0);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/notifications', notificationRoutes(io)); // Pass io to notificationRoutes

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => res.send('API Running'));
}

// Cron job to delete events 12 hours after they end
cron.schedule('0 * * * *', async () => {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  console.log(`Cron job running at ${new Date().toISOString()}`);
  try {
    const result = await Event.deleteMany({ date: { $lt: twelveHoursAgo } });
    console.log(`Deleted ${result.deletedCount} events that occurred 12+ hours ago.`);
  } catch (err) {
    console.error('Error deleting old events:', err.message);
  }
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User with ID: ${userId} joined their room`);
  });

  socket.on('sendNotification', (data) => {
    io.to(data.userId).emit('notification', {
      message: data.message,
      type: data.type,
      _id: new Date().getTime().toString(),
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected (${socket.id}):`, reason);
  });

  socket.on('error', (err) => {
    console.error(`Socket error on ${socket.id}:`, err.message);
  });
});

// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


