const batchService = require('../services/batch.service');

const createBatch = async (req, res) => {
  const batch = await batchService.createBatch(req.body, req.user);
  res.status(201).json({ batch });
};

const getBatches = async (req, res) => {
  const batches = await batchService.getBatchesForUser(req.user);
  res.json({ batches });
};

const getBatchById = async (req, res) => {
  const batch = await batchService.getBatchById(req.params.id, req.user);
  res.json({ batch });
};

const joinBatch = async (req, res) => {
  const { inviteCode } = req.body;
  const batch = await batchService.joinBatch(inviteCode, req.user.id);
  res.json({ message: 'Successfully joined batch', batch });
};

const assignTrainer = async (req, res) => {
  const { trainerId } = req.body;
  const result = await batchService.assignTrainer(req.params.id, trainerId, req.user);
  res.status(201).json({ message: 'Trainer assigned successfully', result });
};

const getInviteInfo = async (req, res) => {
  const batch = await batchService.getInviteInfo(req.params.inviteCode);
  res.json({ batch });
};

module.exports = { createBatch, getBatches, getBatchById, joinBatch, assignTrainer, getInviteInfo };
