const prisma = require('../config/db');

const BatchStudentModel = {
  findByBatchAndStudent: (batchId, studentId) =>
    prisma.batchStudent.findUnique({ where: { batchId_studentId: { batchId, studentId } } }),

  create: (batchId, studentId) =>
    prisma.batchStudent.create({
      data: { batchId, studentId },
      include: { batch: true, student: true },
    }),

  delete: (batchId, studentId) =>
    prisma.batchStudent.delete({ where: { batchId_studentId: { batchId, studentId } } }),

  findStudentsByBatch: (batchId) =>
    prisma.batchStudent.findMany({
      where: { batchId },
      include: { student: true },
    }),
};

module.exports = BatchStudentModel;
