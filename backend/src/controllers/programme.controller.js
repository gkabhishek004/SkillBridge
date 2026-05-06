const prisma = require('../config/db');
const summaryService = require('../services/summary.service');

const getProgrammeSummary = async (req, res) => {
  const summary = await summaryService.getProgrammeSummary();
  res.json(summary);
};

const listProgrammes = async (req, res) => {
  const programmes = await prisma.programme.findMany({
    include: {
      institution: true,
      _count: { select: { batches: true } },
    },
    orderBy: { name: 'asc' },
  });
  res.json({ programmes });
};

const createProgramme = async (req, res) => {
  const { name, description, institutionId } = req.body;
  if (!name || !institutionId) {
    return res.status(400).json({ error: 'Name and institutionId are required' });
  }

  const programme = await prisma.programme.create({
    data: { name, description, institutionId },
    include: { institution: true },
  });

  res.status(201).json({ programme });
};

module.exports = { getProgrammeSummary, listProgrammes, createProgramme };
