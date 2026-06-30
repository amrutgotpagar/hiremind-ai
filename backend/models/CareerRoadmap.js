const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  topics: { type: [String], default: [] },
  estimatedWeeks: { type: Number, required: true },
  recommendedProjects: { type: [String], default: [] },
  recommendedCertifications: { type: [String], default: [] },
});

const missingSkillSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  urgency: { type: String, enum: ['critical', 'important', 'nice-to-have'], required: true },
});

const careerRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetCompany: { type: String, required: true },
    targetRole: { type: String, required: true },
    currentSkills: { type: [String], default: [] },
    currentProjects: { type: String, default: '' },
    experienceLevel: {
      type: String,
      enum: ['student', 'fresher', '1-3 years', '3+ years'],
      required: true,
    },
    graduationYear: { type: Number, required: true },
    weeklyStudyHours: { type: Number, required: true },

    readinessScore: { type: Number, min: 0, max: 100, default: null },
    skillAssessment: { type: String, default: '' },
    missingSkills: { type: [missingSkillSchema], default: [] },
    phases: { type: [phaseSchema], default: [] },
    interviewPrepPlan: { type: String, default: '' },
    totalTimelineWeeks: { type: Number, default: null },
    dailyStudyPlan: { type: String, default: '' },
    weeklyGoals: { type: [String], default: [] },
    monthlyMilestones: { type: [String], default: [] },

    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'generating',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);