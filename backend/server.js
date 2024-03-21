require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
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

  // Serve static files from the 'frontend' directory
  app.use(express.static(path.join(__dirname, '../frontend')));

  // Backend routes
  app.use('/api', require('./routes'));

  // Serve the frontend index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

