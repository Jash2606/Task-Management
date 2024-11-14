
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        const token =
        req.cookies?.token ||
        req.body?.token ||
        req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is missing. Please log in and try again.',
        });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const userExists = await User.findById(decoded.id);
            if (!userExists) {
                return res.status(401).json({
                success: false,
                message: 'User associated with this token no longer exists. Please log in again.',
                });
            }

            next();
        } catch (error) {
            let errorMessage = 'Invalid authentication token. Please log in again.';
            if (error.name === 'TokenExpiredError') {
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (error.name === 'JsonWebTokenError') {
                errorMessage = 'Invalid token. Please log in again.';
            }

            return res.status(401).json({
                success: false,
                message: errorMessage,
            });
        }
    } catch (error) {
        console.error('Error occurred during authentication:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred during authentication. Please try again later.',
        });
    }
};