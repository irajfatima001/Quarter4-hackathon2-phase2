# Quickstart Guide: Backend for Phase II Todo Full-Stack Web Application

## Prerequisites
- Python 3.11+
- pip package manager
- Access to Neon PostgreSQL database
- Better Auth configured for JWT generation

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   Copy the example environment file and configure your settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to include:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Shared secret for JWT verification
   - `ENVIRONMENT`: Set to "development" or "production"

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Start the development server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

Once the server is running, the following endpoints will be available:

- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a specific task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Mark a task as complete

## Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

The JWT token should be obtained from Better Auth after user authentication. The backend verifies JWT tokens using the shared `BETTER_AUTH_SECRET` environment variable.

## Security Features

- **Rate Limiting**: API endpoints are protected against abuse with rate limiting
- **Logging**: All requests and security events are logged
- **User Isolation**: Users can only access their own tasks (enforced at both API and database levels)
- **Input Validation**: All inputs are validated using Pydantic models to prevent injection attacks

## Testing the API

You can test the API using curl or a tool like Postman:

```bash
curl -X GET \
  http://localhost:8000/api/1/tasks \
  -H 'Authorization: Bearer <your-jwt-token>' \
  -H 'Content-Type: application/json'
```

## Running Tests

To run the unit and integration tests:

```bash
pytest
```

For verbose output:
```bash
pytest -v
```

## Database Migrations

To create a new migration after making model changes:
```bash
alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:
```bash
alembic upgrade head
```

To downgrade to a previous version:
```bash
alembic downgrade <revision-id>
```