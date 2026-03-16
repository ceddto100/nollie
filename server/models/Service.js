const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
  },
  price: {
    type: String,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
  ctaText: {
    type: String,
    default: 'Get Started',
  },
  ctaLink: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
