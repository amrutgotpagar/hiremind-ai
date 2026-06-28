const express = require('express');
const router = express.Router();
const { getAllCandidates, getCandidateDetail, getRankings } = require('../controllers/hrController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/candidates', protect, restrictTo('hr'), getAllCandidates);
router.get('/candidates/:id', protect, restrictTo('hr'), getCandidateDetail);
router.get('/rankings', protect, restrictTo('hr'), getRankings);

module.exports = router;