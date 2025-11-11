const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { WebSocketServer } = require('ws');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Server & Port Setup ---
const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- File Uploads Setup (Multer) ---

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files (uploaded content) from the 'uploads' directory
app.use('/uploads', express.static(uploadDir));

// --- MongoDB Connection ---
const MONGO_URI = "mongodb://localhost:27017/"; // Using a specific DB name

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Database Models (Mongoose) ---

const Schema = mongoose.Schema;

// User Model
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
});
const User = mongoose.model('User', userSchema);

// Lesson Sub-schema (part of a Module)
const lessonSchema = new Schema({
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'pdf', 'text'], required: true },
  content: { type: String }, // For text content
  videoUrl: { type: String }, // For video links
  fileUrl: { type: String }  // For PDF or other file links (path on server)
});

// Module Sub-schema (part of a Course)
const moduleSchema = new Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema]
});

// Course Model
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [moduleSchema],
  thumbnailUrl: { type: String } // Path to an uploaded image
});
const Course = mongoose.model('Course', courseSchema);

// Enrollment Model (tracks student progress)
const enrollmentSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0 } // e.g., percentage complete
});
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Assignment Model
const assignmentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  fileUrl: { type: String } // Optional file for the assignment prompt
});
const Assignment = mongoose.model('Assignment', assignmentSchema);

// Submission Model (for assignments)
const submissionSchema = new Schema({
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true }, // Path to submitted file
  submittedAt: { type: Date, default: Date.now },
  grade: { type: String } // e.g., "A+", "85%", etc.
});
const Submission = mongoose.model('Submission', submissionSchema);

// Discussion Forum Models
const discussionPostSchema = new Schema({
  thread: { type: Schema.Types.ObjectId, ref: 'DiscussionThread', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const DiscussionPost = mongoose.model('DiscussionPost', discussionPostSchema);

const discussionThreadSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  posts: [{ type: Schema.Types.ObjectId, ref: 'DiscussionPost' }]
});
const DiscussionThread = mongoose.model('DiscussionThread', discussionThreadSchema);

// Refund Request Model
const refundRequestSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now }
});
const RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);


// Chat Message Model (from original)
const messageSchema = new Schema({
  username: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);


// --- API Endpoints ---

// --- User & Auth Endpoints ---
app.post('/api/login', async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }
  const username = `${role}User`;
  try {
    let user = await User.findOne({ username: username, role: role });
    if (!user) {
      console.log(`No user found, creating new ${role} user...`);
      user = new User({ username: username, role: role });
      await user.save();
    }
    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// --- File Upload Endpoint ---
// Handles single file uploads from any part of the app
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  // Return the path to the file on the server
  // Frontend will store this path (e.g., '/uploads/filename.pdf')
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully.',
    filePath: `/uploads/${req.file.filename}`
  });
});

// --- Dashboard Endpoints ---
app.get('/api/dashboard', async (req, res) => {
  const { role, userId } = req.query; // Assuming frontend sends userId after login
  let data = {};
  try {
    if (role === 'student') {
      // Find courses the student is enrolled in
      const enrollments = await Enrollment.find({ student: userId }).populate({
        path: 'course',
        populate: { path: 'instructor', select: 'username' }
      });
      data = { 
        message: "Welcome Student!",
        courses: enrollments.map(e => e.course) // Return the course objects
      };
    } else if (role === 'instructor') {
      // Find courses taught by this instructor
      const courses = await Course.find({ instructor: userId });
      const enrollments = await Enrollment.find({ course: { $in: courses.map(c => c._id) } });
      data = { 
        message: "Welcome Instructor!",
        courses: courses,
        totalStudents: new Set(enrollments.map(e => e.student.toString())).size // Unique students
      };
    } else if (role === 'admin') {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const pendingRefunds = await RefundRequest.countDocuments({ status: 'pending' });
      data = { 
        message: "Welcome Admin!",
        totalUsers: totalUsers,
        totalCourses: totalCourses,
        pendingRefunds: pendingRefunds
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

// --- Course Management (CRUD) Endpoints ---

// POST /api/courses (Create a new course)
app.post('/api/courses', async (req, res) => {
  try {
    // In a real app, verify user is an instructor from a token
    const newCourse = new Course(req.body); 
    await newCourse.save();
    res.status(201).json({ success: true, course: newCourse });
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ success: false, message: 'Server error creating course.' });
  }
});

// GET /api/courses (Get all courses - for student/admin to see)
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'username');
        res.status(200).json({ success: true, courses });
    } catch (err) {
        console.error('Get all courses error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching courses.' });
    }
});

