import api from './api';

const queueService = {
  getQueues: async (params) => { const response = await api.get('/queues', { params }); return response.data; },
  getCompletedQueues: async () => { const response = await api.get('/queues/completed'); return response.data; },
  getQueue: async (id) => { const response = await api.get(`/queues/${id}`); return response.data; },
  createQueue: async (data) => { const response = await api.post('/queues', data); return response.data; },
  pauseQueue: async (id) => { const response = await api.patch(`/queues/${id}/pause`); return response.data; },
  resumeQueue: async (id) => { const response = await api.patch(`/queues/${id}/resume`); return response.data; },
  closeQueue: async (id) => { const response = await api.patch(`/queues/${id}/close`); return response.data; },
  resetQueue: async (id) => { const response = await api.patch(`/queues/${id}/reset`); return response.data; },
  joinQueue: async (id) => { const response = await api.post(`/queues/${id}/join`); return response.data; },
  callNext: async (id) => { const response = await api.patch(`/queues/${id}/next`); return response.data; },
  leaveQueue: async (queueId, tokenId) => { const response = await api.delete(`/queues/${queueId}/tokens/${tokenId}`); return response.data; },
  getTokenStatus: async (queueId, tokenId) => { const response = await api.get(`/queues/${queueId}/tokens/${tokenId}`); return response.data; }
};

export default queueService;
