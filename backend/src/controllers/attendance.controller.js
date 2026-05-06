const attendanceService = require('../services/attendance.service');

const markAttendance = async (req, res) => {
  const { sessionId, status } = req.body;
  const attendance = await attendanceService.markAttendance(sessionId, req.user.id, status);
  res.json({ attendance });
};

const getSessionAttendance = async (req, res) => {
  const result = await attendanceService.getSessionAttendance(req.params.sessionId, req.user);
  res.json(result);
};

const getMyAttendance = async (req, res) => {
  const result = await attendanceService.getStudentAttendanceSummary(req.user.id);
  res.json(result);
};

const bulkMarkAttendance = async (req, res) => {
  const { sessionId, records } = req.body;
  const result = await attendanceService.bulkMarkAttendance(sessionId, records, req.user.id);
  res.json({ message: 'Attendance marked successfully', count: result.length });
};

module.exports = { markAttendance, getSessionAttendance, getMyAttendance, bulkMarkAttendance };
