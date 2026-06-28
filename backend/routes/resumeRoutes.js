const express = require('express');
const router = express.Router();
const { uploadResume, getMyResumes, generateQuestions } = require('../controllers/resumeController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, restrictTo('candidate'), upload.single('resume'), uploadResume);
router.get('/my', protect, restrictTo('candidate'), getMyResumes);
router.post('/:id/generate-questions', protect, restrictTo('candidate'), generateQuestions);

module.exports = router;