const express = require('express');
const router = express.Router();
const { startInterview, submitAnswers, evaluateInterview, getInterview } = require('../controllers/interviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/start', protect, restrictTo('candidate'), startInterview);
router.put('/:id/submit-answers', protect, restrictTo('candidate'), submitAnswers);
router.post('/:id/evaluate', protect, restrictTo('candidate'), evaluateInterview);
router.get('/:id', protect, restrictTo('candidate'), getInterview);

module.exports = router;