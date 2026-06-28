const User = require('../models/User');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');

// @desc    List all candidates (basic info only)
// @route   GET /api/hr/candidates
const getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await User.find({ role: 'candidate' }).select('name email createdAt');

    res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full interview history + resumes for a specific candidate
// @route   GET /api/hr/candidates/:id
const getCandidateDetail = async (req, res, next) => {
  try {
    const candidate = await User.findOne({ _id: req.params.id, role: 'candidate' }).select(
      'name email createdAt'
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    const resumes = await Resume.find({ user: candidate._id }).sort({ createdAt: -1 });
    const interviews = await Interview.find({ user: candidate._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      candidate,
      resumes,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all evaluated interviews ranked by overall score
// @route   GET /api/hr/rankings
const getRankings = async (req, res, next) => {
  try {
    const rankings = await Interview.find({ status: 'evaluated' })
      .populate('user', 'name email')
      .sort({ overallScore: -1 })
      .select('user overallScore overallFeedback createdAt');

    res.status(200).json({
      success: true,
      count: rankings.length,
      rankings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCandidates, getCandidateDetail, getRankings };
