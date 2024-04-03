const express = require('express');
const router = express.Router();
const { authenticate } = require('./middleware'); // Import the authenticate function
const { login,logout,searchBooks, getAllBooks, addBook, updateBook, deleteBook} = require('./controllers');


// Login endpoint
router.post('/login',login);

router.post('/logout', logout);

// Search books endpoint
router.get('/books/search', searchBooks);


// Get all books endpoint
router.get('/books', getAllBooks);

// Add a new book endpoint
router.post('/books', addBook); // Use authenticate middleware here

// Update an existing book endpoint
router.patch('/books/:id', updateBook); // Use authenticate middleware here

// Delete a book endpoint
router.delete('/books/:id', deleteBook); // Use authenticate middleware here



module.exports = router;









