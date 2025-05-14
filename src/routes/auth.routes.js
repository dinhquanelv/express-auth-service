const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const requireAuth = require('../middleware/requireAuth');

// authentication
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.delete('/auth/logout', requireAuth, authController.logout);

// password recovery
router.post('/auth/password/forgot', authController.forgotPassword);
router.post('/auth/password/reset', authController.resetPassword);

// token management
router.post('/auth/token/refresh', authController.refreshToken);

module.exports = router;
