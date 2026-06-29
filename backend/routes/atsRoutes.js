const express = require('express');
const router = express.Router();
const { analyzeResume, getAtsReport, getMyAtsReports } = require('../controllers/atsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/analyze', protect, restrictTo('candidate'), analyzeResume);
router.get('/my', protect, restrictTo('candidate'), getMyAtsReports);
router.get('/:id', protect, restrictTo('candidate'), getAtsReport);

module.exports = router;