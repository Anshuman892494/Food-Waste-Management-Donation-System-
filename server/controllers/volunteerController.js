const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const { recordImpact } = require('../services/impactEngine');

// @desc    Get assigned tasks
// @route   GET /api/volunteer/tasks
// @access  Private (Volunteer)
exports.getAssignedTasks = async (req, res, next) => {
  try {
    const tasks = await Delivery.find({ volunteerId: req.user.id })
      .populate('donationId')
      .populate('ngoId', 'name email phone');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status
// @route   PUT /api/volunteer/update/:id
// @access  Private (Volunteer)
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery task not found' });
    }

    delivery.status = status;
    if (status === 'picked-up') {
      delivery.pickupTime = Date.now();
    } else if (status === 'delivered') {
      delivery.deliveryTime = Date.now();
      
      // Update donation status as well
      const donation = await Donation.findByIdAndUpdate(delivery.donationId, { status: 'delivered' });
      
      // [SMART-CITY UPGRADE] Record Environmental Impact
      const meals = 5; // simplified assumption
      await recordImpact(donation.donorId, donation.weight, meals); // Record for Donor
      await recordImpact(delivery.ngoId, donation.weight, meals); // Record for NGO
      await recordImpact(delivery.volunteerId, donation.weight, meals); // Record for Volunteer
    }

    await delivery.save();

    // Notify NGO and Donor
    const donation = await Donation.findById(delivery.donationId);
    
    await Notification.create({
      userId: donation.donorId,
      type: 'delivered',
      message: `Your food donation for ${donation.foodName} has been delivered.`,
      relatedDonation: donation._id
    });

    res.json(delivery);
  } catch (error) {
    next(error);
  }
};
