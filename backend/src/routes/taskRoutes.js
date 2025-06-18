// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

router.post('/create', verifyToken, restrictTo('architect'), taskController.createTask);
router.get('/tasks', verifyToken, taskController.getTasks);
router.get('/leaderboard/:taskId', verifyToken, taskController.getLeaderboardByTask);

module.exports = router;