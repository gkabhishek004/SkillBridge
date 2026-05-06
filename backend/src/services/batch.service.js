const prisma = require('../config/db');
const { generateInviteCode } = require('../utils/generateInviteLink');
const { validateRequired } = require('../utils/validators');

/**
 * Create a new batch
 */
const createBatch = async ({ name, institutionId, programmeId }, creatorUser) => {
  validateRequired({ name, institutionId }, ['name', 'institutionId']);

  // Institution admins can only create batches for their institution
  if (creatorUser.role === 'INSTITUTION' && creatorUser.institutionId !== institutionId) {
    const err = new Error('You can only create batches for your institution');
    err.statusCode = 403;
    throw err;
  }

  const inviteCode = generateInviteCode();

  const batch = await prisma.batch.create({
    data: {
      name,
      institutionId,
      programmeId: programmeId || null,
      inviteCode,
    },
    include: { institution: true, programme: true },
  });

  return batch;
};

/**
 * Get batches for the current user based on role
 */
const getBatchesForUser = async (user) => {
  if (user.role === 'STUDENT') {
    return prisma.batch.findMany({
      where: { students: { some: { studentId: user.id } } },
      include: {
        institution: true,
        programme: true,
        trainers: { include: { trainer: true } },
        _count: { select: { sessions: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (user.role === 'TRAINER') {
    return prisma.batch.findMany({
      where: { trainers: { some: { trainerId: user.id } } },
      include: {
        institution: true,
        programme: true,
        _count: { select: { sessions: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (user.role === 'INSTITUTION') {
    return prisma.batch.findMany({
      where: { institutionId: user.institutionId },
      include: {
        programme: true,
        trainers: { include: { trainer: true } },
        _count: { select: { sessions: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // MANAGER and MONITORING see all batches
  return prisma.batch.findMany({
    include: {
      institution: true,
      programme: true,
      _count: { select: { sessions: true, students: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get a single batch by ID
 */
const getBatchById = async (batchId, user) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      institution: true,
      programme: true,
      trainers: { include: { trainer: true } },
      students: { include: { student: true } },
      sessions: {
        include: { createdBy: true, _count: { select: { attendances: true } } },
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!batch) {
    const err = new Error('Batch not found');
    err.statusCode = 404;
    throw err;
  }

  return batch;
};

/**
 * Join a batch using invite code (students only)
 */
const joinBatch = async (inviteCode, studentId) => {
  const batch = await prisma.batch.findUnique({ where: { inviteCode } });
  if (!batch) {
    const err = new Error('Invalid invite code');
    err.statusCode = 404;
    throw err;
  }

  // Check if already joined
  const existing = await prisma.batchStudent.findUnique({
    where: { batchId_studentId: { batchId: batch.id, studentId } },
  });

  if (existing) {
    const err = new Error('You have already joined this batch');
    err.statusCode = 409;
    throw err;
  }

  await prisma.batchStudent.create({ data: { batchId: batch.id, studentId } });

  return batch;
};

/**
 * Assign a trainer to a batch
 */
const assignTrainer = async (batchId, trainerId, institutionUser) => {
  const batch = await prisma.batch.findUnique({ where: { id: batchId } });
  if (!batch) {
    const err = new Error('Batch not found');
    err.statusCode = 404;
    throw err;
  }

  if (institutionUser.role === 'INSTITUTION' && batch.institutionId !== institutionUser.institutionId) {
    const err = new Error('You can only manage batches in your institution');
    err.statusCode = 403;
    throw err;
  }

  const trainer = await prisma.user.findUnique({ where: { id: trainerId } });
  if (!trainer || trainer.role !== 'TRAINER') {
    const err = new Error('Trainer not found');
    err.statusCode = 404;
    throw err;
  }

  const existing = await prisma.batchTrainer.findUnique({
    where: { batchId_trainerId: { batchId, trainerId } },
  });

  if (existing) {
    const err = new Error('Trainer already assigned to this batch');
    err.statusCode = 409;
    throw err;
  }

  return prisma.batchTrainer.create({
    data: { batchId, trainerId },
    include: { trainer: true, batch: true },
  });
};

/**
 * Get invite link info
 */
const getInviteInfo = async (inviteCode) => {
  const batch = await prisma.batch.findUnique({
    where: { inviteCode },
    include: { institution: true, programme: true, _count: { select: { students: true } } },
  });

  if (!batch) {
    const err = new Error('Invalid invite code');
    err.statusCode = 404;
    throw err;
  }

  return batch;
};

module.exports = { createBatch, getBatchesForUser, getBatchById, joinBatch, assignTrainer, getInviteInfo };
