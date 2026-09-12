import api from './axios';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
};

export const resourceService = {
  getAll: (params) => api.get('/resources', { params }),
  getOne: (id) => api.get(`/resources/${id}`),
  getAvailability: (id, date) => api.get(`/resources/${id}/availability`, { params: { date } }),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getCalendar: (params) => api.get('/bookings/calendar', { params }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  // Resources
  getAllResources: () => api.get('/admin/resources'),
  createResource: (data) => api.post('/admin/resources', data),
  updateResource: (id, data) => api.put(`/admin/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/admin/resources/${id}`),
  // Bookings
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  getBooking: (id) => api.get(`/admin/bookings/${id}`),
  updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}`, { status }),
  getCalendar: (params) => api.get('/admin/calendar', { params }),
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
};
