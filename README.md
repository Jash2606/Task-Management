---

# Task Management API

This repository contains a RESTful API for a task management system. The API allows users to manage their tasks and includes authentication, CRUD operations, filters, sorting, pagination, role-based access control, and more. It is designed with modularity, data validation, error handling, and automated testing in mind.

---

## **Features**
- **User Management**:
  - Register and log in to user accounts with JWT-based authentication.
- **Task Management**:
  - Add, update, delete, and fetch tasks.
  - Filter tasks by status, priority, and due date.
  - Sort tasks by due date or priority.
  - Pagination for fetching tasks.
  - Task reminders via email for tasks with a due date.
- **Admin Capabilities**:
  - Fetch a list of all users.
  - Delete tasks created by any user.
- **Robust Error Handling**:
  - Validates input and returns meaningful error messages.
- **Secure Endpoints**:
  - Endpoints are protected with JWT authentication.
- **Testing**:
  - Comprehensive test coverage using Jest for critical functionality.
- **Scalable Design**:
  - Modular routes, middleware, and controllers for easy expansion.

---

## **Technologies Used**
- **Framework**: Node.js with Express.js.
- **Database**: MongoDB.
- **Authentication**: JSON Web Tokens (JWT).
- **Testing**: Jest.
---

## **API Endpoints**

### **Authentication**
| Endpoint              | Method | Description                  |
|-----------------------|--------|------------------------------|
| `/api/v1/auth/register` | POST   | Register a new user.         |
| `/api/v1/auth/login`    | POST   | Log in and receive a JWT.    |

### **Tasks**
| Endpoint                              | Method | Description                                   |
|---------------------------------------|--------|-----------------------------------------------|
| `/api/v1/task`                         | POST   | Add a new task (authenticated users only).    |
| `/api/v1/task`                         | GET    | Fetch tasks with filters, sorting, pagination.|
| `/api/v1/task/:id`                     | GET    | Fetch details of a specific task.             |
| `/api/v1/task/:id`                     | PUT    | Update a specific task.                       |
| `/api/v1/task/:id`                     | DELETE | Delete a specific task.                       |
| `/api/v1/task/:id/reminder`            | POST   | Set a reminder for a task.                    |

### **Admin**
| Endpoint                              | Method | Description                                   |
|---------------------------------------|--------|-----------------------------------------------|
| `/api/v1/admin/users`                  | GET    | Fetch all users (admin only).                 |
| `/api/v1/admin/tasks/:id`              | DELETE | Delete a task by ID (admin only).             |

---

## **Getting Started**

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/Jash2606/Task-Management.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Task-Management
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### **Setup**
1. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   ```
2. Start the development server:
   ```bash
   node index.js
   ```

---

## **Testing**

### **Automated Testing with Jest**
This project includes automated tests for:
- **Authentication**: Registering and logging in users.
- **Task Management**: Adding, updating, deleting, and retrieving tasks.
- **Admin Capabilities**: Fetching users and deleting tasks.

#### **Run Tests**
To execute the test suite, run:
```bash
npm test
```

---

## **API Documentation**

he API is documented with Postman. Use the provided Postman collection to explore all endpoints.

Here is my **Postman Collection Link** : [Postman Collection](https://documenter.getpostman.com/view/33555544/2sAY55cJdp)

### **How to Import**
1. Open Postman.
2. Click the **Import** button in the top left.
3. Choose the **Link** tab and paste the collection link.
4. Click **Import**.

## **Deployment**
This API is deployed on Render. Access it via the live URL:
- **Base URL**: [Task Management API](https://task-management-cws3.onrender.com)

---

