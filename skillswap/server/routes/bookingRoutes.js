const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect); // All booking routes are protected

router.post(
  '/',
  [
    body('skillId').notEmpty().withMessage('Skill is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
  ],
  validate,
  createBooking
);

router.get('/my', getMyBookings);
router.get('/incoming', getIncomingBookings);
router.get('/:id', getBookingById);
router.put('/:id/accept', acceptBooking);
router.put('/:id/reject', rejectBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/complete', completeBooking);

module.exports = router;
