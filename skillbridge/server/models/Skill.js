const mongoose = require('mongoose');

const skillSchema = mongoose.Schema(
  {
    skillName: {
      type: String,
      required: [true, 'Please add a skill name'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    experienceLevel: {
      type: String,
      required: [true, 'Please select your experience level'],
    },
    availability: {
      type: String,
      required: [true, 'Please specify your availability'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
