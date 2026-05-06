const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const { validateRequired, validateEmail, validateRole } = require('../utils/validators');

const generateToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async ({ email, password, name, role, institutionId }) => {
  validateRequired({ email, password, name, role }, ['email', 'password', 'name', 'role']);
  validateEmail(email);
  validateRole(role);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  if (institutionId) {
    const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
    if (!institution) {
      const err = new Error('Institution not found');
      err.statusCode = 404;
      throw err;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      institutionId: institutionId || null,
    },
    include: { institution: true },
  });

  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const login = async ({ email, password }) => {
  validateRequired({ email, password }, ['email', 'password']);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { institution: true },
  });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { institution: true },
  });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const listInstitutions = async () => {
  return prisma.institution.findMany({ orderBy: { name: 'asc' } });
};

module.exports = { register, login, getProfile, listInstitutions };
