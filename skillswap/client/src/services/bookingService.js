import api from './api';

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getIncomingBookings: (params) => api.get('/bookings/incoming', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  acceptBooking: (id) => api.put(`/bookings/${id}/accept`),
  rejectBooking: (id) => api.put(`/bookings/${id}/reject`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  completeBooking: (id) => api.put(`/bookings/${id}/complete`),
  updateStatus: (id, status) => {
    switch (status) {
      case 'accepted':
        return api.put(`/bookings/${id}/accept`);
      case 'rejected':
        return api.put(`/bookings/${id}/reject`);
      case 'cancelled':
        return api.put(`/bookings/${id}/cancel`);
      case 'completed':
        return api.put(`/bookings/${id}/complete`);
      default:
        return api.put(`/bookings/${id}/${status}`);
    }
  },
};
