const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const institutionController = require('../controllers/institution.controller');

router.use(authenticate);

// List all institutions (Manager, Monitoring)
router.get('/', requireRole('MANAGER', 'MONITORING', 'INSTITUTION'), institutionController.listInstitutions);

// Create institution (Manager only)
router.post('/', requireRole('MANAGER'), institutionController.createInstitution);

// Get my institution details (Institution admin)
router.get('/me', requireRole('INSTITUTION'), institutionController.getMyInstitution);

// List trainers in my institution
router.get('/trainers', requireRole('INSTITUTION', 'MANAGER'), institutionController.listTrainers);

// Get batch summary
router.get('/batch/:batchId/summary', institutionController.getBatchSummary);

// Get institution summary
router.get('/:institutionId/summary', institutionController.getInstitutionSummary);

module.exports = router;
