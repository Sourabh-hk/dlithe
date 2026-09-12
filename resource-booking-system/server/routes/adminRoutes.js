const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createResource, updateResource, deleteResource, getAllResources,
  getAllBookings, getAdminBooking, updateBookingStatus, getAdminCalendar,
  getDashboardStats,
  getAllUsers, updateUser,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

// Stats
router.get('/stats', getDashboardStats);

// Resources
router.get('/resources', getAllResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

// Bookings
router.get('/bookings', getAllBookings);
router.get('/calendar', getAdminCalendar);
router.get('/bookings/:id', getAdminBooking);
router.patch('/bookings/:id', updateBookingStatus);

// Users
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);

module.exports = router;
