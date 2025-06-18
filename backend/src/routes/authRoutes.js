const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register/player', authController.registerPlayer);
router.post('/register/architect', authController.registerArchitect);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/update-username', authenticateToken, authController.updateUsername);

module.exports = router;



