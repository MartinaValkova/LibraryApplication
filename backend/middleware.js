const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';


function authenticate(req, res, next) {
    // Check for JWT in headers
    const token = req.headers.authorization;

    // If no token provided, or if the token does not have a valid librarian role, return unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify JWT
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Check if the user is a librarian
        if (decoded.role !== 'librarian') {
            return res.status(403).json({ message: 'Forbidden' }); // Only librarians are allowed
        }
        // Attach decoded payload to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying JWT:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { authenticate };


