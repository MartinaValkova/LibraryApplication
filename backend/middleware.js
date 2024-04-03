
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';
const expiresIn = '1h'; // Token expires in 1 hour


function authenticate(req, res, next) {
    // Check for JWT in headers
    const token = req.headers.authorization;

    // If no token provided, return unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify JWT
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Attach decoded payload to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying JWT:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { authenticate, errorHandler };

