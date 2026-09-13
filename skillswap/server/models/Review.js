const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// After saving a review, recalculate the mentor's average rating
reviewSchema.post('save', async function () {
  const Review = this.constructor;
  const result = await Review.aggregate([
    { $match: { mentor: this.mentor } },
    {
      $group: {
        _id: '$mentor',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const User = mongoose.model('User');
  if (result.length > 0) {
    await User.findByIdAndUpdate(this.mentor, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    });
  }

  // Also update the skill's average rating
  const Booking = mongoose.model('Booking');
  const booking = await Booking.findById(this.booking);
  if (booking) {
    const skillResult = await Review.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'bookingData',
        },
      },
      { $unwind: '$bookingData' },
      { $match: { 'bookingData.skill': booking.skill } },
      {
        $group: {
          _id: '$bookingData.skill',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const Skill = mongoose.model('Skill');
    if (skillResult.length > 0) {
      await Skill.findByIdAndUpdate(booking.skill, {
        averageRating: Math.round(skillResult[0].averageRating * 10) / 10,
        totalReviews: skillResult[0].totalReviews,
      });
    }
  }
});

reviewSchema.index({ mentor: 1 });
reviewSchema.index({ learner: 1 });

module.exports = mongoose.model('Review', reviewSchema);
