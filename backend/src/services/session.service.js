const prisma = require('../config/db');
const { validateRequired } = require('../utils/validators');

/**
 * Create a new session
 */
const createSession = async ({ title, date, startTime, endTime, batchId }, trainer) => {
  validateRequired({ title, date, startTime, endTime, batchId }, ['title', 'date', 'startTime', 'endTime', 'batchId']);

  // Verify trainer is assigned to this batch
  const batchTrainer = await prisma.batchTrainer.findUnique({
    where: { batchId_trainerId: { batchId, trainerId: trainer.id } },
  });

  if (!batchTrainer && trainer.role !== 'INSTITUTION' && trainer.role !== 'MANAGER') {
    const err = new Error('You are not assigned to this batch');
    err.statusCode = 403;
    throw err;
  }

  const session = await prisma.session.create({
    data: {
      title,
      date: new Date(date),
      startTime,
      endTime,
      batchId,
      createdById: trainer.id,
    },
    include: { batch: { include: { institution: true } }, createdBy: true },
  });

  return session;
};

/**
 * Get sessions for the current user
 */
const getSessionsForUser = async (user) => {
  if (user.role === 'STUDENT') {
    // Get sessions for batches the student is enrolled in
    const batchStudents = await prisma.batchStudent.findMany({
      where: { studentId: user.id },
      select: { batchId: true },
    });
    const batchIds = batchStudents.map((bs) => bs.batchId);

    return prisma.session.findMany({
      where: { batchId: { in: batchIds } },
      include: {
        batch: { include: { institution: true } },
        createdBy: true,
        attendances: { where: { studentId: user.id } },
        _count: { select: { attendances: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  if (user.role === 'TRAINER') {
    return prisma.session.findMany({
      where: { createdById: user.id },
      include: {
        batch: { include: { institution: true } },
        _count: { select: { attendances: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  if (user.role === 'INSTITUTION') {
    return prisma.session.findMany({
      where: { batch: { institutionId: user.institutionId } },
      include: {
        batch: true,
        createdBy: true,
        _count: { select: { attendances: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  // MANAGER and MONITORING see all
  return prisma.session.findMany({
    include: {
      batch: { include: { institution: true } },
      createdBy: true,
      _count: { select: { attendances: true } },
    },
    orderBy: { date: 'desc' },
  });
};

/**
 * Get a single session with attendance details
 */
const getSessionById = async (sessionId, user) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      batch: {
        include: {
          institution: true,
          students: { include: { student: true } },
        },
      },
      createdBy: true,
      attendances: { include: { student: true } },
    },
  });

  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  return session;
};

/**
 * Toggle session active status
 */
const toggleSessionActive = async (sessionId, trainerId) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.createdById !== trainerId) {
    const err = new Error('You can only manage your own sessions');
    err.statusCode = 403;
    throw err;
  }

  return prisma.session.update({
    where: { id: sessionId },
    data: { isActive: !session.isActive },
    include: { batch: true, createdBy: true },
  });
};

/**
 * Delete a session
 */
const deleteSession = async (sessionId, trainerId) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.createdById !== trainerId) {
    const err = new Error('You can only delete your own sessions');
    err.statusCode = 403;
    throw err;
  }

  return prisma.session.delete({ where: { id: sessionId } });
};

module.exports = { createSession, getSessionsForUser, getSessionById, toggleSessionActive, deleteSession };
