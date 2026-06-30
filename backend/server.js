require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const hrRoutes = require('./routes/hrRoutes');
const errorHandler = require('./middleware/errorHandler');
const atsRoutes = require('./routes/atsRoutes');
const careerRoadmapRoutes = require('./routes/careerRoadmapRoutes');


// Connect to MongoDB
connectDB();

const app = express();

// Allowed origins: local dev + deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://hiremind-ai-gamma.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HireMind AI backend is running' });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/career-roadmap', careerRoadmapRoutes);

// Error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});