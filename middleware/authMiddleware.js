const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header (e.g., Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Split the "Bearer" prefix from the actual token string
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

            // Find the user belonging to this token and attach them to the request object
            req.user = await User.findById(decoded.id);
            
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found with this token' });
            }

            next(); // Keep moving to the controller!
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};