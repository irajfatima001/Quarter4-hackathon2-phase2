# Step-by-Step Instructions to Run the Backend Successfully

## Prerequisites
- Python 3.11+
- pip package manager
- Access to Neon PostgreSQL database
- Better Auth configured for JWT generation

## Setup Instructions

1. **Navigate to the backend directory**
   ```bash
   cd /mnt/d/Hackathon 2/phase II/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify the .env file exists and has the required variables**
   The .env file should already exist with:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Shared secret for JWT verification
   - `BETTER_AUTH_URL`: URL for Better Auth service

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the development server**
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

## Troubleshooting

If you encounter any import errors:
1. Make sure all package directories have `__init__.py` files (they should already exist)
2. Verify that all imports in the code use absolute paths from `src`
3. Ensure your virtual environment is activated

## Running Tests

To run the unit and integration tests:

```bash
cd /mnt/d/Hackathon 2/phase II/backend
python -m pytest
```

For verbose output:
```bash
python -m pytest -v
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