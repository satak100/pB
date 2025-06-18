const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 requests per window
    message: { message: 'Too many login attempts, please try again later' },
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit to 3 requests per window
    message: { message: 'Too many registration attempts, please try again later' },
});

module.exports = { loginLimiter, registerLimiter };