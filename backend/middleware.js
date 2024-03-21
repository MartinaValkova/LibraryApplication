const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

function authenticateAndAuthorize(role = null) {
  return (req, res, next) => {
    // Check for JWT in headers
    const token = req.headers.authorization;
    
    // If no token provided, proceed as a reader
    if (!token) {
      // Check if authorization is required and if the user role matches
      if (role && role !== 'reader') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return next();
    }

    // Verify JWT
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;

      // Check if authorization is required and if the user role matches
      if (role && role !== req.user.role) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = { authenticateAndAuthorize };




