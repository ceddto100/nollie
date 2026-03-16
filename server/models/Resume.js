const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  summary: {
    type: String,
    default: '',
  },
  experience: [{
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    bullets: { type: [String], default: [] },
  }],
  education: [{
    school: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, default: '' },
    year: { type: String, default: '' },
  }],
  skills: {
    type: [String],
    default: [],
  },
  certifications: [{
    name: { type: String, required: true, trim: true },
    issuer: { type: String, default: '' },
    year: { type: String, default: '' },
    url: { type: String, default: '' },
  }],
  pdfUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
