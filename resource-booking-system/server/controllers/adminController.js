const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const User = require('../models/User');

// ==================== RESOURCE MANAGEMENT ====================

// @desc    Create resource
// @route   POST /api/admin/resources
// @access  Admin
const createResource = async (req, res, next) => {
  try {
    const { name, type, description, location, capacity, features, image, status } = req.body;

    if (!name || !type || !description || !location || !capacity) {
      return res.status(400).json({ success: false, message: 'Name, type, description, location and capacity are required' });
    }

    const resource = await Resource.create({
      name, type, description, location, capacity,
      features: features || [],
      image: image || '',
      status: status || 'AVAILABLE',
    });

    res.status(201).json({ success: true, message: 'Resource created', data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource
// @route   PUT /api/admin/resources/:id
// @access  Admin
const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.status(200).json({ success: true, message: 'Resource updated', data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete resource
// @route   DELETE /api/admin/resources/:id
// @access  Admin
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Soft delete — preserve booking history
    resource.isActive = false;
    resource.status = 'INACTIVE';
    await resource.save();

    res.status(200).json({ success: true, message: 'Resource deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL resources (including inactive) for admin
// @route   GET /api/admin/resources
// @access  Admin
const getAllResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

// ==================== BOOKING MANAGEMENT ====================

// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings
// @access  Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, resourceId, search, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (resourceId) query.resource = resourceId;
    if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };
    else if (startDate) query.date = { $gte: startDate };
    else if (endDate) query.date = { $lte: endDate };

    let bookings = await Booking.find(query)
      .populate('resource', 'name type location')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    // Search filter (post-populate)
    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter((b) =>
        b.bookingRef?.toLowerCase().includes(s) ||
        b.user?.name?.toLowerCase().includes(s) ||
        b.user?.email?.toLowerCase().includes(s) ||
        b.resource?.name?.toLowerCase().includes(s)
      );
    }

    const total = bookings.length;
    const startIdx = (page - 1) * limit;
    const paginated = bookings.slice(startIdx, startIdx + Number(limit));

    res.status(200).json({ success: true, total, count: paginated.length, data: paginated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking detail (admin)
// @route   GET /api/admin/bookings/:id
// @access  Admin
const getAdminBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('resource', 'name type location capacity features image')
      .populate('user', 'name email phone role');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (admin)
// @route   PATCH /api/admin/bookings/:id
// @access  Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Validate transitions
    const allowed = {
      CONFIRMED: ['CANCELLED', 'COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!allowed[booking.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`,
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking status updated', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for admin calendar
// @route   GET /api/admin/calendar
// @access  Admin
const getAdminCalendar = async (req, res, next) => {
  try {
    const { resourceId, startDate, endDate, status } = req.query;

    const query = {};
    if (resourceId) query.resource = resourceId;
    if (status) query.status = status;
    else query.status = { $in: ['CONFIRMED', 'COMPLETED'] };
    if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };

    const bookings = await Booking.find(query)
      .populate('resource', 'name type location')
      .populate('user', 'name email');

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// ==================== DASHBOARD STATS ====================

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalResources,
      availableResources,
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalUsers,
      recentBookings,
    ] = await Promise.all([
      Resource.countDocuments({ isActive: true }),
      Resource.countDocuments({ isActive: true, status: 'AVAILABLE' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'CONFIRMED' }),
      Booking.countDocuments({ status: 'COMPLETED' }),
      Booking.countDocuments({ status: 'CANCELLED' }),
      User.countDocuments({ role: 'USER' }),
      Booking.find()
        .populate('resource', 'name type')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalResources,
        availableResources,
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalUsers,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    // Attach booking counts
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const bookingCount = await Booking.countDocuments({ user: u._id });
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          isActive: u.isActive,
          bookingCount,
          createdAt: u.createdAt,
        };
      })
    );

    res.status(200).json({ success: true, count: users.length, data: usersWithCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (role/isActive)
// @route   PATCH /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString() && (role === 'USER' || isActive === false)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own admin access or deactivate your own account',
      });
    }

    const updates = {};
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource, updateResource, deleteResource, getAllResources,
  getAllBookings, getAdminBooking, updateBookingStatus, getAdminCalendar,
  getDashboardStats,
  getAllUsers, updateUser,
};
