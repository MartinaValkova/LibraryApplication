require('dotenv').config();// Load environment variables from .env file
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const pool = require('./database');


const { errorHandler } = require('./middleware');
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());

// Error handling middleware

app.use(errorHandler);


// Handle database connection errors
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    // Consider adding retries or other error handling strategies here
  } else {
    console.log('Connected to PostgreSQL database successfully');
    startServer();
  }
});

function startServer() {
  // Import controllers and middleware
  const { login, } = require('./controllers');
  const { authenticate, authorize } = require('./middleware');
  

  // Routes
  const routes = require('./routes');
  app.use('/api', routes);

  // Login endpoint
  app.post('/api/login', login);

   
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

































