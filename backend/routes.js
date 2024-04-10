const express = require('express');
const router = express.Router();
const { login, logout, searchBooks, getAllBooks, addBook, updateBook, deleteBook } = require('./controllers');
const { authenticate, authorize, errorHandler } = require('./middleware');

// Add the errorHandler middleware
router.use(errorHandler);

// Login endpoint
router.post('/login', login);

// Logout endpoint
router.post('/logout', logout);

// Search books endpoint
router.get('/books/search', searchBooks);

// Get all books endpoint
router.get('/books', getAllBooks);

// Add a new book endpoint
router.post('/books',authenticate,authorize(['librarian']), addBook);

// Update an existing book endpoint
router.patch('/books/:id', authenticate, authorize(['librarian']), updateBook);

// Delete a book endpoint
router.delete('/books/:id', authenticate, authorize(['librarian']), deleteBook);

module.exports = router;










