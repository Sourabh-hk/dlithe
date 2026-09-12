const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBooking, cancelBooking, getCalendarBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/calendar', getCalendarBookings);
router.get('/:id', getBooking);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
