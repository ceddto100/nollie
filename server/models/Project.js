const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  techStack: {
    type: [String],
    default: [],
  },
  liveUrl: {
    type: String,
    default: '',
  },
  repoUrl: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'in-progress'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
