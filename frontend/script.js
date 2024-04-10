
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display books when the page loads
    fetchBooks();
});


function searchBooks() {
    const query = document.getElementById('searchQuery').value;

    // Send request to backend to search for books
    fetch(`/api/books/search?query=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to search books');
            }
            return response.json();
        })
        .then(books => {
            // Display search results
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = ''; // Clear previous content
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.textContent = `ID: ${book.book_id}, Title: ${book.title}, Author: ${book.author}, Genre: ${book.genre}`;
                booksList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error searching books:', error.message);
            alert('Failed to search books. Please try again later.');
        });
}



function fetchBooks() {
    // Fetch books from backend
    fetch('/api/books')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            return response.json();
        })
        .then(books => {
            // Display books
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = ''; // Clear previous content
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.textContent = `ID: ${book.book_id}, Title: ${book.title}, Author: ${book.author}, Genre: ${book.genre}`;
                booksList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error.message);
            alert('Failed to fetch books. Please try again later.');
        });
}


function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login credentials to backend
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Login successful
                alert('Login successful');
                // Store token securely (e.g., in local storage or a cookie)
                localStorage.setItem('token', data.token);
                // Fetch and display books again
                fetchBooks();
                // Update librarian actions visibility
                checkLoginStatus(); // Call checkLoginStatus here
            } else {
                // Login failed
                alert('Login failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error logging in:', error.message);
            alert('Failed to login. Please try again later.');
        });
}




function checkLoginStatus() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        // User is logged in
        // Show librarian actions
        document.getElementById('librarianActions').style.display = 'block';
        // Hide login form
        document.getElementById('loginForm').style.display = 'none';
    } else {
        // User is not logged in
        // Hide librarian actions
        document.getElementById('librarianActions').style.display = 'none';
        // Show login form
        document.getElementById('loginForm').style.display = 'block';
    }
}


function logout() {
    // Clear token from local storage
    localStorage.removeItem('token');
    // Hide librarian actions
    document.getElementById('librarianActions').style.display = 'none';
    // Show login form
    document.getElementById('loginForm').style.display = 'block';
}


async function getGenreId(genreName) {
    try {
        const response = await fetch(`/api/genres?name=${genreName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch genre ID');
        }
        const data = await response.json();
        return data.id; 
    } catch (error) {
        console.error('Error fetching genre ID:', error.message);
        throw error;
    }
}


// Function to add a new book
function addBook() {
    const title = prompt('Enter title:');
    const author_name = prompt('Enter author name:');
    const genre_id = parseInt(prompt(`Choose genre (Enter the number):\n1. Fiction\n2. Mystery\n3. Science Fiction\n4. Fantasy\n5. Comedy\n6. Drama\n7. Romance\n8. Horror\n9. Thriller\n10. Adventure\n11. Biography`));

    // Check if any of the fields are empty
    if (!title || !author_name || !genre_id) {
        alert('Title, author name, and genre ID are required');
        return;
    }

    // Send request to backend to add book
    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, author_name, genre_id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        return response.json();
    })
    .then(data => {
        alert('Book added successfully');
        // Refresh books list
        fetchBooks();
    })
    .catch(error => {
        console.error('Error adding book:', error.message);
        alert('Failed to add book. Please try again later.');
    });
}


// Client-side code to update a book
function updateBook() {
    const book_id = prompt('Enter book ID to update:');
    const title = prompt('Enter updated title:');
    const author_name = prompt('Enter updated author:');
    const genre_id = parseInt(prompt(`Choose updated genre (Enter the number):\n1. Fiction\n2. Mystery\n3. Science Fiction\n4. Fantasy\n5. Comedy\n6. Drama\n7. Romance\n8. Horror\n9. Thriller\n10. Adventure\n11. Biography`));

    // Validate inputs
    if (!book_id || !title || !author_name || isNaN(genre_id)) {
        alert('Invalid input. Please provide all required information.');
        return;
    }

    // Send PATCH request to update the book
    fetch(`/api/books/${book_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, author_name, genre_id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update book');
        }
        return response.json();
    })
    .then(data => {
        alert('Book updated successfully');
        // Refresh books list or perform any other necessary actions
    })
    .catch(error => {
        console.error('Error updating book:', error.message);
        alert('Failed to update book. Please try again later.');
    });
}

// Function to delete a book

function deleteBook() {
    const bookId = prompt('Enter the ID of the book:');
    
    // Validate input
    if (!bookId) {
        alert('Please provide the ID of the book.');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete the book with ID ${bookId}?`)) {
        return; // Cancel deletion if user chooses not to proceed
    }
    
    // Send request to backend to delete book
    fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        return response.json();
    })
    .then(data => {
        alert('Book deleted successfully');
        // Refresh books list or perform any other necessary actions
    })
    .catch(error => {
        console.error('Error deleting book:', error.message);
        alert('Failed to delete book. Please try again later.');
    });
}