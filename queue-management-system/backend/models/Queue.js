const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters']
    },
    counterNumber: {
      type: String,
      required: [true, 'Counter number is required']
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Maximum capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CLOSED'],
      default: 'ACTIVE'
    },
    currentToken: {
      type: String,
      default: null
    },
    nextToken: {
      type: String,
      default: null
    },
    totalServed: {
      type: Number,
      default: 0
    },
    totalJoined: {
      type: Number,
      default: 0
    },
    tokenPrefix: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

queueSchema.virtual('currentlyWaiting').get(function () {
  return this.totalJoined - this.totalServed;
});

queueSchema.set('toJSON', { virtuals: true });
queueSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Queue', queueSchema);
