const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AIReport = require('../models/AIReport');
const { analyzeDonation } = require('../services/aiService');
const { recordImpact } = require('../services/impactEngine');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donor)
exports.createDonation = async (req, res, next) => {
  try {
    req.body.donorId = req.user.id;

    if (req.body.location) {
      try {
        const loc = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
        req.body.location = {
          type: 'Point',
          coordinates: loc.coordinates || [loc.lng, loc.lat]
        };
      } catch (err) {
        console.error('Location parsing failed');
        delete req.body.location;
      }
    }

    // Handle image upload if present (from Cloudinary/multer)
    if (req.file) {
      req.body.image = req.file.path;
    }

    const donation = await Donation.create(req.body);

    // [SMART-CITY UPGRADE] Trigger Groq AI Analysis
    try {
      const aiReport = await analyzeDonation(donation);
      donation.aiAnalysis = true;
      await donation.save();
    } catch (aiErr) {
      console.error('AI Analysis failed, but donation saved.');
    }

    // Notify nearby NGOs (Mock logic for now, emits socket event later)
    const io = req.app.get('io');
    io.emit('newDonation', {
      message: `New food donation: ${donation.foodName}`,
      donationId: donation._id
    });

    res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res, next) => {
  try {
    const query = req.query.mine === 'true' ? { donorId: req.user.id } : { status: 'available' };
    
    const donations = await Donation.find(query)
      .populate('donorId', 'name email phone')
      .sort('-createdAt');
    
    // Fetch AI reports for these donations
    const donationIds = donations.map(d => d._id);
    const reports = await AIReport.find({ donationId: { $in: donationIds } });
    
    const donationsWithAI = donations.map(d => {
      const report = reports.find(r => r.donationId.toString() === d._id.toString());
      return { ...d._doc, aiReport: report };
    });

    res.json(donationsWithAI);
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby donations
// @route   GET /api/donations/nearby
// @access  Private (NGO)
exports.getNearbyDonations = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Please provide lat and lng' });
    }

    const donations = await Donation.find({
      status: 'available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // to meters
        }
      }
    }).populate('donorId', 'name email phone');

    res.json(donations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Public
exports.getDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId', 'name email phone');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    next(error);
  }
};

// @desc    Predict donation info using AI
// @route   POST /api/donations/predict
// @access  Private (Donor)
exports.predictDonationInfo = async (req, res, next) => {
  try {
    const { foodName } = req.body;
    if (!foodName) return res.status(400).json({ message: 'Food name required' });

    // Mock analysis for prediction to avoid saving to DB
    const prediction = {
      category: foodName.toLowerCase().includes('chicken') || foodName.toLowerCase().includes('meat') ? 'non-veg' : 'veg',
      storageConditions: foodName.toLowerCase().includes('ice') || foodName.toLowerCase().includes('frozen') ? 'frozen' : 'ambient'
    };
    
    res.json(prediction); 
  } catch (error) {
    next(error);
  }
};
