const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Donation',
    required: true
  },
  ngoId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  volunteerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Please add a delivery destination address']
  },
  deliveryLocation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  status: {
    type: String,
    enum: ['assigned', 'picked-up', 'in-transit', 'delivered'],
    default: 'assigned'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);
