const express = require('express');
const router = express.Router();
const pool = require('./database');
const { authenticateAndAuthorize } = require('./middleware');


// GET all books (Public route)
router.get('/books', async (req, res) => {
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





// POST a new book (Librarian route)
router.post('/books', authenticateAndAuthorize('librarian'), async (req, res) => {
  const { title, author_id, genre_id } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO public."Books_Table" (title, author_id, genre_id) VALUES ($1, $2, $3) RETURNING *', [title, author_id, genre_id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH (update) an existing book (Librarian route)
router.patch('/books/:id', authenticateAndAuthorize('librarian'), async (req, res) => {
  const id = req.params.id;
  const { title, author_id, genre_id } = req.body;
  try {
    const { rows } = await pool.query('UPDATE public."Books_Table" SET title = $1, author_id = $2, genre_id = $3 WHERE book_id = $4 RETURNING *', [title, author_id, genre_id, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a book (Librarian route)
router.delete('/books/:id', authenticateAndAuthorize('librarian'), async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query('DELETE FROM public."Books_Table" WHERE book_id = $1 RETURNING *', [id]);
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




