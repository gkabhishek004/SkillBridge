const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

// Public routes
router.get('/institutions', authController.listInstitutions);
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
