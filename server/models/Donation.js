const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: [true, 'Please add a food name'],
    trim: true,
    maxlength: [100, 'Food name cannot be more than 100 characters']
  },
  quantity: {
    type: String,
    required: [true, 'Please specify quantity']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['veg', 'non-veg', 'both']
  },
  expiryTime: {
    type: Date,
    required: [true, 'Please add an expiry time']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  pickupAddress: {
    type: String,
    required: [true, 'Please add a pickup address']
  },
  location: {
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
    enum: ['available', 'accepted', 'picked-up', 'delivered', 'expired'],
    default: 'available'
  },
  weight: {
    type: Number, // in kg
    required: [true, 'Please specify weight in kg']
  },
  storageConditions: {
    type: String,
    enum: ['ambient', 'refrigerated', 'frozen'],
    default: 'ambient'
  },
  aiAnalysis: {
    type: Boolean,
    default: false
  },
  acceptedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  acceptedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);
