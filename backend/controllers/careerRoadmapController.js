const CareerRoadmap = require('../models/CareerRoadmap');
const { generateCareerRoadmap } = require('../services/geminiService');

const VALID_EXPERIENCE_LEVELS = ['student', 'fresher', '1-3 years', '3+ years'];

// @desc    Generate a personalized career roadmap
// @route   POST /api/career-roadmap/generate
const generateRoadmap = async (req, res, next) => {
  try {
    const {
      targetCompany,
      targetRole,
      currentSkills,
      currentProjects,
      experienceLevel,
      graduationYear,
      weeklyStudyHours,
    } = req.body;

    if (!targetCompany || !targetRole || !experienceLevel || !graduationYear || !weeklyStudyHours) {
      return res.status(400).json({
        success: false,
        message:
          'targetCompany, targetRole, experienceLevel, graduationYear, and weeklyStudyHours are required',
      });
    }

    if (!VALID_EXPERIENCE_LEVELS.includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message: `experienceLevel must be one of: ${VALID_EXPERIENCE_LEVELS.join(', ')}`,
      });
    }

    const skillsArray = Array.isArray(currentSkills)
      ? currentSkills
      : (currentSkills || '').split(',').map((s) => s.trim()).filter(Boolean);

    const roadmap = await CareerRoadmap.create({
      user: req.user.id,
      targetCompany,
      targetRole,
      currentSkills: skillsArray,
      currentProjects: currentProjects || '',
      experienceLevel,
      graduationYear,
      weeklyStudyHours,
      status: 'generating',
    });

    try {
      const aiResult = await generateCareerRoadmap({
        targetCompany,
        targetRole,
        currentSkills: skillsArray,
        currentProjects: currentProjects || '',
        experienceLevel,
        graduationYear,
        weeklyStudyHours,
      });

      roadmap.readinessScore = aiResult.readinessScore;
      roadmap.skillAssessment = aiResult.skillAssessment || '';
      roadmap.missingSkills = aiResult.missingSkills || [];
      roadmap.phases = aiResult.phases;
      roadmap.interviewPrepPlan = aiResult.interviewPrepPlan || '';
      roadmap.totalTimelineWeeks = aiResult.totalTimelineWeeks ?? null;
      roadmap.dailyStudyPlan = aiResult.dailyStudyPlan || '';
      roadmap.weeklyGoals = aiResult.weeklyGoals || [];
      roadmap.monthlyMilestones = aiResult.monthlyMilestones || [];
      roadmap.status = 'completed';
      await roadmap.save();

      return res.status(201).json({
        success: true,
        roadmap,
      });
    } catch (aiError) {
      roadmap.status = 'failed';
      await roadmap.save();
      return next(aiError);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single roadmap by id
// @route   GET /api/career-roadmap/:id
const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await CareerRoadmap.findOne({ _id: req.params.id, user: req.user.id });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found',
      });
    }

    res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all roadmaps for the logged-in user
// @route   GET /api/career-roadmap/my
const getMyRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await CareerRoadmap.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: roadmaps.length,
      roadmaps,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateRoadmap, getRoadmap, getMyRoadmaps };
