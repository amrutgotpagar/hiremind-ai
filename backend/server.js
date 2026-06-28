require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HireMind AI backend is running' });
});

// Feature routes
app.use('/api/auth', authRoutes);


const resumeRoutes = require('./routes/resumeRoutes');
// ...
app.use('/api/resumes', resumeRoutes);

const interviewRoutes = require('./routes/interviewRoutes');
// ...
app.use('/api/interviews', interviewRoutes);

const hrRoutes = require('./routes/hrRoutes');
// ...
app.use('/api/hr', hrRoutes);

// Error handler — must be last
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});