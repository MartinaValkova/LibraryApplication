const pool = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY || 'secret';



async function login(req, res) {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM public."Users_Table" WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length === 1) {
            const user = result.rows[0];
            const token = jwt.sign({ username }, process.env.SECRET_KEY);
            res.json({ success: true, token }); // Send success response with token
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = { login };





  async function getAllBooks(req, res) {
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
  }
  
  async function addBook(req, res) {
    const { title, author_id, genre_id } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO public."Books_Table" (title, author_id, genre_id) VALUES ($1, $2, $3) RETURNING *', [title, author_id, genre_id]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error adding book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async function updateBook(req, res) {
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
  }
  
  async function deleteBook(req, res) {
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
  }
  
  module.exports = { login, getAllBooks, addBook, updateBook, deleteBook };