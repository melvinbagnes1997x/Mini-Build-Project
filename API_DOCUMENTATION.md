# 📚 Task Manager API Documentation

## Base URL
```
Development: http://localhost:3000
Production: https://your-app.onrender.com
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "username": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

### Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "username": "string",
    "email": "string"
  }
}
```

### Get User Profile
**GET** `/api/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "_id": "user-id",
    "username": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

---

## 📝 Task Endpoints

### Get All Tasks
**GET** `/api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (active, completed, overdue)
- `priority` (string): Filter by priority (high, medium, low)
- `search` (string): Search in title and description
- `sortBy` (string): Sort field (createdAt, title, dueDate, priority)
- `sortOrder` (string): Sort order (asc, desc)

**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "task-id",
      "title": "string",
      "description": "string",
      "status": "active",
      "priority": "high",
      "dueDate": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTasks": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Create Task
**POST** `/api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "high|medium|low (default: medium)",
  "dueDate": "date (optional)"
}
```

**Response (201):**
```json
{
  "task": {
    "_id": "task-id",
    "title": "string",
    "description": "string",
    "status": "active",
    "priority": "high",
    "dueDate": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Get Single Task
**GET** `/api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "task": {
    "_id": "task-id",
    "title": "string",
    "description": "string",
    "status": "active",
    "priority": "high",
    "dueDate": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Update Task
**PUT** `/api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "active|completed (optional)",
  "priority": "high|medium|low (optional)",
  "dueDate": "date (optional)"
}
```

**Response (200):**
```json
{
  "task": {
    "_id": "task-id",
    "title": "string",
    "description": "string",
    "status": "completed",
    "priority": "high",
    "dueDate": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Delete Task
**DELETE** `/api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## 🏥 Health Check

### Application Health
**GET** `/api/health`

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 📊 Error Responses

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "message": "Access denied. No token provided"
}
```

### Authorization Error (403)
```json
{
  "message": "Access denied. Not authorized"
}
```

### Not Found Error (404)
```json
{
  "message": "Task not found"
}
```

### Server Error (500)
```json
{
  "message": "Internal server error"
}
```

---

## 🔧 Example Usage

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task manager API",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

### Using JavaScript (Fetch)

```javascript
// Register user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const { token } = await registerResponse.json();

// Create task
const taskResponse = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Complete project',
    description: 'Finish the task manager API',
    priority: 'high',
    dueDate: '2024-12-31'
  })
});
```

---

## 📈 Rate Limiting

- **Authentication endpoints:** 5 requests per minute
- **Task endpoints:** 100 requests per minute
- **Health check:** No limit

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Security headers (XSS protection, content type options)
- Environment variable configuration

---

## 🚀 Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) 