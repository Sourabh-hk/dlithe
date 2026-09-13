const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Create a review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Only the learner can review
    if (booking.learner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the learner can review this session');
    }

    // Only completed bookings can be reviewed
    if (booking.status !== 'completed') {
      res.status(400);
      throw new Error('You can only review completed sessions');
    }

    // Check for existing review
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this session');
    }

    const review = await Review.create({
      booking: bookingId,
      mentor: booking.mentor,
      learner: req.user._id,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id)
      .populate('learner', 'name avatar')
      .populate('mentor', 'name avatar');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a mentor
// @route   GET /api/reviews/mentor/:mentorId
const getMentorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ mentor: req.params.mentorId })
      .populate('learner', 'name avatar')
      .populate('booking', 'date')
      .populate({
        path: 'booking',
        populate: { path: 'skill', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews written by current user
// @route   GET /api/reviews/my
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ learner: req.user._id })
      .populate('mentor', 'name avatar')
      .populate({
        path: 'booking',
        populate: { path: 'skill', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getMentorReviews, getMyReviews };
