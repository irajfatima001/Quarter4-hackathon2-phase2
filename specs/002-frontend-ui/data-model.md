# Data Model: Frontend Development for Phase II Todo Full-Stack Web Application

## Entities

### User
Represents an authenticated individual with access to their personal task list

**Fields:**
- id: string (unique identifier)
- email: string (email address for login)
- name: string (display name)
- createdAt: Date (account creation timestamp)
- updatedAt: Date (last update timestamp)

**Validation rules:**
- Email must be a valid email format
- Name must not be empty

### Task
Represents a to-do item with properties like title, description, priority, and completion status

**Fields:**
- id: string (unique identifier)
- userId: string (foreign key to User)
- title: string (task title)
- description: string (optional task description)
- priority: 'low' | 'medium' | 'high' (priority level)
- completed: boolean (completion status)
- createdAt: Date (task creation timestamp)
- updatedAt: Date (last update timestamp)

**Validation rules:**
- Title must not be empty
- Priority must be one of the allowed values
- UserId must correspond to an existing user

### Theme
Represents the visual appearance settings (light/dark mode) that affect the UI presentation

**Fields:**
- mode: 'light' | 'dark' | 'system' (theme selection)
- updatedAt: Date (last theme change timestamp)

**Validation rules:**
- Mode must be one of the allowed values

## Relationships
- User has many Tasks (one-to-many relationship)
- Task belongs to one User (many-to-one relationship)

## State Transitions

### Task State Transitions
- Active → Completed (when user marks task as complete)
- Completed → Active (when user unmarks task as complete)

### Theme State Transitions
- Light → Dark (when user selects dark mode)
- Dark → Light (when user selects light mode)
- Any → System (when user selects system preference)