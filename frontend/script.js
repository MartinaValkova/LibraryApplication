document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display books when the page loads
    fetchBooks();
  });
  
  function fetchBooks() {
    // Fetch books from backend
    fetch('/api/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(books => {
        // Display books
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = ''; // Clear previous content
        books.forEach(book => {
          const bookElement = document.createElement('div');
          bookElement.textContent = `Title: ${book.title}, Author : ${book.author}, Genre : ${book.genre}`;
          booksList.appendChild(bookElement);
        });
      })
      .catch(error => {
        console.error('Error fetching books:', error.message);
        alert('An error occurred while fetching books.');
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
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Login successful
        alert('Login successful');
        // Reload the page to reflect changes in user status
        location.reload();
      } else {
        // Login failed
        alert('Login failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error logging in:', error.message);
      alert('An error occurred. Please try again later.');
    });
  }
  
  
  
  
  
  
  