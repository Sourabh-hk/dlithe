const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: [
        'Meeting Room',
        'Conference Room',
        'Seminar Hall',
        'Computer Lab',
        'Training Room',
        'Event Hall',
        'Projector',
        'Camera',
        'Audio/Video Equipment',
        'Workspace',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    features: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'MAINTENANCE', 'INACTIVE'],
      default: 'AVAILABLE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ name: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
