const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    date: {
      type: String, // Store as YYYY-MM-DD string for easy comparison
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String, // HH:MM 24-hour format
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // HH:MM 24-hour format
      required: [true, 'End time is required'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
      trim: true,
      maxlength: [500, 'Purpose cannot exceed 500 characters'],
    },
    attendees: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 attendee required'],
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'CONFIRMED',
    },
    bookingRef: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster conflict queries
bookingSchema.index({ resource: 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1 });

// Auto-generate booking reference (Mongoose 8 async hook, no next param)
bookingSchema.pre('save', async function () {
  if (!this.bookingRef) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingRef = `BK-${String(count + 1).padStart(5, '0')}`;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
