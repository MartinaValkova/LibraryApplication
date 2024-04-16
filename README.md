# LibraryApplication

This project aims to develop a web application serving as a book library catalog. The application will consist of a REST API backend and a frontend interface. It will cater to two types of users: Readers (no authentication required) and Librarians (authentication required). Readers can browse books in the catalog, while Librarians can manage books by adding new books, updating existing ones, and deleting books.

# Application Architecture

The application follows a typical client-server architecture, where the client-side is implemented using HTML, CSS, and JavaScript, and the server-side is built with Node.js and Express.js. Here's an overview of the architecture:

Client-Side:

- HTML/CSS: Responsible for the structure and styling of the user interface.
- JavaScript (Frontend): Handles dynamic interactions with the user, such as fetching data from the server, updating the UI based on user actions, and handling form submissions.

Server-Side:

- Node.js: A runtime environment for executing JavaScript code server-side.
- Express.js: A web application framework for Node.js that simplifies the process of building robust web applications and APIs.
- Database (PostgreSQL): Stores information about books, users, and genres.
- Authentication (JWT): JSON Web Tokens are used for user authentication and authorization.
- Middleware: Middleware functions are used for authentication, authorization, and error handling.
- Routes: Define the endpoints that handle client requests and map them to corresponding controller functions.
- Controllers: Contains the logic for processing requests, interacting with the database, and sending responses back to the client.


# Development Process-Steps Involved:

Requirement Analysis:

- Gathered and analyzed project requirements, including user stories and desired functionalities.
- Identified user types (Reader and Librarian) and their respective functionalities.
- Defined the scope of the project, including features such as book browsing, addition, updating, and deletion.

Design:

- Designed the application architecture, outlining the frontend and backend components.
- Created the database schema to store book information and user data.
- Designed the user interface for both readers and librarians, ensuring intuitive navigation and functionality.

REST API Endpoint Design:

POST /api/login: Endpoint for user authentication.
POST /api/logout: Endpoint for user logout.
GET /api/books/search: Search books based on title, author, or genre.
GET /api/books: Retrieve a list of all books from the catalog.
POST /api/books: Add a new book to the catalog.
PATCH /api/books/:id: Update information about an existing book.
DELETE /api/books/:id: Remove a book from the catalog.


Implementation:

- Developed the frontend using vanilla JavaScript, HTML, and CSS, providing interactive user interfaces for browsing and managing books.
- Implemented the REST API backend using Node.js and Express.js, defining routes and controllers for user authentication and book management operations.
- Integrated authentication middleware to secure librarian-exclusive functionalities.
- Utilized PostgreSQL database for storing book information and user data. The database has 3 tables, Books_Table, Genres_Table and Users_Table.
- Implemented error handling mechanisms to ensure robustness and reliability.

Testing:

- Conducted unit tests to validate the functionality of individual components and modules.
- Performed integration tests to ensure seamless interaction between frontend and backend systems.
- Executed end-to-end tests to simulate user scenarios and validate the application's behavior.
- Addressed any identified issues and bugs through debugging and refactoring.

Deployment:

Deployed the application to a hosting environment, such as a DigitalOcean.

# Technologies Used:

- HTML/CSS/JavaScript for the frontend.
- Node.js/Express.js for the backend.
- PostgreSQL for the database.
- JSON Web Tokens (JWT) for authentication.
- Git for version control.

# Authentication 

The application uses JSON Web Tokens (JWT) for user authentication. 

Here's how it works:

- When a user logs in with valid credentials, the backend generates a JWT containing the user's information (username, role) and signs it with a secret key.

- This JWT is then sent back to the client and stored securely (usually in local storage or a cookie).

- For subsequent requests that require authentication (e.g., adding, updating, or deleting books), the client sends the JWT in the request headers.

- The backend verifies the JWT's signature using the secret key and extracts the user's information from it.

- If the JWT is valid and not expired, the user is considered authenticated, and the requested operation is performed.

- If the JWT is invalid or expired, the user is denied access, and an appropriate error message is sent back to the client.

This mechanism ensures that only authenticated users with valid tokens can access certain functionalities (e.g., managing books), while unauthenticated users can still browse the catalog.



In the routes file (routes.js), authentication is implemented using middleware functions provided in the middleware.js file. Let's break down how authentication is applied in each route:

- Search Books Endpoint (/books/search):
Authentication is not required for this endpoint, so it's accessible to all users (readers and librarians).
No authentication middleware is applied to this route.

- Get All Books Endpoint (/books):
Similar to the search books endpoint, authentication is not required here.
No authentication middleware is applied.

