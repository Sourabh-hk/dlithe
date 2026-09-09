const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: true
    },
    tokenNumber: {
      type: String,
      required: true
    },
    sequenceNumber: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['WAITING', 'SERVING', 'SERVED', 'LEFT'],
      default: 'WAITING'
    },
    servedAt: {
      type: Date,
      default: null
    },
    leftAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

tokenSchema.index({ queueId: 1, sequenceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Token', tokenSchema);
