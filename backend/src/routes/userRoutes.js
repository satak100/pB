// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, userController.getUser);

module.exports = router;