// GET /api/courses/:id (Get a single course with all content - for CourseViewer)
app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username');
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.status(200).json({ success: true, course });
    } catch (err) {
        console.error('Get single course error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching course.' });
    }
});

// PUT /api/courses/:id (Update a course - e.g., add/edit modules/lessons)
app.put('/api/courses/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            req.body, // Frontend sends the entire updated course object
            { new: true } // Return the updated document
        );
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.status(200).json({ success: true, course: updatedCourse });
    } catch (err) {
        console.error('Update course error:', err);
        res.status(500).json({ success: false, message: 'Server error updating course.' });
    }
});

// --- Assignment & Submission Endpoints ---

// GET /api/assignments/course/:courseId (Get assignments for a course)
app.get('/api/assignments/course/:courseId', async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.status(200).json({ success: true, assignments });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error fetching assignments.' });
    }
});

// POST /api/submissions (Submit an assignment)
// This endpoint expects a file, so it uses 'upload.single'
app.post('/api/submissions', upload.single('file'), async (req, res) => {
    const { assignmentId, studentId } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No submission file uploaded.' });
    }
    try {
        const newSubmission = new Submission({
            assignment: assignmentId,
            student: studentId,
            fileUrl: `/uploads/${req.file.filename}` // Save the path
        });
        await newSubmission.save();
        res.status(201).json({ success: true, submission: newSubmission });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error creating submission.' });
    }
});

// --- Discussion Forum Endpoints ---

// GET /api/forum/threads/:courseId
app.get('/api/forum/threads/:courseId', async (req, res) => {
    try {
        const threads = await DiscussionThread.find({ course: req.params.courseId })
            .populate('author', 'username');
        res.status(200).json({ success: true, threads });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error fetching threads.' });
    }
});

// POST /api/forum/threads
app.post('/api/forum/threads', async (req, res) => {
    try {
        const newThread = new DiscussionThread(req.body); // { course, author, title, content }
        await newThread.save();
        res.status(201).json({ success: true, thread: newThread });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error creating thread.' });
    }
});

// GET /api/forum/posts/:threadId
app.get('/api/forum/posts/:threadId', async (req, res) => {
    try {
        const posts = await DiscussionPost.find({ thread: req.params.threadId })
            .populate('author', 'username');
        res.status(200).json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error fetching posts.' });
    }
});

// POST /api/forum/posts
app.post('/api/forum/posts', async (req, res) => {
    try {
        const newPost = new DiscussionPost(req.body); // { thread, author, content }
        await newPost.save();
        // Add post to parent thread's 'posts' array
        await DiscussionThread.findByIdAndUpdate(req.body.thread, { $push: { posts: newPost._id } });
        res.status(201).json({ success: true, post: newPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error creating post.' });
    }
});

// --- Refund Endpoints ---

// POST /api/refunds/request (Student requests a refund)
app.post('/api/refunds/request', async (req, res) => {
    try {
        // req.body should contain { student, course, reason }
        const newRequest = new RefundRequest(req.body);
        await newRequest.save();
        res.status(201).json({ success: true, request: newRequest });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error submitting refund request.' });
    }
});

// GET /api/refunds/pending (Admin gets all pending refunds)
app.get('/api/refunds/pending', async (req, res) => {
    try {
        const requests = await RefundRequest.find({ status: 'pending' })
            .populate('student', 'username')
            .populate('course', 'title');
        res.status(200).json({ success: true, requests });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error fetching pending refunds.' });
    }
});

// PUT /api/refunds/manage/:requestId (Admin approves/rejects a refund)
app.put('/api/refunds/manage/:requestId', async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
    }
    try {
        const updatedRequest = await RefundRequest.findByIdAndUpdate(
            req.params.requestId,
            { status: status },
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Refund request not found.' });
        }
        res.status(200).json({ success: true, request: updatedRequest });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error managing refund request.' });
    }
});


