const express = require('express');
const { createDonation, getDonations, getNearbyDonations, getDonation, predictDonationInfo } = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/', protect, authorize('donor'), upload.single('image'), createDonation);
router.post('/predict', protect, authorize('donor'), predictDonationInfo);
router.get('/', protect, getDonations);
router.get('/nearby', protect, authorize('ngo'), getNearbyDonations);
router.get('/:id', getDonation);

module.exports = router;
