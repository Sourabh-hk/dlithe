const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getMentorReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Review comment is required'),
  ],
  validate,
  createReview
);

router.get('/mentor/:mentorId', getMentorReviews);
router.get('/my', protect, getMyReviews);

module.exports = router;
