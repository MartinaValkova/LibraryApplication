const express = require('express');
const router = express.Router();
const { authenticate } = require('./middleware'); // Import the authenticate function
const { login, getAllBooks, addBook, updateBook, deleteBook} = require('./controllers');

// Login endpoint
router.post('/login', login);

// Get all books endpoint
router.get('/books', getAllBooks);

// Add a new book endpoint
router.post('/books', authenticate,  addBook); // Use authenticate middleware here

// Update an existing book endpoint
router.patch('/books/:id', authenticate, updateBook); // Use authenticate middleware here

// Delete a book endpoint
router.delete('/books/:id', authenticate, deleteBook); // Use authenticate middleware here



module.exports = router;









