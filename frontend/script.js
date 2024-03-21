document.addEventListener('DOMContentLoaded', () => {
    // You can perform any initial setup here
  });
  
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
        localStorage.setItem('token', data.token); // Store JWT token in local storage
        alert('Login successful');
        // Redirect to another page or perform any other action
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
  
  