const AtsReport = require('../models/AtsReport');
const Resume = require('../models/Resume');
const { detectSections } = require('../services/sectionDetectionService');
const { extractSkills, compareKeywords } = require('../services/keywordService');
const { generateAtsFeedback } = require('../services/geminiService');
const {
  formattingScoreFromWarnings,
  skillsCoverageScore,
  computeOverallAtsScore,
} = require('../services/atsScoringService');

// @desc    Analyze a resume for ATS compatibility (optionally against a job description)
// @route   POST /api/ats/analyze
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'resumeId is required',
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    if (resume.status !== 'parsed') {
      return res.status(400).json({
        success: false,
        message: `Resume is not ready yet (status: ${resume.status})`,
      });
    }

    // Create the report in 'analyzing' state immediately, fill in results as they complete
    const report = await AtsReport.create({
      user: req.user.id,
      resume: resume._id,
      jobDescription: jobDescription || '',
      status: 'analyzing',
    });

    // Step 1: deterministic analysis (instant)
    const { sections, formatWarnings } = detectSections(resume.parsedText);
    const { matchedKeywords, missingKeywords, keywordMatchScore } = compareKeywords(
      resume.parsedText,
      jobDescription || ''
    );
    const resumeSkillCount = extractSkills(resume.parsedText).size;
    const formattingScore = formattingScoreFromWarnings(formatWarnings.length);
    const skillsCovScore = skillsCoverageScore(resumeSkillCount, matchedKeywords.length);

    try {
      // Step 2: AI-judged analysis (takes a few seconds)
      const aiFeedback = await generateAtsFeedback(resume.parsedText, jobDescription || '');

      const scores = {
        keywordMatch: keywordMatchScore,
        formatting: formattingScore,
        skillsCoverage: skillsCovScore,
        resumeStrength: aiFeedback.resumeStrength,
        contentQuality: aiFeedback.contentQuality,
        experienceRelevance: aiFeedback.experienceRelevance,
      };
      scores.atsScore = computeOverallAtsScore(scores);

      report.sections = sections;
      report.matchedKeywords = matchedKeywords;
      report.missingKeywords = missingKeywords;
      report.formatWarnings = formatWarnings;
      report.scores = scores;
      report.feedback = {
        strengths: aiFeedback.strengths || [],
        weaknesses: aiFeedback.weaknesses || [],
        recruiterPerspective: aiFeedback.recruiterPerspective || '',
        atsPerspective: aiFeedback.atsPerspective || '',
        suggestions: aiFeedback.suggestions || [],
      };
      report.status = 'completed';
      await report.save();

      return res.status(201).json({
        success: true,
        report,
      });
    } catch (aiError) {
      report.status = 'failed';
      await report.save();
      return next(aiError);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single ATS report by id
// @route   GET /api/ats/:id
const getAtsReport = async (req, res, next) => {
  try {
    const report = await AtsReport.findOne({ _id: req.params.id, user: req.user.id });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'ATS report not found',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ATS reports for the logged-in user
// @route   GET /api/ats/my
const getMyAtsReports = async (req, res, next) => {
  try {
    const reports = await AtsReport.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeResume, getAtsReport, getMyAtsReports };