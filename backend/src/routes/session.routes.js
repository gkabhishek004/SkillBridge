const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const sessionController = require('../controllers/session.controller');

router.use(authenticate);

// Get all sessions (role-filtered)
router.get('/', sessionController.getSessions);

// Get single session
router.get('/:id', sessionController.getSessionById);

// Create session (Trainers only)
router.post('/', requireRole('TRAINER', 'INSTITUTION'), sessionController.createSession);

// Toggle session active status (Trainers only)
router.patch('/:id/toggle', requireRole('TRAINER', 'INSTITUTION'), sessionController.toggleActive);

// Delete session (Trainers only)
router.delete('/:id', requireRole('TRAINER', 'INSTITUTION'), sessionController.deleteSession);

module.exports = router;
