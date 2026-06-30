const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, getMyRoadmaps } = require('../controllers/careerRoadmapController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/generate', protect, restrictTo('candidate'), generateRoadmap);
router.get('/my', protect, restrictTo('candidate'), getMyRoadmaps);
router.get('/:id', protect, restrictTo('candidate'), getRoadmap);

module.exports = router;