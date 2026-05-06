import api from './axios';

export const markAttendance = (sessionId, status) =>
  api.post('/attendance/mark', { sessionId, status });

export const getSessionAttendance = (sessionId) =>
  api.get(`/attendance/session/${sessionId}`);

export const getMyAttendance = () => api.get('/attendance/my');

export const bulkMarkAttendance = (sessionId, records) =>
  api.post('/attendance/bulk', { sessionId, records });

export const getBatchSummary = (batchId) =>
  api.get(`/institutions/batch/${batchId}/summary`);

export const getInstitutionSummary = (institutionId) =>
  api.get(`/institutions/${institutionId}/summary`);

export const getProgrammeSummary = () => api.get('/programmes/summary');
