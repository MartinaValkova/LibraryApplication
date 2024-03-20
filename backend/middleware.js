const jwt = require('jsonwebtoken');

// Authentication middleware
function authenticateToken(req, res, next) {
  // Extract the JWT token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    
    // If the token is valid, save the decoded payload to the request object
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateToken
};
