# API Contract: Frontend-Backend Integration for Todo Application

## Overview
This document defines the API contracts between the frontend and backend for the Todo application. These contracts ensure consistent communication and data exchange between the client and server.

## Authentication
All API requests to protected endpoints must include the authentication token from Better Auth in the Authorization header:
```
Authorization: Bearer {token}
```

## API Endpoints

### User Authentication
- `POST /api/auth/login` - Authenticate user and return session
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/logout` - End user session

### Task Management
- `GET /api/{user_id}/tasks` - Retrieve all tasks for a user
  - Response: Array of Task objects
  - Example: `GET /api/abc123/tasks`

- `POST /api/{user_id}/tasks` - Create a new task
  - Request Body: Task object (without ID)
  - Response: Created Task object
  - Example: `POST /api/abc123/tasks`

- `PUT /api/{user_id}/tasks/{task_id}` - Update an existing task
  - Request Body: Partial Task object
  - Response: Updated Task object
  - Example: `PUT /api/abc123/tasks/xyz789`

- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
  - Response: Empty
  - Example: `DELETE /api/abc123/tasks/xyz789`

- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion status
  - Request Body: `{ completed: boolean }`
  - Response: Updated Task object
  - Example: `PATCH /api/abc123/tasks/xyz789/complete`

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### Task
```typescript
interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

## Error Handling
API responses follow this structure for errors:
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Status Codes
- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Server error