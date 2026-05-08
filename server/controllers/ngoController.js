const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');
const Notification = require('../models/Notification');

// @desc    Accept donation
// @route   PUT /api/ngo/accept/:id
// @access  Private (NGO)
exports.acceptDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation is already accepted or completed' });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.user.id;
    donation.acceptedAt = Date.now();

    await donation.save();

    // Create a delivery task
    const delivery = await Delivery.create({
      donationId: donation._id,
      ngoId: req.user.id,
      status: 'assigned'
    });

    // Notify donor
    await Notification.create({
      userId: donation.donorId,
      type: 'accepted',
      message: `Your donation for ${donation.foodName} has been accepted by ${req.user.name}`,
      relatedDonation: donation._id
    });

    res.json({ donation, delivery });
  } catch (error) {
    next(error);
  }
};

// @desc    Get accepted donations
// @route   GET /api/ngo/accepted
// @access  Private (NGO)
exports.getAcceptedDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ acceptedBy: req.user.id })
      .populate('donorId', 'name email phone');
    res.json(donations);
  } catch (error) {
    next(error);
  }
};
// @desc    Get NGO stats
// @route   GET /api/ngo/stats
// @access  Private (NGO)
exports.getNGOStats = async (req, res, next) => {
  try {
    const acceptedCount = await Donation.countDocuments({ acceptedBy: req.user.id });
    const distributedCount = await Donation.countDocuments({ 
      acceptedBy: req.user.id, 
      status: 'delivered' 
    });

    res.json({
      accepted: acceptedCount,
      distributed: distributedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule delivery for accepted donation
// @route   PUT /api/ngo/schedule-delivery/:id
// @access  Private (NGO)
exports.scheduleDelivery = async (req, res, next) => {
  try {
    const { deliveryAddress, deliveryLocation } = req.body;
    
    let delivery = await Delivery.findOne({ donationId: req.params.id, ngoId: req.user.id });
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery task not found' });
    }

    delivery.deliveryAddress = deliveryAddress;
    if (deliveryLocation) {
      delivery.deliveryLocation = {
        type: 'Point',
        coordinates: [deliveryLocation.lng, deliveryLocation.lat]
      };
    }
    delivery.status = 'assigned'; 
    await delivery.save();

    // Update donation status to scheduled
    await Donation.findByIdAndUpdate(req.params.id, { status: 'scheduled' });

    res.json({ message: 'Delivery scheduled successfully', delivery });
  } catch (error) {
    next(error);
  }
};
