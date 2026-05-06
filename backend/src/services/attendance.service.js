const prisma = require('../config/db');
const { validateRequired } = require('../utils/validators');

/**
 * Mark attendance for a session
 */
const markAttendance = async (sessionId, studentId, status) => {
  validateRequired({ sessionId, studentId, status }, ['sessionId', 'studentId', 'status']);

  const validStatuses = ['PRESENT', 'ABSENT', 'LATE'];
  if (!validStatuses.includes(status)) {
    const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  // Verify session exists and is active
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { batch: { include: { students: true } } },
  });

  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  if (!session.isActive) {
    const err = new Error('This session is not currently active for attendance marking');
    err.statusCode = 400;
    throw err;
  }

  // Verify student is enrolled in the batch
  const enrolled = session.batch.students.some((bs) => bs.studentId === studentId);
  if (!enrolled) {
    const err = new Error('You are not enrolled in this batch');
    err.statusCode = 403;
    throw err;
  }

  return prisma.attendance.upsert({
    where: { sessionId_studentId: { sessionId, studentId } },
    update: { status, updatedAt: new Date() },
    create: { sessionId, studentId, status },
    include: { student: true, session: true },
  });
};

/**
 * Get attendance for a session (trainer view)
 */
const getSessionAttendance = async (sessionId, requestingUser) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      batch: {
        include: {
          students: { include: { student: true } },
          institution: true,
        },
      },
      createdBy: true,
    },
  });

  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  // Check access
  if (requestingUser.role === 'TRAINER' && session.createdById !== requestingUser.id) {
    // Also allow trainers assigned to the batch
    const batchTrainer = await prisma.batchTrainer.findUnique({
      where: { batchId_trainerId: { batchId: session.batchId, trainerId: requestingUser.id } },
    });
    if (!batchTrainer) {
      const err = new Error('Access denied');
      err.statusCode = 403;
      throw err;
    }
  }

  const attendances = await prisma.attendance.findMany({
    where: { sessionId },
    include: { student: true },
  });

  // Build a complete list: all enrolled students with their attendance status
  const attendanceMap = {};
  attendances.forEach((a) => {
    attendanceMap[a.studentId] = a;
  });

  const result = session.batch.students.map((bs) => ({
    student: bs.student,
    attendance: attendanceMap[bs.studentId] || null,
    status: attendanceMap[bs.studentId]?.status || 'NOT_MARKED',
  }));

  return { session, attendanceRecords: result };
};

/**
 * Get attendance summary for a student
 */
const getStudentAttendanceSummary = async (studentId) => {
  const attendances = await prisma.attendance.findMany({
    where: { studentId },
    include: { session: { include: { batch: { include: { institution: true } } } } },
    orderBy: { markedAt: 'desc' },
  });

  const total = attendances.length;
  const present = attendances.filter((a) => a.status === 'PRESENT').length;
  const late = attendances.filter((a) => a.status === 'LATE').length;
  const absent = attendances.filter((a) => a.status === 'ABSENT').length;
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return { attendances, summary: { total, present, late, absent, percentage } };
};

/**
 * Bulk mark attendance (trainer marks for all students)
 */
const bulkMarkAttendance = async (sessionId, records, trainerId) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { batch: { include: { students: true } } },
  });

  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.createdById !== trainerId) {
    const batchTrainer = await prisma.batchTrainer.findUnique({
      where: { batchId_trainerId: { batchId: session.batchId, trainerId } },
    });
    if (!batchTrainer) {
      const err = new Error('Access denied');
      err.statusCode = 403;
      throw err;
    }
  }

  const validStatuses = ['PRESENT', 'ABSENT', 'LATE'];
  const operations = records.map(({ studentId, status }) => {
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status: ${status}`);
      err.statusCode = 400;
      throw err;
    }
    return prisma.attendance.upsert({
      where: { sessionId_studentId: { sessionId, studentId } },
      update: { status, updatedAt: new Date() },
      create: { sessionId, studentId, status },
    });
  });

  return prisma.$transaction(operations);
};

module.exports = { markAttendance, getSessionAttendance, getStudentAttendanceSummary, bulkMarkAttendance };