// --- Chat & Payment Endpoints (from original) ---

app.get('/api/chat/history', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching chat history.' });
  }
});

app.post('/api/payment', (req, res) => {
  console.log('Payment request received:', req.body);
  const { invoiceId, amount, service, paymentMethodType } = req.body;
  if (!invoiceId || !amount || !paymentMethodType) {
    return res.status(400).json({ success: false, message: 'Missing required payment info.' });
  }
  setTimeout(() => {
    const transactionId = `TXN-${Date.now()}`;
    res.status(200).json({
      success: true,
      transactionId: transactionId,
      message: `Payment for invoice ${invoiceId} processed.`
    });
  }, 2000);
});

// --- Analytics Endpoint ---
app.get('/api/analytics/admin', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();
        const pendingRefunds = await RefundRequest.countDocuments({ status: 'pending' });

        // More complex aggregation: Users per role
        const usersByRole = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalCourses,
                totalEnrollments,
                pendingRefunds,
                usersByRole // [{ _id: 'student', count: 5 }, { _id: 'instructor', count: 2 }]
            }
        });
    } catch (err)
 {
        res.status(500).json({ success: false, message: 'Server error fetching analytics.' });
    }
});


// --- HTTP Server & WebSocket Server Setup ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected.');
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'chatMessage') {
        const newMessage = new Message({
          username: data.payload.username,
          role: data.payload.role,
          text: data.payload.text,
        });
        await newMessage.save();
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
  ws.on('close', () => console.log('🔌 WebSocket client disconnected.'));
  ws.on('error', (err) => console.error('WebSocket error:', err));
});

// --- Start the Server ---
server.listen(PORT, () => {
  console.log(`✅ Backend server (HTTP + WS) running on http://localhost:${PORT}`);
});

// --- Helper: Seed database (simplified) ---
async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains users. Seeding skipped.');
      return;
    }

    console.log('Seeding database...');
    await User.deleteMany({});
    await Course.deleteMany({});
    
    const instructor = new User({ username: 'instructorUser', role: 'instructor' });
    await instructor.save();

    const student = new User({ username: 'studentUser', role: 'student' });
    await student.save();

    const admin = new User({ username: 'adminUser', role: 'admin' });
    await admin.save();
    
    const course = new Course({ 
        title: 'React for Beginners', 
        description: 'Learn the fundamentals of React.', 
        instructor: instructor._id,
        modules: [
            { title: 'Module 1: Introduction', lessons: [
                { title: 'What is React?', contentType: 'text', content: 'React is a JavaScript library for building user interfaces.' },
                { title: 'Setting up your environment', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=sBws8MSXNfA' } // Example video
            ]},
            { title: 'Module 2: Components', lessons: [
                { title: 'Understanding Components', contentType: 'text', content: 'Components are the building blocks of React.' },
                { title: 'React Cheat Sheet', contentType: 'pdf', fileUrl: '/uploads/example.pdf' } // You would need to place an 'example.pdf' in your /uploads folder for this to work
            ]}
        ]
    });
    await course.save();

    await new Enrollment({ student: student._id, course: course._id }).save();

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Database seeding error:', err);
  }
}

seedDatabase();