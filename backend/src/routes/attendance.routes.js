const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const attendanceController = require('../controllers/attendance.controller');

router.use(authenticate);

// Student marks their own attendance
router.post('/mark', requireRole('STUDENT'), attendanceController.markAttendance);

// Student views their own attendance summary
router.get('/my', requireRole('STUDENT'), attendanceController.getMyAttendance);

// Trainer bulk-marks attendance for a session
router.post('/bulk', requireRole('TRAINER', 'INSTITUTION'), attendanceController.bulkMarkAttendance);

// Get attendance for a specific session (Trainer, Institution, Manager, Monitoring)
router.get('/session/:sessionId', attendanceController.getSessionAttendance);

module.exports = router;
