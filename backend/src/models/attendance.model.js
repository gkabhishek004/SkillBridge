const prisma = require('../config/db');

const AttendanceModel = {
  findBySessionAndStudent: (sessionId, studentId) =>
    prisma.attendance.findUnique({
      where: { sessionId_studentId: { sessionId, studentId } },
    }),

  findBySession: (sessionId) =>
    prisma.attendance.findMany({
      where: { sessionId },
      include: { student: true },
      orderBy: { markedAt: 'asc' },
    }),

  findByStudent: (studentId) =>
    prisma.attendance.findMany({
      where: { studentId },
      include: { session: { include: { batch: true } } },
      orderBy: { markedAt: 'desc' },
    }),

  upsert: (sessionId, studentId, status) =>
    prisma.attendance.upsert({
      where: { sessionId_studentId: { sessionId, studentId } },
      update: { status, updatedAt: new Date() },
      create: { sessionId, studentId, status },
      include: { student: true, session: true },
    }),

  findByBatch: (batchId) =>
    prisma.attendance.findMany({
      where: { session: { batchId } },
      include: {
        student: true,
        session: true,
      },
    }),

  countBySession: (sessionId) =>
    prisma.attendance.groupBy({
      by: ['status'],
      where: { sessionId },
      _count: { status: true },
    }),
};

module.exports = AttendanceModel;
