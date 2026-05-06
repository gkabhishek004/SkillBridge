import api from './axios';

export const getBatches = () => api.get('/batches');
export const getBatchById = (id) => api.get(`/batches/${id}`);
export const createBatch = (data) => api.post('/batches', data);
export const joinBatch = (inviteCode) => api.post('/batches/join', { inviteCode });
export const assignTrainer = (batchId, trainerId) => api.post(`/batches/${batchId}/trainers`, { trainerId });
export const getInviteInfo = (inviteCode) => api.get(`/batches/invite/${inviteCode}`);
