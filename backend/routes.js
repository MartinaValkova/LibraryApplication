const express = require('express');
const router = express.Router();
const pool = require('./database');

// GET all books
router.get('/books', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new book
router.post('/books', async (req, res) => {
  const { title, author, genre } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *', [title, author, genre]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH (update) an existing book
router.patch('/books/:id', async (req, res) => {
  const id = req.params.id;
  const { title, author, genre } = req.body;
  try {
    const { rows } = await pool.query('UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *', [title, author, genre, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a book
router.delete('/books/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;







