const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

// @desc    Get all resources (public, with filters)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const { search, type, location, minCapacity, status, isActive } = req.query;

    const query = { isActive: true };

    // Filter by status if provided; otherwise show only AVAILABLE
    if (status) {
      query.status = status;
    }

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minCapacity) query.capacity = { $gte: Number(minCapacity) };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, isActive: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resource availability for a date
// @route   GET /api/resources/:id/availability
// @access  Public
const getAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const resource = await Resource.findOne({ _id: req.params.id, isActive: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const bookings = await Booking.find({
      resource: req.params.id,
      date,
      status: { $in: ['CONFIRMED'] },
    })
      .select('startTime endTime status user')
      .lean();

    // Sanitize — don't expose user details to others
    const sanitized = bookings.map((b) => ({
      _id: b._id,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
    }));

    res.status(200).json({ success: true, data: { resource, bookings: sanitized } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources, getResource, getAvailability };
