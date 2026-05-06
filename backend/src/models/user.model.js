const prisma = require('../config/db');

const UserModel = {
  findByClerkId: (clerkId) =>
    prisma.user.findUnique({ where: { clerkId }, include: { institution: true } }),

  findById: (id) =>
    prisma.user.findUnique({ where: { id }, include: { institution: true } }),

  findByEmail: (email) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data) =>
    prisma.user.create({ data, include: { institution: true } }),

  update: (id, data) =>
    prisma.user.update({ where: { id }, data, include: { institution: true } }),

  findAll: (where = {}) =>
    prisma.user.findMany({ where, include: { institution: true } }),
};

module.exports = UserModel;
