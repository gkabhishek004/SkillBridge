const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const programmeController = require('../controllers/programme.controller');

router.use(authenticate);

// Programme-wide summary (Manager, Monitoring)
router.get('/summary', requireRole('MANAGER', 'MONITORING'), programmeController.getProgrammeSummary);

// List all programmes
router.get('/', programmeController.listProgrammes);

// Create programme (Manager only)
router.post('/', requireRole('MANAGER'), programmeController.createProgramme);

module.exports = router;
