document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display books when the page loads
    fetchBooks();
});

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
                bookElement.textContent = `Title: ${book.title}, Author: ${book.author}, Genre: ${book.genre}`;
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

function addBook() {
    // Get input values
    const title = prompt('Enter title:');
    const author = prompt('Enter author:');
    const genre = prompt('Enter genre:');

    // Send request to backend to add book
    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, author, genre })
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

function updateBook() {
    // Get book ID to update
    const id = prompt('Enter book ID to update:');
    if (!id) return;

    // Get updated input values
    const title = prompt('Enter updated title:');
    const author = prompt('Enter updated author:');
    const genre = prompt('Enter updated genre:');

    // Send request to backend to update book
    fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, author, genre })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update book');
            }
            return response.json();
        })
        .then(data => {
            alert('Book updated successfully');
            // Refresh books list
            fetchBooks();
        })
        .catch(error => {
            console.error('Error updating book:', error.message);
            alert('Failed to update book. Please try again later.');
        });
}


function deleteBook() {
    // Get book ID to delete
    const id = prompt('Enter book ID to delete:');
    if (!id) return;

    // Send request to backend to delete book
    fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
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
            // Refresh books list
            fetchBooks();
        })
        .catch(error => {
            console.error('Error deleting book:', error.message);
            alert('Failed to delete book. Please try again later.');
        });
}












  