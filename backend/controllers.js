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
            const tokenPayload = {
                username: user.username,
                role: user.role // The role is stored in the database
            };
            const token = jwt.sign(tokenPayload, process.env.SECRET_KEY);
            res.json({ success: true, token }); // Send success response with token
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



async function getAllBooks(req, res) {
    try {
        const query = `
            SELECT 
                b.book_id AS book_id,
                b.title AS title, 
                b.author_name AS author, 
                g.genre_name AS genre 
            FROM 
                public."Books_Table" b
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
    const { title, author_name, genre_id } = req.body;
    try {
        // Check if any of the fields are empty
        if (!title || !author_name || !genre_id) {
            return res.status(400).json({ success: false, error: 'Title, author name, and genre ID are required' });
        }

        // Insert the new book with author_name and genre_id
        const insertQuery = 'INSERT INTO public."Books_Table" (title, author_name, genre_id) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await pool.query(insertQuery, [title, author_name, genre_id]);

        // Check if the book was successfully added
        if (rows.length > 0) {
            const addedBook = rows[0];
            res.status(201).json({ success: true, message: 'Book added successfully', book: addedBook });
        } else {
            throw new Error('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


// Update Existing Book

async function updateBook(req, res) {
    const book_id = req.params.id; // Update this line to correctly extract the book_id parameter
    const { title, author_name, genre_id } = req.body;
    try {
        // Check if any of the fields are empty
        if (!title || !author_name || !genre_id) {
            return res.status(400).json({ error: 'Title, author name, and genre ID are required' });
        }

        // Update the book in the database
        const query = 'UPDATE public."Books_Table" SET title = $1, author_name = $2, genre_id = $3 WHERE book_id = $4 RETURNING *';
        const { rows } = await pool.query(query, [title, author_name, genre_id, book_id]);

        // Check if the book was found and updated
        if (rows.length === 0) {
            return res.status(404).json({ error: `Book not found with ID: ${book_id}` });
        }

        // Return the updated book
        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Delete Book
async function deleteBook(req, res) {
    const bookId = req.params.id;
    try {
        // Delete the book from the database based on the book ID
        const deleteQuery = 'DELETE FROM public."Books_Table" WHERE book_id = $1 RETURNING *';
        const { rows } = await pool.query(deleteQuery, [bookId]);

        // Check if the book was successfully deleted
        if (rows.length > 0) {
            res.status(200).json({ success: true, message: 'Book deleted successfully' });
        } else {
            throw new Error('Book not found');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


function logout(req, res) {
    // Perform any necessary server-side logout actions
    // For example, clearing session data, invalidating tokens, etc.
    // Then, send a response to the client indicating successful logout
    res.status(200).json({ success: true, message: 'Logout successful' });
}

module.exports = { login, logout, getAllBooks, addBook, updateBook, deleteBook };

  
