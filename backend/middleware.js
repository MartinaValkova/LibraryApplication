const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

function authenticateLibrarian(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    if (decoded.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = { authenticateLibrarian };



