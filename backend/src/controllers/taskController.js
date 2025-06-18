// src/controllers/taskController.js
const taskModel = require('../models/taskModel');

const taskController = {
    async createTask(req, res) {
        try {
            const { task_id, task_name, description } = req.body;
            const user_id = req.user.id; // From authenticateToken middleware

            if (!task_id || !task_name || !description) {
                return res.status(400).json({ message: 'Task ID, name, and description are required' });
            }

            // Check if user is an architect
            if (req.user.role !== 'architect') {
                return res.status(403).json({ message: 'Only architects can create tasks' });
            }

            const task = await taskModel.createTask(task_id, task_name, description, user_id);
            return res.status(201).json({ message: 'Task created successfully', task });
        } catch (error) {
            console.error('Error creating task:', error);
            return res.status(500).json({ message: 'Error creating task' });
        }
    },

    async getTasks(req, res) {
        try {
            const tasks = await taskModel.getAllTasks();
            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
    },

    async getLeaderboardByTask(req, res) {
        try {
            const { taskId } = req.params;
            const submissions = await taskModel.getSubmissionsByTaskId(taskId);
            return res.status(200).json(submissions);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return res.status(500).json({ message: 'Error fetching leaderboard' });
        }
    }
};

module.exports = taskController;