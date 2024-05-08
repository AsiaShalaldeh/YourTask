# Tasks Management System :clipboard: 

## Description 📌
YourTask is a web-based task management application designed to simplify the process of adding and managing tasks. It provides users with an intuitive interface to serach, create, edit, and delete their tasks efficiently.

## Objective 🎯
The primary objective of YourTask is to empower users to manage their tasks effectively, whether it's personal to-do lists, project tasks, or team assignments. By offering essential task management features in a user-friendly environment, YourTask aims to enhance productivity and streamline task management processes.


## Functionality ⚙️
- **User Authentication:** Secure user authentication system to ensure only authorized users can access the application.
- **Reset Passwords:** Capability for users to reset their passwords securely in case they forget them.
- **Show Tasks:** Display a paginated list of tasks associated with the logged-in user, providing essential details such as task title and description. 
- **Tasks Search:** Enable users to search for specific tasks based on their title and description.
- **Filter Tasks** Enable users to filter tasks based on status (all, completed, not completed),
- **Add Tasks:** Allow users to create new tasks by providing necessary details such as title and description.
- **Edit Tasks:**  Provide functionality for users to modify existing tasks, updating information such as title or description.
- **Delete Tasks:** Allow users to delete tasks they no longer need, removing them from the system permanently.

## Database 🗃
- The database includes tables for users, tasks, reset passwords, and users images.
- Each entity has unique identifiers and relevant attributes.
- The System utilizes MySQL as the underlying database management system.
- Some built in-tables are used too e.g. Token and users tables provided by Django<br> <br>
Here is the EER model:<br><br>
![YourTaskD](https://github.com/AsiaShalaldeh/YourTask/assets/103144415/9227c1c3-d409-43c0-8683-f63e28853b7c)


## Technologies Used 💻

### Frontend
- **React**: A JavaScript library for building user interfaces. Used for the frontend development of the project.
- **React Router**: A routing library for React applications. Used for handling navigation within the React app.
- **Axios**: A promise-based HTTP client for making asynchronous HTTP requests in the browser and Node.js. Used for handling API requests in the frontend.
- **Material-UI**: A popular React UI framework for building responsive and customizable user interfaces.
- **CSS**: Cascading Style Sheets used for styling the components and layout of the frontend.

### Backend
- **Django**:Used for building the backend API endpoints and handling database operations.
- **Django REST Framework (DRF)**: A powerful and flexible toolkit for building Web APIs in Django. Used for creating RESTful APIs in the Django backend.
- **Django Simple JWT**: A JSON Web Token authentication plugin for Django REST Framework. Used for authentication in the Django backend.
- **MySQL**: Used as the primary database for storing application data.

### Other
- **Git**: A distributed version control system used for tracking changes in the project codebase.
- **GitHub**: A web-based hosting service for version control using Git. Used for hosting the project repository and collaboration.
- **npm**: A package manager for Node.js packages. Used for managing frontend dependencies and scripts.
- **pip**: The package installer for Python. Used for installing Python packages and dependencies in the backend.
- **Visual Studio Code**: Used for writing code, debugging, and version control.



## Contribution 👩‍💻
We welcome contributions from the community to enhance the YourTask System.