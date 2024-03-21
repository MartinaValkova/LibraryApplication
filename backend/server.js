require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432, // Default PostgreSQL port
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database successfully');
    startServer();
  }
});

function startServer() {
  // Middleware to parse JSON bodies
  app.use(bodyParser.json());

  // Backend routes
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Check credentials against the database
    try {
      const result = await pool.query('SELECT * FROM public."Users_Table" WHERE username = $1 AND password = $2', [username, password]);
      if (result.rows.length === 1) {
        // Generate JWT token
        const token = jwt.sign({ username }, process.env.SECRET_KEY);
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // Serve static files from the 'frontend' directory
  app.use(express.static(path.join(__dirname, '../frontend')));

  // Serve the frontend index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
