const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/v1/auth/register', authController.register);
router.post('/v1/auth/login', authController.login);
router.post('/v1/auth/logout', authController.logout);
router.post('/v1/auth/forgot-password', authController.forgotPassword);
router.post('/v1/auth/reset-password', authController.resetPassword);
router.post('/v1/auth/refresh-token', authController.refreshToken);

module.exports = router;
