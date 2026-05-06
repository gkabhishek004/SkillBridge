const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const batchController = require('../controllers/batch.controller');

// All routes require authentication
router.use(authenticate);

// Get invite info (public-ish, any authenticated user)
router.get('/invite/:inviteCode', batchController.getInviteInfo);

// Get all batches (role-filtered)
router.get('/', batchController.getBatches);

// Get single batch
router.get('/:id', batchController.getBatchById);

// Create batch (Institution, Manager)
router.post('/', requireRole('INSTITUTION', 'MANAGER'), batchController.createBatch);

// Join batch via invite code (Students only)
router.post('/join', requireRole('STUDENT'), batchController.joinBatch);

// Assign trainer to batch (Institution, Manager)
router.post('/:id/trainers', requireRole('INSTITUTION', 'MANAGER'), batchController.assignTrainer);

module.exports = router;
