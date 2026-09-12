const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

// Helper: check for booking conflicts
const hasConflict = async (resourceId, date, startTime, endTime, excludeBookingId = null) => {
  const query = {
    resource: resourceId,
    date,
    status: 'CONFIRMED',
    $and: [
      { startTime: { $lt: endTime } },
      { endTime: { $gt: startTime } },
    ],
  };
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  const conflict = await Booking.findOne(query);
  return conflict;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { resource: resourceId, date, startTime, endTime, purpose, attendees } = req.body;

    // Basic validation
    if (!resourceId || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({ success: false, message: 'Resource, date, start time, end time and purpose are required' });
    }

    // Time validation
    if (startTime >= endTime) {
      return res.status(400).json({ success: false, message: 'End time must be later than start time' });
    }

    // Date validation — cannot book in the past
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ success: false, message: 'Cannot book a resource in the past' });
    }

    // Check resource exists and is available
    const resource = await Resource.findOne({ _id: resourceId, isActive: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    if (resource.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        message: `This resource is currently ${resource.status.toLowerCase()} and cannot be booked`,
      });
    }

    // Check capacity
    if (attendees && attendees > resource.capacity) {
      return res.status(400).json({
        success: false,
        message: `Attendees (${attendees}) exceeds resource capacity (${resource.capacity})`,
      });
    }

    // CRITICAL: Conflict check (backend must always re-check)
    const conflict = await hasConflict(resourceId, date, startTime, endTime);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This resource is already booked during the selected time. Please choose another time or resource.',
      });
    }

    const booking = await Booking.create({
      resource: resourceId,
      user: req.user._id,
      date,
      startTime,
      endTime,
      purpose,
      attendees: attendees || 1,
      status: 'CONFIRMED',
    });

    await booking.populate(['resource', 'user']);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const { status, sort } = req.query;

    const query = { user: req.user._id };
    if (status && status !== 'ALL') query.status = status;

    let sortOption = { date: -1, startTime: -1 };
    if (sort === 'date_asc') sortOption = { date: 1, startTime: 1 };
    if (sort === 'created') sortOption = { createdAt: -1 };

    // Auto-complete past bookings on fetch
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    await Booking.updateMany(
      {
        user: req.user._id,
        status: 'CONFIRMED',
        $or: [
          { date: { $lt: today } },
          { date: today, endTime: { $lte: currentTime } },
        ],
      },
      { $set: { status: 'COMPLETED' } }
    );

    const bookings = await Booking.find(query)
      .populate('resource', 'name type location image')
      .sort(sortOption);

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking detail
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('resource', 'name type location capacity features image')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Users can only view their own bookings
    if (req.user.role !== 'ADMIN' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You don't have permission to view this booking" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only owner or admin can cancel
    if (req.user.role !== 'ADMIN' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You don't have permission to cancel this booking" });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'This booking is already cancelled' });
    }
    if (booking.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'This booking has already been completed and cannot be cancelled' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for calendar (user sees their own + sanitized others)
// @route   GET /api/bookings/calendar
// @access  Private
const getCalendarBookings = async (req, res, next) => {
  try {
    const { resourceId, startDate, endDate } = req.query;

    const query = { status: { $in: ['CONFIRMED', 'COMPLETED'] } };
    if (resourceId) query.resource = resourceId;
    if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };

    const bookings = await Booking.find(query)
      .populate('resource', 'name type')
      .populate('user', '_id')
      .lean();

    // Sanitize: hide other users' personal info
    const sanitized = bookings.map((b) => {
      const isOwn = b.user && b.user._id.toString() === req.user._id.toString();
      return {
        _id: b._id,
        resource: b.resource,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
        isOwn,
        purpose: isOwn ? b.purpose : undefined,
        bookingRef: isOwn ? b.bookingRef : undefined,
      };
    });

    res.status(200).json({ success: true, data: sanitized });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking, getCalendarBookings };
