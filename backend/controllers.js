const pool = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');// Import bcrypt
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';


// Function to authenticate user credentials and generate JWT token
async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Query the database to find the user with the provided credentials
        const result = await pool.query('SELECT * FROM public."Users_Table" WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length === 1) {
            // User found, generate JWT token
            const user = result.rows[0];
            const tokenPayload = {
                username: user.username,
                role: user.role // The role is stored in the database
            };
            const token = jwt.sign(tokenPayload, process.env.SECRET_KEY);
            res.json({ success: true, token }); // Send success response with token
        } else {
            // User not found or invalid credentials
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        // Error occurred during login process
        console.error('Error authenticating user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



// Function to search books by title, author, and genre
async function searchBooks(req, res) {
    const { query, author, genre } = req.query;

    try {
        let searchQuery = `
            SELECT 
                b.book_id AS book_id,
                b.title AS title, 
                b.author_name AS author, 
                g.genre_name AS genre 
            FROM 
                public."Books_Table" b
            JOIN 
                public."Genres_Table" g ON b.genre_id = g.genre_id
            WHERE
                LOWER(b.title) LIKE LOWER('%${query}%')`;

        // Conditions for author name and genre
        if (author) {
            searchQuery += ` AND LOWER(b.author_name) LIKE LOWER('%${author}%')`;
        }

        if (genre) {
            searchQuery += ` AND LOWER(g.genre_name) LIKE LOWER('%${genre}%')`;
        }

        const { rows } = await pool.query(searchQuery);
        res.json(rows);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'An error occurred while searching books.' });
    }
}


// Function to fetch all books with their details
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


// Function to add a new book to the database
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


// Function to update an existing book in the database
async function updateBook(req, res) {
    const book_id = req.params.id; 
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


// Function to delete a book from the database
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


// Function to handle user logout
function logout(req, res) {
    // Perform any necessary server-side logout actions
    // Then, send a response to the client indicating successful logout
    res.status(200).json({ success: true, message: 'Logout successful' });
}

// Export all functions for use in other modules
module.exports = { login, logout, searchBooks, getAllBooks, addBook, updateBook, deleteBook };
