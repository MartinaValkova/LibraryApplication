const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';


function authenticate(req, res, next) {
    // Check for JWT in headers
    const authHeader = req.headers.authorization;

    // If no token provided, return unauthorized
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from header

    // Verify JWT
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Attach decoded payload to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying JWT:', error.message);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // For other errors, return a generic unauthorized message
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

function authorize(roles) {
    return (req, res, next) => {
        const userRole = req.user.role;

        // Check if the user's role has the necessary permissions
        if (roles.includes(userRole)) {
            next();
        } else {
            // User's role does not have necessary permissions
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
    };
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { authenticate, authorize, errorHandler };


