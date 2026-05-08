const User = require('../models/User');
const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const deliveredDonations = await Donation.countDocuments({ status: 'delivered' });
    const availableDonations = await Donation.countDocuments({ status: 'available' });

    res.json({
      totalUsers,
      totalDonations,
      deliveredDonations,
      availableDonations,
      wasteReductionStats: {
        // Mock data for hackathon
        mealsServed: deliveredDonations * 5, // assuming 1 donation serves 5 people
        co2Saved: deliveredDonations * 2.5 // kg
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};
