const prisma = require('../config/db');

const BatchTrainerModel = {
  findByBatchAndTrainer: (batchId, trainerId) =>
    prisma.batchTrainer.findUnique({ where: { batchId_trainerId: { batchId, trainerId } } }),

  create: (batchId, trainerId) =>
    prisma.batchTrainer.create({
      data: { batchId, trainerId },
      include: { batch: true, trainer: true },
    }),

  delete: (batchId, trainerId) =>
    prisma.batchTrainer.delete({ where: { batchId_trainerId: { batchId, trainerId } } }),

  findTrainersByBatch: (batchId) =>
    prisma.batchTrainer.findMany({
      where: { batchId },
      include: { trainer: true },
    }),
};

module.exports = BatchTrainerModel;
