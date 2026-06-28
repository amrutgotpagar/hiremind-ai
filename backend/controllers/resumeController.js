const Resume = require('../models/Resume');
const { extractTextFromPDF } = require('../services/pdfService');
const { generateInterviewQuestions } = require('../services/geminiService');

// @desc    Upload a resume file
// @route   POST /api/resumes/upload
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      originalFileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    // Extract text in the background — don't block the upload response on it
    extractTextFromPDF(resume.filePath)
      .then(async (text) => {
        resume.parsedText = text;
        resume.status = 'parsed';
        await resume.save();
      })
      .catch(async (err) => {
        console.error('PDF parsing failed:', err.message);
        resume.status = 'failed';
        await resume.save();
      });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes uploaded by the logged-in user
// @route   GET /api/resumes/my
const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate interview questions from a parsed resume
// @route   POST /api/resumes/:id/generate-questions
const generateQuestions = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    if (resume.status !== 'parsed') {
      return res.status(400).json({
        success: false,
        message: `Resume is not ready yet (status: ${resume.status}). Please wait for parsing to complete.`,
      });
    }

    const questions = await generateInterviewQuestions(resume.parsedText);

    res.status(200).json({
      success: true,
      resumeId: resume._id,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadResume, getMyResumes, generateQuestions };