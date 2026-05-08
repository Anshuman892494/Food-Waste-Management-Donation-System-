const User = require('../models/User');

/**
 * Finds the nearest verified organizations of a specific role.
 * @param {Array} coordinates - [lng, lat]
 * @param {string} role - 'ngo' | 'dairy_farm'
 * @param {number} maxDistance - distance in meters
 */
exports.findNearestOrgs = async (coordinates, role, maxDistance = 5000) => {
  try {
    return await User.find({
      role: role,
      verificationStatus: 'verified',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    }).limit(5);
  } catch (error) {
    console.error('Routing Service Error:', error);
    return [];
  }
};
