const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Donation',
    required: true
  },
  freshnessScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  shelfLifeEstimate: {
    type: String,
    required: true
  },
  safetyScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  recommendation: {
    destination: {
      type: String,
      enum: ['ngo', 'dairy', 'compost'],
      required: true
    },
    reasoning: {
      type: String,
      required: true
    }
  },
  rawResponse: {
    type: Object // Storing full Groq response for future training
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIReport', aiReportSchema);
