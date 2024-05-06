
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

//Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;

