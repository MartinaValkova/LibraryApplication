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
    process.exit(1); // Exit the process if unable to connect to the database
  } else {
    console.log('Connected to PostgreSQL database successfully');
    startServer();
  }
});

function startServer() {
  // Middleware to parse JSON bodies
  app.use(bodyParser.json());

  // Backend routes

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Check credentials against the database
    try {
      const result = await pool.query('SELECT * FROM public."Users_Table" WHERE username = $1 AND password = $2', [username, password]);
      if (result.rows.length === 1) {
        // Generate JWT token
        const token = jwt.sign({ username }, process.env.SECRET_KEY);
        res.json({ success: true, token }); // Send success response with token
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

// Get all books endpoint
app.get('/api/books', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.title AS title, 
        a.author_name AS author, 
        g.genre_name AS genre 
      FROM 
        public."Books_Table" b
      JOIN 
        public."Authors_Table" a ON b.author_id = a.author_id
      JOIN 
        public."Genres_Table" g ON b.genre_id = g.genre_id
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'An error occurred while fetching books.' });
  }
});


  // Add a new book endpoint
  app.post('/api/books', async (req, res) => {
    const { title, author, genre } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO public."Books_Table" (title, author, genre) VALUES ($1, $2, $3) RETURNING *', [title, author, genre]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error adding book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update an existing book endpoint
  app.patch('/api/books/:id', async (req, res) => {
    const id = req.params.id;
    const { title, author, genre } = req.body;
    try {
      const { rows } = await pool.query('UPDATE public."Books_Table" SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *', [title, author, genre, id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Delete a book endpoint
  app.delete('/api/books/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const { rows } = await pool.query('DELETE FROM public."Books_Table" WHERE id = $1 RETURNING *', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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

