// Login form submit event handler
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      // Send login request to backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        // Display success message or redirect to books page
        document.getElementById('loginMessage').textContent = 'Login successful!';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('bookList').style.display = 'block';
        fetchBooks(); // Fetch and display books after successful login
      } else {
        // Display error message
        const errorMessage = await response.text();
        document.getElementById('loginMessage').textContent = errorMessage;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  });
  
  