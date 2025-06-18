// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/userModel');

console.log('authController.js loaded successfully'); // Debug log

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {
    async registerPlayer(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const existingUser = await userModel.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.createUser(username, hashedPassword, 'player');
            return res.status(201).json({ message: 'Account created', userId: user.id });
        } catch (error) {
            console.error('Register player error:', error);
            return res.status(500).json({ message: 'Error creating account' });
        }
    },

    async registerArchitect(req, res) {
        try {
            const { username, password, adminKey } = req.body;
            if (!username || !password || !adminKey) {
                return res.status(400).json({ message: 'Username, password, and admin key are required' });
            }

            if (adminKey !== 'super-secret-admin-key') {
                return res.status(403).json({ message: 'Invalid admin key' });
            }

            const existingUser = await userModel.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.createUser(username, hashedPassword, 'architect');
            return res.status(201).json({ message: 'Architect created', userId: user.id });
        } catch (error) {
            console.error('Register architect error:', error);
            return res.status(500).json({ message: 'Error creating architect account' });
        }
    },

    async login(req, res) {
        try {
            console.log('Login attempt:', req.body);
    
            const { username, password } = req.body;
    
            // Step 1: Validate input
            if (!username || !password) {
                console.warn('Login failed: Missing username or password');
                return res.status(400).json({ message: 'Username and password are required' });
            }
    
            // Step 2: Find user by username
            const user = await userModel.findUserByUsername(username);
            if (!user) {
                console.warn(`Login failed: User not found - ${username}`);
                return res.status(401).json({ message: 'Invalid username or password' });
            }
    
            console.log(`User found: ${username} (role: ${user.role})`);
    
            // Step 3: Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.warn(`Login failed: Invalid password for user - ${username}`);
                return res.status(401).json({ message: 'Invalid username or password' });
            }
    
            // Step 4: Generate JWT
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is not set in environment variables');
                return res.status(500).json({ message: 'Server configuration error' });
            }
    
            const tokenPayload = { id: user.id, role: user.role };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            console.log(`Login successful: ${username}, Token issued`);
    
            return res.status(200).json({
                token,
                role: user.role,
                username: user.username
            });
    
        } catch (error) {
            console.error('Unexpected login error:', {
                message: error.message,
                stack: error.stack,
                input: req.body
            });
            return res.status(500).json({ message: 'Server error' });
        }
    },
    
    async googleLogin(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ message: 'Google token is required' });
            }

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const googleId = payload['sub'];
            const defaultUsername = payload['email'] ? payload['email'].split('@')[0] : `googleuser_${googleId}`;

            let user = await userModel.findUserByGoogleId(googleId);
            if (!user) {
                user = await userModel.createUser(defaultUsername, null, 'player', googleId);
            }

            const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token: jwtToken, role: user.role, username: user.username });
        } catch (error) {
            console.error('Google login error:', error);
            return res.status(500).json({ message: 'Error with Google login' });
        }
    },

    async forgotPassword(req, res) {
        try {
            const { username } = req.body;
            if (!username) {
                return res.status(400).json({ message: 'Username is required' });
            }

            const user = await userModel.findUserByUsername(username);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            console.log(`Password reset requested for username: ${username}`);
            return res.status(200).json({ message: 'Password reset link sent! Check your email.' });
        } catch (error) {
            console.error('Forgot password error:', error);
            return res.status(500).json({ message: 'Error processing request' });
        }
    },

    async updateUsername(req, res) {
        try {
            const { username } = req.body;
            const userId = req.user.id;

            if (!username || username.trim() === "") {
                return res.status(400).json({ message: 'Username cannot be empty' });
            }

            const existingUser = await userModel.findUserByUsername(username);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Username already taken' });
            }

            await userModel.updateUsername(userId, username.trim());
            res.status(200).json({ message: 'Username updated successfully' });
        } catch (error) {
            console.error('Update username error:', error);
            res.status(500).json({ message: 'Error updating username' });
        }
    }
};

console.log('authController.js module exported'); // Debug log
module.exports = authController;