const authService = require('../services/auth.service');

const register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};

const getProfile = async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json({ user });
};

const listInstitutions = async (req, res) => {
  const institutions = await authService.listInstitutions();
  res.json({ institutions });
};

module.exports = { register, login, getProfile, listInstitutions };
