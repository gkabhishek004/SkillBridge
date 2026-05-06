import api from './axios';

export const getSessions = () => api.get('/sessions');
export const getSessionById = (id) => api.get(`/sessions/${id}`);
export const createSession = (data) => api.post('/sessions', data);
export const toggleSessionActive = (id) => api.patch(`/sessions/${id}/toggle`);
export const deleteSession = (id) => api.delete(`/sessions/${id}`);
