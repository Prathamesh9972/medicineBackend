const jwt = require('jsonwebtoken');

// Main authentication middleware
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                msg: 'No authorization header found' 
            });
        }

        // Check for correct Bearer format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                msg: 'Invalid token format. Use Bearer scheme' 
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                msg: 'No token provided' 
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user info to request
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ 
                success: false, 
                msg: 'Token is not valid' 
            });
        }
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            msg: 'Server error' 
        });
    }
};

// Role authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                msg: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                msg: 'Not authorized to access this route'
            });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };