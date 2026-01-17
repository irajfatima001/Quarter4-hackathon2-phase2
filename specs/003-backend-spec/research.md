# Research: Backend for Phase II Todo Full-Stack Web Application

## Decision: JWT Token Verification Approach
**Rationale**: Using python-jose library to decode and verify JWT tokens issued by Better Auth with a shared secret (BETTER_AUTH_SECRET environment variable). This approach is secure and widely adopted in the Python ecosystem.
**Alternatives considered**: PyJWT was also considered but python-jose offers better async support and is recommended for FastAPI applications.

## Decision: SQLModel Async Patterns
**Rationale**: Using SQLModel with async SQLAlchemy engine for Neon PostgreSQL. This provides type safety with Pydantic models while supporting async operations for better performance with concurrent users.
**Alternatives considered**: Pure SQLAlchemy async or Tortoise ORM. SQLModel was chosen for its seamless integration with FastAPI and Pydantic.

## Decision: User Isolation Strategy
**Rationale**: Implementing user isolation at multiple levels - dependency injection to extract user_id from JWT, database queries filtered by user_id, and validation that the user_id in the URL matches the authenticated user.
**Alternatives considered**: Row-level security in the database. Application-level filtering was chosen for better control and observability.

## Decision: FastAPI Security Dependencies
**Rationale**: Using FastAPI's dependency injection system to create reusable authentication and authorization dependencies that can be applied to routes requiring protection.
**Alternatives considered**: Middleware approach. Dependency injection was chosen for better flexibility and testability.

## Decision: Neon DB Connection Pooling
**Rationale**: Configuring async connection pooling with appropriate min and max connections to handle load efficiently while managing resources.
**Alternatives considered**: Default settings vs. custom tuning. Custom tuning was selected based on expected concurrent user load.