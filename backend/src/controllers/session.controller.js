const sessionService = require('../services/session.service');

const createSession = async (req, res) => {
  const session = await sessionService.createSession(req.body, req.user);
  res.status(201).json({ session });
};

const getSessions = async (req, res) => {
  const sessions = await sessionService.getSessionsForUser(req.user);
  res.json({ sessions });
};

const getSessionById = async (req, res) => {
  const session = await sessionService.getSessionById(req.params.id, req.user);
  res.json({ session });
};

const toggleActive = async (req, res) => {
  const session = await sessionService.toggleSessionActive(req.params.id, req.user.id);
  res.json({ session });
};

const deleteSession = async (req, res) => {
  await sessionService.deleteSession(req.params.id, req.user.id);
  res.json({ message: 'Session deleted successfully' });
};

module.exports = { createSession, getSessions, getSessionById, toggleActive, deleteSession };
