# Neon DB Setup Skill

## Name
neon-db-setup

## Description
Sets up SQLModel async engine, session, and connection for Neon Serverless PostgreSQL using DATABASE_URL env var

## Allowed Tools
- code_write

## Instructions
1. Use `create_async_engine(os.getenv("DATABASE_URL"))` to create the async engine
2. Create an async sessionmaker with the engine
3. Include lifespan event handler if needed for proper startup/shutdown
4. Configure the engine with appropriate settings for Neon Serverless PostgreSQL
5. Implement proper connection pooling and disposal

## Implementation Example

```python
import os
from contextlib import asynccontextmanager
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, async_sessionmaker

# Create the async engine using the DATABASE_URL environment variable
engine: AsyncEngine = create_async_engine(
    os.getenv("DATABASE_URL"),
    echo=False,  # Set to True to see SQL queries in logs
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,  # Number of connection pools
    max_overflow=10,  # Maximum number of connections beyond pool_size
    pool_recycle=300,  # Recycle connections after 5 minutes
)

# Create an async sessionmaker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Lifespan event handler for startup and shutdown
@asynccontextmanager
async def lifespan(app):
    # Startup: Initialize tables if needed
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    # Shutdown: Dispose of the engine
    await engine.dispose()

# Dependency to get async session
async def get_async_session():
    async with AsyncSessionLocal() as session:
        yield session
```

## Usage Example

```python
from fastapi import Depends
from .database import get_async_session

@app.get("/users")
async def get_users(session: AsyncSession = Depends(get_async_session)):
    users = await session.exec(select(User))
    return users.all()
```

## Important Notes
- The DATABASE_URL environment variable should follow the format: postgresql+asyncpg://username:password@host:port/database
- Neon Serverless PostgreSQL connections are optimized for short-lived connections
- The lifespan event handler ensures proper initialization and cleanup of resources
- Connection pooling settings may need adjustment based on your application's load
- The engine should be disposed of properly during application shutdown