const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
});

const interviewSchema = new mongoose.Schema(
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
    qaPairs: [answerSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending_answers', 'submitted', 'evaluated'],
      default: 'pending_answers',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);