- Add a New Book Endpoint (/books):
Authentication is required for this endpoint as only librarians are allowed to add books.
The authenticate middleware is applied before the addBook controller function. This middleware ensures that the request contains a valid JWT token in the authorization header, indicating that the user is authenticated.
Additionally, the authorize(['librarian']) middleware is applied, which checks if the authenticated user has the role of a librarian. This ensures that only librarians can access this endpoint.

- Update an Existing Book Endpoint (/books/:id):
Similar to adding a book, authentication is required for updating a book.
The authenticate middleware is applied to verify the JWT token in the authorization header.
The authorize(['librarian']) middleware is also applied to ensure that only librarians can update books.

- Delete a Book Endpoint (/books/:id):
Authentication is required for deleting a book, similar to adding and updating.
The authenticate middleware is applied for JWT verification.
The authorize(['librarian']) middleware is used to restrict access to librarians only.
These middleware functions help enforce authentication and authorization rules for different endpoints in the application. By applying them appropriately to the routes, the application ensures that only authenticated users with the necessary permissions (librarians) can perform certain actions, such as adding, updating, or deleting books.



# Critical Evaluation

Successes:

- User Authentication: Implementing JWT-based authentication provided secure access to authorized users.

- CRUD Operations: The application successfully implements CRUD (Create, Read, Update, Delete) operations for managing books.

- Search Functionality: The search functionality allows users to efficiently find books based on title, author, or genre.

- UI/UX: The user interface is intuitive and user-friendly, enhancing the overall user experience.

Challenges and Solutions:

- Authentication Complexity: Implementing authentication and authorization logic can be complex, but thorough research and leveraging existing libraries (like JWT) helped mitigate this challenge.

- Database Management: Managing database operations, especially when dealing with relational databases like PostgreSQL, required careful planning and efficient query writing.

- Error Handling: Handling errors gracefully and providing meaningful error messages to users was challenging but addressed by implementing robust error handling mechanisms.

# Lessons Learned:

- Modular Design: Breaking down the application into smaller, modular components improved maintainability and scalability.

- Documentation: Comprehensive documentation is essential for understanding the codebase and facilitating collaboration among team members.

- Testing: Investing time in tests helped identify and fix bugs early in the development process, saving time and effort in the long run.


# Why Vanilla JavaScript Over Alpine.js

In the initial stages of the project, I thoroughly studied Alpine.js as a potential framework for enhancing interactivity in the application. While Alpine.js offers convenient ways to add interactivity, especially for smaller projects, I found that for this particular application, the complexity of authentication and database management required a more tailored approach.

After studying both Alpine.js and vanilla JavaScript extensively, I concluded that vanilla JavaScript provided:

- Simplicity: Vanilla JavaScript is lightweight and doesn't introduce additional dependencies, making it easier to understand and maintain the codebase.

- Control: Writing plain JavaScript provides more control over the application's behavior and performance, without relying on external libraries or frameworks.

- Learning Experience: While Alpine.js offers a quick way to add interactivity, developing with vanilla JavaScript allowed for a deeper understanding of core web development concepts and principles. This learning experience was valuable for both my personal growth and the project's requirements.

- Flexibility: Vanilla JavaScript can be tailored to specific project requirements without being limited by the conventions and constraints of a particular framework.


Through a careful evaluation of available options, including Alpine.js and vanilla JavaScript, I made an informed decision to proceed with vanilla JavaScript for this project. This decision was based on a thorough understanding of the project requirements, the complexities involved in authentication and database management, and the desire for greater control and flexibility in implementation. While challenges were encountered along the way, the project's successes demonstrate the effectiveness of the chosen approach and provide valuable insights for future projects.


# How to run the app 

To run the application, follow these steps:

Install Dependencies: Make sure you have all the necessary dependencies installed. Usually, you can do this by running:

- bash
- Copy code
- npm install
This command will install all the dependencies listed in the package.json file.

Set Up Environment Variables: Ensure that you have set up any required environment variables. These might include database connection strings, secret keys for JWT signing, or other configuration options. You can set environment variables either in a .env file or directly in your hosting environment.

Database Setup: The application uses a database, ensure that the database is set up correctly. This might involve creating the necessary tables, indexes, or seed data. 

Start the Server: Run the command to start your server. This command is specified in the scripts section of the package.json file. 

- node server.js



# Application URL


# Librarian Login

admin/secret


# GitHub URL 

https://github.com/MartinaValkova/LibraryApplication

https://github.com/MartinaValkova?tab=repositories





















