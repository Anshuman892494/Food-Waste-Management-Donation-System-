const SustainabilityMetric = require('../models/SustainabilityMetric');

const CO2_FACTOR = 2.5; // kg CO2 per 1kg of food waste prevented

/**
 * Updates sustainability metrics for a user or city.
 * @param {string} userId - ID of the user.
 * @param {number} weight - Weight of food diverted in kg.
 * @param {number} meals - Number of meals provided.
 */
exports.recordImpact = async (userId, weight, meals) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const carbonSaved = weight * CO2_FACTOR;
  
  try {
    // Find or create monthly metric
    let metric = await SustainabilityMetric.findOne({ userId, month, year });

    if (!metric) {
      metric = new SustainabilityMetric({ userId, month, year });
    }

    metric.carbonSaved += carbonSaved;
    metric.wasteDiverted += weight;
    metric.mealsProvided += meals;
    
    // Calculate sustainability score (simplified logic)
    metric.sustainabilityScore = Math.min(100, (metric.wasteDiverted / 10) + 50);

    await metric.save();
    return metric;
  } catch (error) {
    console.error('Impact Engine Error:', error);
  }
};
