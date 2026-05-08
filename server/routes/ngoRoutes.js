const express = require('express');
const { acceptDonation, getAcceptedDonations, getNGOStats } = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.put('/accept/:id', protect, authorize('ngo'), acceptDonation);
router.get('/accepted', protect, authorize('ngo'), getAcceptedDonations);
router.get('/stats', protect, authorize('ngo'), getNGOStats);

module.exports = router;
