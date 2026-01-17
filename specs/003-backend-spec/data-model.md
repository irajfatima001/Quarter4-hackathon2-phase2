# Data Model: Backend for Phase II Todo Full-Stack Web Application

## User Entity
- **id**: Integer (Primary Key, Auto-generated)
- **email**: String (Unique, Required, Validated as email format)
- **created_at**: DateTime (Auto-generated timestamp)
- **updated_at**: DateTime (Auto-generated timestamp, updated on change)

## Task Entity
- **id**: Integer (Primary Key, Auto-generated)
- **title**: String (Required, Max length 255)
- **description**: Text (Optional)
- **status**: String (Enum: 'pending', 'in_progress', 'completed'; Default: 'pending')
- **priority**: String (Enum: 'low', 'medium', 'high'; Default: 'medium')
- **user_id**: Integer (Foreign Key to User.id, Required)
- **created_at**: DateTime (Auto-generated timestamp)
- **updated_at**: DateTime (Auto-generated timestamp, updated on change)

## Relationships
- **User to Tasks**: One-to-Many (One user can have many tasks)
- **Task to User**: Many-to-One (Many tasks belong to one user)

## Validation Rules
- User email must be a valid email format
- Task title cannot be empty
- Task status must be one of the allowed values ('pending', 'in_progress', 'completed')
- Task priority must be one of the allowed values ('low', 'medium', 'high')
- Task.user_id must reference an existing User.id
- All timestamps are stored in UTC

## State Transitions
- Task status can transition from 'pending' to 'in_progress' to 'completed'
- Task status can transition from 'in_progress' back to 'pending'
- Once 'completed', a task can be reset to 'pending' if needed