### Project Proposal: Book Library Catalog Web Application
Overview
This project aims to develop a web application serving as a book library catalog. The application will consist of a REST API backend and a frontend interface. It will cater to two types of users: Readers (no authentication required) and Librarians (authentication required). Readers can browse books in the catalog, while Librarians can manage books by adding new books, updating existing ones, and deleting books.

### Web Application Concept
The web application will provide the following functionalities:

REST API Endpoint Design:

POST /api/login: Endpoint for user authentication.
POST /api/logout: Endpoint for user logout.
GET /api/books/search: Search books based on title, author, or genre.
GET /api/books: Retrieve a list of all books from the catalog.
POST /api/books: Add a new book to the catalog.
PATCH /api/books/:id: Update information about an existing book.
DELETE /api/books/:id: Remove a book from the catalog.


Preliminary Project Plan:

1. Setup and Backend Development (2 weeks)
Week 1: Set up development environment, including installing necessary dependencies and configuring PostgreSQL database.
Week 2: Develop backend logic using Express.js, implement JWT for authentication, and create REST API endpoints for CRUD operations on books.
2. Frontend Development (2 weeks)
Week 3: Design and implement frontend interface using HTML5, CSS3, and JavaScript. Utilize Vanilla JavaScript instead of Alpine.js for interactivity and dynamic content. (In the README.md is explained why i have chosen to use Vanilla over Alpine )
Week 4: Integrate frontend with backend API using Fetch API for communication.
3. Testing, Documentation, and Deployment (2 weeks)
Week 5: Conduct unit tests for backend endpoints, perform integration testing for frontend and backend, and refine application based on feedback.
Week 6: Write documentation including README.md, documenting application architecture, development process, and critical evaluation of the project. Deploy the application on a leading web platform (e.g., DigitalOcean).

# Conclusion
This project proposal outlines the concept, functionalities, and preliminary project plan for developing a book library catalog web application. By following this plan, i aim to deliver a functional prototype that meets the requirements of both Readers and Librarians.