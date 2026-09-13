const Booking = require('../models/Booking');
const Skill = require('../models/Skill');

// Helper: check for conflicting bookings
const hasConflict = async (mentorId, date, startTime, endTime, excludeId) => {
  const query = {
    mentor: mentorId,
    date: new Date(date),
    status: { $in: ['pending', 'accepted'] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
    ],
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const conflict = await Booking.findOne(query);
  return !!conflict;
};

// @desc    Create a booking
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { skillId, date, startTime, endTime, duration, meetingNotes } = req.body;

    // Find the skill
    const skill = await Skill.findById(skillId);
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    if (!skill.isActive) {
      res.status(400);
      throw new Error('This skill is not currently available');
    }

    // Cannot book your own skill
    if (skill.mentor.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot book your own skill');
    }

    // Check for conflicts
    const conflict = await hasConflict(skill.mentor, date, startTime, endTime);
    if (conflict) {
      res.status(409);
      throw new Error('This time slot is not available. The mentor already has a session scheduled.');
    }

    const totalAmount = skill.hourlyRate * (duration || 1);

    const booking = await Booking.create({
      learner: req.user._id,
      mentor: skill.mentor,
      skill: skill._id,
      date: new Date(date),
      startTime,
      endTime,
      duration: duration || 1,
      hourlyRate: skill.hourlyRate,
      totalAmount,
      meetingNotes: meetingNotes || '',
    });

    const populated = await Booking.findById(booking._id)
      .populate('learner', 'name avatar email')
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get learner's bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { learner: req.user._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category hourlyRate')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get mentor's incoming booking requests
// @route   GET /api/bookings/incoming
const getIncomingBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { mentor: req.user._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('learner', 'name avatar email')
      .populate('skill', 'name category hourlyRate')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('learner', 'name avatar email')
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category hourlyRate description');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Only learner or mentor can view
    const userId = req.user._id.toString();
    if (
      booking.learner._id.toString() !== userId &&
      booking.mentor._id.toString() !== userId
    ) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a booking
// @route   PUT /api/bookings/:id/accept
const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.mentor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the mentor can accept this booking');
    }

    if (booking.status !== 'pending') {
      res.status(400);
      throw new Error('Only pending bookings can be accepted');
    }

    // Re-check for conflicts before accepting
    const conflict = await hasConflict(
      booking.mentor,
      booking.date,
      booking.startTime,
      booking.endTime,
      booking._id
    );
    if (conflict) {
      res.status(409);
      throw new Error('Cannot accept — you have another session at this time');
    }

    booking.status = 'accepted';
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('learner', 'name avatar email')
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a booking
// @route   PUT /api/bookings/:id/reject
const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.mentor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the mentor can reject this booking');
    }

    if (booking.status !== 'pending') {
      res.status(400);
      throw new Error('Only pending bookings can be rejected');
    }

    booking.status = 'rejected';
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('learner', 'name avatar email')
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (by learner)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.learner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the learner can cancel this booking');
    }

    if (!['pending', 'accepted'].includes(booking.status)) {
      res.status(400);
      throw new Error('This booking cannot be cancelled');
    }

    booking.status = 'cancelled';
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('learner', 'name avatar email')
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a booking (by mentor)
// @route   PUT /api/bookings/:id/complete
const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const userId = req.user._id.toString();
    if (booking.mentor.toString() !== userId && booking.learner.toString() !== userId) {
      res.status(403);
      throw new Error('Only session participants can mark this session as completed');
    }

    if (booking.status !== 'accepted') {
      res.status(400);
      throw new Error('Only accepted bookings can be marked as completed');
    }

    booking.status = 'completed';
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('learner', 'name avatar email')
      .populate('mentor', 'name avatar email')
      .populate('skill', 'name category');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
};
