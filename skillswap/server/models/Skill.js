const mongoose = require('mongoose');

const CATEGORIES = [
  'Web Development',
  'Programming',
  'Data Science',
  'Design',
  'Photography',
  'Music',
  'Marketing',
  'Business',
  'Languages',
  'Academics',
  'Career',
  'Other',
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const skillSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: EXPERIENCE_LEVELS,
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Rate cannot be negative'],
    },
    availability: {
      type: String,
      default: 'Weekdays',
      maxlength: 200,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search
skillSchema.index({ name: 'text', description: 'text' });
skillSchema.index({ category: 1 });
skillSchema.index({ mentor: 1 });

module.exports = mongoose.model('Skill', skillSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.EXPERIENCE_LEVELS = EXPERIENCE_LEVELS;
