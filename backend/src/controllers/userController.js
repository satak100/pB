// src/controllers/userController.js
const userModel = require('../models/userModel');

const userController = {
    async getUser(req, res) {
        try {
            const user = await userModel.findUserById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ id: user.id, username: user.username, role: user.role });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user' });
        }
    },
};

module.exports = userController;