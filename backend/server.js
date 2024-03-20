const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Book Library API');
});


const users = [
  { id: 1, username: 'librarian', password: 'librarianpassword', role: 'librarian' },
  { id: 2, username: 'reader', password: 'readerpassword', role: 'reader' }
];

// Login endpoint
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with user role
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

