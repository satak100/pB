// src/config/setupDatabase.js
const pool = require('./db');

async function setupDatabase() {
    try {
        // Users table (existing)
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255),
                role VARCHAR(20) NOT NULL CHECK (role IN ('player', 'architect')),
                google_id VARCHAR(255) UNIQUE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;

        // Tasks table (updated to include user_id)
        const createTasksTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                task_id VARCHAR(50) PRIMARY KEY,
                task_name VARCHAR(255) NOT NULL,
                description TEXT,
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;

        // Submissions table
        const createSubmissionsTableQuery = `
            CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
                task_id VARCHAR(50) REFERENCES tasks(task_id),
                model_name VARCHAR(255) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('Human', 'Agent')),
                timestamp TIMESTAMP DEFAULT NOW(),
                rmse FLOAT,
                mae FLOAT,
                cosine_similarity FLOAT,
                kl_divergence FLOAT,
                user_id INTEGER REFERENCES users(id)
            );
        `;

        await pool.query(createUsersTableQuery);
        await pool.query(createTasksTableQuery);
        await pool.query(createSubmissionsTableQuery);
        console.log('Tables created or already exist: users, tasks, submissions');
    } catch (error) {
        console.error('Error setting up database:', error.stack);
    }
}

module.exports = setupDatabase;