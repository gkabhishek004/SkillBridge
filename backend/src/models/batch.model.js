const prisma = require('../config/db');

const BatchModel = {
  findById: (id) =>
    prisma.batch.findUnique({
      where: { id },
      include: {
        institution: true,
        programme: true,
        trainers: { include: { trainer: true } },
        students: { include: { student: true } },
        _count: { select: { sessions: true, students: true } },
      },
    }),

  findByInviteCode: (inviteCode) =>
    prisma.batch.findUnique({
      where: { inviteCode },
      include: { institution: true, programme: true },
    }),

  findByInstitution: (institutionId) =>
    prisma.batch.findMany({
      where: { institutionId },
      include: {
        programme: true,
        trainers: { include: { trainer: true } },
        _count: { select: { sessions: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  findByTrainer: (trainerId) =>
    prisma.batch.findMany({
      where: { trainers: { some: { trainerId } } },
      include: {
        institution: true,
        programme: true,
        _count: { select: { sessions: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  findByStudent: (studentId) =>
    prisma.batch.findMany({
      where: { students: { some: { studentId } } },
      include: {
        institution: true,
        programme: true,
        trainers: { include: { trainer: true } },
        _count: { select: { sessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  create: (data) =>
    prisma.batch.create({
      data,
      include: { institution: true, programme: true },
    }),

  update: (id, data) =>
    prisma.batch.update({
      where: { id },
      data,
      include: { institution: true, programme: true },
    }),

  delete: (id) => prisma.batch.delete({ where: { id } }),

  findAll: () =>
    prisma.batch.findMany({
      include: {
        institution: true,
        programme: true,
        _count: { select: { sessions: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
};

module.exports = BatchModel;
