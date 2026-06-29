const mongoose = require('mongoose');

const atsReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    sections: {
      contact: { type: Boolean, default: false },
      summary: { type: Boolean, default: false },
      skills: { type: Boolean, default: false },
      experience: { type: Boolean, default: false },
      projects: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      certifications: { type: Boolean, default: false },
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    formatWarnings: {
      type: [String],
      default: [],
    },
    scores: {
      atsScore: { type: Number, min: 0, max: 100, default: null },
      resumeStrength: { type: Number, min: 0, max: 100, default: null },
      keywordMatch: { type: Number, min: 0, max: 100, default: null },
      formatting: { type: Number, min: 0, max: 100, default: null },
      contentQuality: { type: Number, min: 0, max: 100, default: null },
      skillsCoverage: { type: Number, min: 0, max: 100, default: null },
      experienceRelevance: { type: Number, min: 0, max: 100, default: null },
    },
    feedback: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      recruiterPerspective: { type: String, default: '' },
      atsPerspective: { type: String, default: '' },
      suggestions: { type: [String], default: [] },
    },
    status: {
      type: String,
      enum: ['analyzing', 'completed', 'failed'],
      default: 'analyzing',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AtsReport', atsReportSchema);