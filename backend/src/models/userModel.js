// src/models/userModel.js
const pool = require('../config/db');

const userModel = {
    async createUser(username, password, role, googleId = null) {
        const query = `
            INSERT INTO users (username, password, role, google_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, role
        `;
        const values = [username, password, role, googleId];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async findUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const { rows } = await pool.query(query, [username]);
        return rows[0];
    },

    async findUserByGoogleId(googleId) {
        const query = 'SELECT * FROM users WHERE google_id = $1';
        const { rows } = await pool.query(query, [googleId]);
        return rows[0];
    },

    async updateUsername(userId, username) {
        const query = `
            UPDATE users
            SET username = $1
            WHERE id = $2
            RETURNING id, username, role
        `;
        const values = [username, userId];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
};
module.exports = userModel;
