const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { generateInterviewQuestions, evaluateAnswers } = require('../services/geminiService');

// @desc    Create a new interview session from a parsed resume
// @route   POST /api/interviews/start
const startInterview = async (req, res, next) => {
  try {
    const { resumeId } = req.body;

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

    const questions = await generateInterviewQuestions(resume.parsedText);

    const qaPairs = questions.map((question) => ({
      question,
      answer: '',
      score: null,
      feedback: '',
    }));

    const interview = await Interview.create({
      user: req.user.id,
      resume: resume._id,
      qaPairs,
      status: 'pending_answers',
    });

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answers for an interview
// @route   PUT /api/interviews/:id/submit-answers
const submitAnswers = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'answers must be an array of { questionId, answer }',
      });
    }

    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.status !== 'pending_answers') {
      return res.status(400).json({
        success: false,
        message: `Cannot submit answers — interview status is already '${interview.status}'`,
      });
    }

    answers.forEach(({ questionId, answer }) => {
      const qaPair = interview.qaPairs.id(questionId);
      if (qaPair) {
        qaPair.answer = answer;
      }
    });

    interview.status = 'submitted';
    await interview.save();

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluate a submitted interview using Gemini
// @route   POST /api/interviews/:id/evaluate
const evaluateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: `Cannot evaluate — interview status is '${interview.status}', expected 'submitted'`,
      });
    }

    const result = await evaluateAnswers(interview.qaPairs);

    if (result.evaluations.length !== interview.qaPairs.length) {
      return res.status(502).json({
        success: false,
        message: 'AI evaluation returned a mismatched number of results. Please try again.',
      });
    }

    // Apply each evaluation to its matching question, in order
    interview.qaPairs.forEach((qaPair, index) => {
      qaPair.score = result.evaluations[index].score;
      qaPair.feedback = result.evaluations[index].feedback;
    });

    interview.overallScore = result.overallScore;
    interview.overallFeedback = result.overallFeedback;
    interview.status = 'evaluated';

    await interview.save();

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single interview by id
// @route   GET /api/interviews/:id
const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { startInterview, submitAnswers, evaluateInterview, getInterview };