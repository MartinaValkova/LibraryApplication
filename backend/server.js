// server.js
const express = require('express');
const bodyParser = require('body-parser');
const middleware = require('./middleware');
const routes = require('./routes');
require('dotenv').config(); // Load environment variables
const pool = require('./database'); // Import database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
