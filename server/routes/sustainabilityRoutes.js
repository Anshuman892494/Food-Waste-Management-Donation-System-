const express = require('express');
const { getMyImpact, getCityImpact } = require('../controllers/sustainabilityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMyImpact);
router.get('/city', getCityImpact);

module.exports = router;
