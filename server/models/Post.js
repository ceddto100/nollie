const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    default: '',
  },
  body: {
    type: String,
    required: [true, 'Post body is required'],
  },
  tags: {
    type: [String],
    default: [],
  },
  coverImage: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

postSchema.index({ title: 'text', body: 'text', excerpt: 'text' });

module.exports = mongoose.model('Post', postSchema);
