const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['new-donation', 'accepted', 'assigned', 'delivered', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedDonation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Donation'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
