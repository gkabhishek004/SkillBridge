const prisma = require('../config/db');

const SessionModel = {
  findById: (id) =>
    prisma.session.findUnique({
      where: { id },
      include: {
        batch: { include: { institution: true } },
        createdBy: true,
        _count: { select: { attendances: true } },
      },
    }),

  findByBatch: (batchId) =>
    prisma.session.findMany({
      where: { batchId },
      include: {
        createdBy: true,
        _count: { select: { attendances: true } },
      },
      orderBy: { date: 'desc' },
    }),

  findByTrainer: (trainerId) =>
    prisma.session.findMany({
      where: { createdById: trainerId },
      include: {
        batch: { include: { institution: true } },
        _count: { select: { attendances: true } },
      },
      orderBy: { date: 'desc' },
    }),

  findActiveSessions: (batchIds) =>
    prisma.session.findMany({
      where: { batchId: { in: batchIds }, isActive: true },
      include: {
        batch: true,
        createdBy: true,
      },
    }),

  create: (data) =>
    prisma.session.create({
      data,
      include: { batch: true, createdBy: true },
    }),

  update: (id, data) =>
    prisma.session.update({
      where: { id },
      data,
      include: { batch: true, createdBy: true },
    }),

  delete: (id) => prisma.session.delete({ where: { id } }),

  findAll: () =>
    prisma.session.findMany({
      include: {
        batch: { include: { institution: true } },
        createdBy: true,
        _count: { select: { attendances: true } },
      },
      orderBy: { date: 'desc' },
    }),
};

module.exports = SessionModel;
