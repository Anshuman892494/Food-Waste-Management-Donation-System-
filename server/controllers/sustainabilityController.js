const SustainabilityMetric = require('../models/SustainabilityMetric');

// @desc    Get user's monthly impact
// @route   GET /api/sustainability/me
// @access  Private
exports.getMyImpact = async (req, res, next) => {
  try {
    const metrics = await SustainabilityMetric.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(req.user.id) } },
      {
        $group: {
          _id: null,
          carbonSaved: { $sum: "$carbonSaved" },
          wasteDiverted: { $sum: "$wasteDiverted" },
          mealsProvided: { $sum: "$mealsProvided" }
        }
      }
    ]);
    res.json(metrics[0] || { carbonSaved: 0, wasteDiverted: 0, mealsProvided: 0 });
  } catch (error) {
    next(error);
  }
};

// @desc    Get city-wide cumulative impact
// @route   GET /api/sustainability/city
// @access  Public
exports.getCityImpact = async (req, res, next) => {
  try {
    const metrics = await SustainabilityMetric.aggregate([
      {
        $group: {
          _id: null,
          totalCarbonSaved: { $sum: "$carbonSaved" },
          totalWasteDiverted: { $sum: "$wasteDiverted" },
          totalMealsProvided: { $sum: "$mealsProvided" }
        }
      }
    ]);
    res.json(metrics[0] || { totalCarbonSaved: 0, totalWasteDiverted: 0, totalMealsProvided: 0 });
  } catch (error) {
    next(error);
  }
};
