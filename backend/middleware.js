const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

function authenticateAndAuthorize() {
  return (req, res, next) => {
    // Check for JWT in headers
    const token = req.headers.authorization;
    
    // If no token provided, return unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify JWT
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = { authenticateAndAuthorize };


