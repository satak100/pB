// src/models/taskModel.js
const pool = require('../config/db');

const taskModel = {
    async createTask(task_id, task_name, description, user_id) {
        const query = `
            INSERT INTO tasks (task_id, task_name, description, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING task_id, task_name, description
        `;
        const values = [task_id, task_name, description, user_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async getAllTasks() {
        const query = 'SELECT task_id, task_name FROM tasks ORDER BY created_at DESC';
        const { rows } = await pool.query(query);
        return rows;
    },

    async getSubmissionsByTaskId(task_id) {
        const query = `
            SELECT s.*, u.username
            FROM submissions s
            JOIN users u ON s.user_id = u.id
            WHERE s.task_id = $1
            ORDER BY s.rmse ASC, s.timestamp DESC
        `;
        const { rows } = await pool.query(query, [task_id]);
        return rows;
    }
};

module.exports = taskModel;