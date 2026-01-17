# Implementation Plan: Backend for Phase II Todo Full-Stack Web Application

**Branch**: `003-backend-spec` | **Date**: 2026-01-17 | **Spec**: [link to spec.md](/mnt/d/Hackathon 2/phase II/specs/003-backend-spec/spec.md)
**Input**: Feature specification from `/specs/003-backend-spec/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation of a secure, efficient backend for the Phase II Todo Full-Stack Web Application. The backend will handle multi-user Todo operations with persistent storage, REST API endpoints, JWT authentication, and strict user isolation. It will integrate seamlessly with the existing frontend, verifying JWT tokens from Better Auth, enforcing user data isolation, and storing tasks in Neon DB.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, python-jose, pydantic, Neon PostgreSQL driver
**Storage**: Neon Serverless PostgreSQL (async)
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: Web application backend
**Performance Goals**: Handle 1000+ concurrent users with sub-200ms response times
**Constraints**: Must enforce user isolation, validate all inputs, prevent security vulnerabilities
**Scale/Scope**: Multi-user system with secure data separation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project constitution (which needs to be properly defined), we'll ensure:
- Test-first approach: All functionality will be developed with TDD
- Proper observability: Structured logging for debugging
- Security-first: All inputs validated, user isolation enforced
- Integration testing: API contracts tested between frontend and backend

## Project Structure

### Documentation (this feature)

```text
specs/003-backend-spec/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   ├── database/
│   │   ├── __init__.py
│   │   └── session.py
│   ├── auth/
│   │   ├── __init__.py
│   │   └── jwt_handler.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       └── tasks.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py
│   └── main.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
├── requirements.txt
├── alembic/
│   └── versions/
├── alembic.ini
└── .env.example
```

**Structure Decision**: Web application backend structure selected to house the API server that will serve the frontend application. The modular design separates concerns with distinct modules for models, database handling, authentication, API routes, and business services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multiple dependencies | Need FastAPI for async handling, SQLModel for ORM, python-jose for JWT | Could use simpler Flask but would lack async performance and modern features |
| Separate auth module | Security-critical component needs isolation and focused testing | Could embed auth in routes but would compromise modularity and security |

## Phase 0: Research

### Research Tasks

1. **JWT Token Verification**: Research best practices for verifying JWT tokens issued by Better Auth with shared secret
2. **SQLModel Async Patterns**: Investigate optimal async patterns for SQLModel with Neon PostgreSQL
3. **User Isolation Strategies**: Examine patterns for ensuring strict user data isolation
4. **FastAPI Security Dependencies**: Research dependency injection patterns for authentication/authorization
5. **Neon DB Connection Pooling**: Understand best practices for async connection pooling with Neon

## Phase 1: Design & Contracts

### Step-by-Step Implementation Plan

1. **Set up project structure and dependencies**
   - Create backend directory structure
   - Initialize requirements.txt with FastAPI, SQLModel, python-jose, etc.
   - Set up environment configuration

2. **Design data models**
   - Create User model with id, email
   - Create Task model with id, title, description, status, priority, user_id FK
   - Define relationships between models

3. **Implement database layer**
   - Set up async engine with Neon DB connection
   - Create database session management
   - Implement connection pooling

4. **Develop authentication module**
   - Create JWT verification utility
   - Implement token decoding with shared secret
   - Extract user_id from token

5. **Build API dependency handlers**
   - Create authentication dependency
   - Implement user isolation filters
   - Add input validation with Pydantic

6. **Create task service layer**
   - Implement CRUD operations for tasks
   - Ensure all operations filter by authenticated user_id
   - Add proper error handling

7. **Develop API routes for tasks**
   - Implement GET /api/{user_id}/tasks
   - Implement POST /api/{user_id}/tasks
   - Implement GET /api/{user_id}/tasks/{id}
   - Implement PUT /api/{user_id}/tasks/{id}
   - Implement DELETE /api/{user_id}/tasks/{id}
   - Implement PATCH /api/{user_id}/tasks/{id}/complete

8. **Implement user isolation enforcement**
   - Ensure all queries are filtered by user_id from JWT
   - Add 403 errors when users try to access others' data
   - Validate user_id in URL matches JWT user_id

9. **Add input validation and sanitization**
   - Use Pydantic models for request validation
   - Prevent SQL injection and other vulnerabilities
   - Validate all user inputs

10. **Create comprehensive error handling**
    - Implement proper HTTP status codes (401, 403, 404, etc.)
    - Add structured error responses
    - Log security events appropriately

11. **Integrate with frontend API calls**
    - Ensure endpoints match frontend expectations
    - Test Bearer token authentication
    - Verify only user's data is returned

12. **Write unit and integration tests**
    - Test all API endpoints
    - Verify user isolation works correctly
    - Test authentication flows

13. **Performance optimization**
    - Optimize database queries
    - Implement proper indexing
    - Add caching where appropriate

14. **Security audit and final testing**
    - Perform security review
    - Test all edge cases
    - Verify all success criteria are met

## How to Use Specialized Agents

- **backend-architect**: Use for creating the overall backend structure, API routes, and service layers
- **auth-specialist**: Use for implementing JWT verification, token handling, and authentication flows
- **jwt-middleware**: Use for creating middleware that extracts and validates JWT tokens
- **neon-db-setup**: Use for configuring the Neon DB connection, async engine, and session management
- **user-isolation-filter**: Use for implementing the logic that ensures users can only access their own data

## Success Criteria Per Step

1. **Project Setup**: Dependencies installed, basic structure created, environment configured
2. **Data Models**: User and Task models defined with proper relationships and validation
3. **Database Layer**: Async connections working, session management implemented
4. **Authentication Module**: JWT tokens can be verified using shared secret
5. **API Dependencies**: Authentication and user isolation dependencies working
6. **Task Service**: CRUD operations implemented with proper user isolation
7. **API Routes**: All 6 required endpoints implemented and functioning
8. **User Isolation**: Users can only access their own data, 403 errors enforced
9. **Input Validation**: All inputs validated, security vulnerabilities prevented
10. **Error Handling**: Proper HTTP status codes returned, structured error responses
11. **Frontend Integration**: API calls from frontend succeed with Bearer tokens
12. **Testing**: Unit and integration tests passing, coverage requirements met
13. **Performance**: Response times under 200ms, concurrent user handling
14. **Security Audit**: All security requirements met, edge cases handled

## Integration Checkpoints with Frontend

1. **Authentication Test**: Verify frontend can obtain JWT and pass as Bearer token
2. **Task Creation Test**: Create task via API, verify it appears in frontend
3. **Task Retrieval Test**: Retrieve tasks via API, verify only user's tasks returned
4. **Task Update Test**: Update task via API, verify changes reflected in frontend
5. **Task Completion Test**: Mark task as complete via PATCH endpoint, verify in frontend
6. **Task Deletion Test**: Delete task via API, verify removal in frontend
7. **User Isolation Test**: Verify user cannot access another user's tasks
8. **Error Handling Test**: Verify proper error responses when accessing unauthorized data