const express = require('express');
const cors = require('cors');
require('express-async-errors');

const env = require('./config/env');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const batchRoutes = require('./routes/batch.routes');
const sessionRoutes = require('./routes/session.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const institutionRoutes = require('./routes/institution.routes');
const programmeRoutes = require('./routes/programme.routes');

const app = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://172.22.242.197:3000', env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/programmes', programmeRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
