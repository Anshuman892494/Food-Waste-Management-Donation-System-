const express = require('express');
const { acceptDonation, getAcceptedDonations, getNGOStats, scheduleDelivery } = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.put('/accept/:id', protect, authorize('ngo'), acceptDonation);
router.get('/accepted', protect, authorize('ngo'), getAcceptedDonations);
router.get('/stats', protect, authorize('ngo'), getNGOStats);
router.put('/schedule-delivery/:id', protect, authorize('ngo'), scheduleDelivery);

module.exports = router;
