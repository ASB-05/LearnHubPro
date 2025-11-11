const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { WebSocketServer } = require('ws');

// --- Server & Port Setup ---
const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// ❗️❗️ REPLACE THIS WITH YOUR MONGODB ATLAS CONNECTION STRING ❗️❗️
const MONGO_URI = "mongodb://localhost:27017/"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Database Models (Mongoose) ---

// User Model (for Login & Roles)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
  // In a real app, you'd have a hashed password
});
const User = mongoose.model('User', userSchema);

// Course Model (for Dashboards)
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // other fields like modules, videos, etc.
});
const Course = mongoose.model('Course', courseSchema);

// Chat Message Model
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);


// --- API Endpoints ---

// POST /api/login
// Simulates login. Finds or creates a user based on the selected role.
app.post('/api/login', async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }

  // Use a generic username based on role for this example
  const username = `${role}User`;

  try {
    let user = await User.findOne({ username: username, role: role });

    if (!user) {
      console.log(`No user found, creating new ${role} user...`);
      user = new User({ username: username, role: role });
      await user.save();
    }

    console.log('Login successful:', user);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/dashboard
// Fetches dashboard data based on the user's role
app.get('/api/dashboard', async (req, res) => {
  const { role } = req.query; // e.g., /api/dashboard?role=student

  let data = {};
  try {
    if (role === 'student') {
      // Students see all available courses
      const courses = await Course.find().populate('instructor', 'username');
      data = { 
        message: "Welcome Student!",
        courses: courses 
      };
    } else if (role === 'instructor') {
      // Instructors only see their courses (or all for this example)
      const courses = await Course.find().populate('instructor', 'username');
      data = { 
        message: "Welcome Instructor!",
        courses: courses,
        students: 150 // dummy data
      };
    } else if (role === 'admin') {
      // Admins see all users and courses
      const users = await User.find();
      const courses = await Course.find();
      data = { 
        message: "Welcome Admin!",
        totalUsers: users.length,
        totalCourses: courses.length,
        users: users
      };
    } else {
      return res.status(400).json({ message: 'Invalid role.' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Dashboard data error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard data.' });
  }
});

// GET /api/chat/history
// Fetches the last 50 chat messages
app.get('/api/chat/history', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching chat history.' });
  }
});


// --- Payment Endpoint (from previous step) ---
app.post('/api/payment', (req, res) => {
  console.log('Payment request received:', req.body);
  const { invoiceId, amount, service, paymentMethodType } = req.body;

  if (!invoiceId || !amount || !paymentMethodType) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required payment information.' 
    });
  }

  console.log(`Processing payment of $${amount} for ${service}...`);
  setTimeout(() => {
    const transactionId = `TXN-${Date.now()}`;
    console.log(`Payment successful! Transaction ID: ${transactionId}`);
    res.status(200).json({
      success: true,
      transactionId: transactionId,
      message: `Payment for invoice ${invoiceId} processed successfully.`
    });
  }, 2000);
});


// --- HTTP Server & WebSocket Server Setup ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket Connection Logic
wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected.');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);

      if (data.type === 'chatMessage') {
        // Save message to MongoDB
        const newMessage = new Message({
          username: data.payload.username,
          role: data.payload.role,
          text: data.payload.text,
        });
        await newMessage.save();

        // Broadcast the saved message (with timestamp) to all connected clients
        const messageToBroadcast = JSON.stringify({
          type: 'newChatMessage',
          payload: newMessage
        });

        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(messageToBroadcast);
          }
        });
      }
    } catch (err) {
      console.error('WebSocket message processing error:', err);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected.');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// --- Start the Server ---
server.listen(PORT, () => {
  console.log(`✅ Backend server (HTTP + WS) running on http://localhost:${PORT}`);
});

// --- Helper: Seed database with initial data ---
async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();

    if (userCount > 0 && courseCount > 0) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database...');
    await User.deleteMany({});
    await Course.deleteMany({});

    const instructor = new User({ username: 'instructorUser', role: 'instructor' });
    await instructor.save();

    const courses = [
      { title: 'React for Beginners', description: 'Learn the fundamentals of React.', instructor: instructor._id },
      { title: 'Advanced Node.js', description: 'Master Node.js and backend development.', instructor: instructor._id },
      { title: 'MongoDB Essentials', description: 'Understand NoSQL databases with MongoDB.', instructor: instructor._id },
    ];
    await Course.insertMany(courses);

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Database seeding error:', err);
  }
}

// Seed the database on server start
seedDatabase();