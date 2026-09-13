import api from './api';

export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getMentorReviews: (mentorId) => api.get(`/reviews/mentor/${mentorId}`),
  getMyReviews: () => api.get('/reviews/my'),
};
