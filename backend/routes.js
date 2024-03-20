// routes.js
const express = require('express');
const router = express.Router();
const pool = require('./database');
const middleware = require('./middleware');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  // For simplicity, let's assume a hardcoded username and password
  const { username, password } = req.body;
  if (username === 'admin' && password === 'adminpassword') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Add middleware to protect routes
router.use(middleware.authenticateToken);

router.get('/books', (req, res) => {
  pool.query('SELECT * FROM Books_Table', (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
});

router.post('/books', (req, res) => {
  // Add a new book
});

router.patch('/books/:id', (req, res) => {
  // Update an existing book
});

router.delete('/books/:id', (req, res) => {
  // Delete a book
});

module.exports = router;

