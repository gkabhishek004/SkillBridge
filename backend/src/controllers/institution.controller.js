const prisma = require('../config/db');
const summaryService = require('../services/summary.service');

const getMyInstitution = async (req, res) => {
  const institution = await prisma.institution.findUnique({
    where: { id: req.user.institutionId },
    include: {
      batches: {
        include: { _count: { select: { students: true, sessions: true } } },
      },
      _count: { select: { batches: true } },
    },
  });

  if (!institution) {
    return res.status(404).json({ error: 'Institution not found' });
  }

  res.json({ institution });
};

const getBatchSummary = async (req, res) => {
  const summary = await summaryService.getBatchSummary(req.params.batchId);
  res.json(summary);
};

const getInstitutionSummary = async (req, res) => {
  const institutionId = req.params.institutionId || req.user.institutionId;
  const summary = await summaryService.getInstitutionSummary(institutionId);
  res.json(summary);
};

const listTrainers = async (req, res) => {
  const trainers = await prisma.user.findMany({
    where: {
      role: 'TRAINER',
      institutionId: req.user.institutionId,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  res.json({ trainers });
};

const createInstitution = async (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }

  const institution = await prisma.institution.create({
    data: { name, code },
  });

  res.status(201).json({ institution });
};

const listInstitutions = async (req, res) => {
  const institutions = await prisma.institution.findMany({
    include: { _count: { select: { batches: true, admins: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ institutions });
};

module.exports = {
  getMyInstitution,
  getBatchSummary,
  getInstitutionSummary,
  listTrainers,
  createInstitution,
  listInstitutions,
};
