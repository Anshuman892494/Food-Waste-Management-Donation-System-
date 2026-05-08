const mongoose = require('mongoose');

const sustainabilityMetricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    index: true
  },
  carbonSaved: {
    type: Number,
    default: 0 // In kg CO2
  },
  mealsProvided: {
    type: Number,
    default: 0
  },
  wasteDiverted: {
    type: Number,
    default: 0 // In kg
  },
  sustainabilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient monthly lookups
sustainabilityMetricSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('SustainabilityMetric', sustainabilityMetricSchema);
