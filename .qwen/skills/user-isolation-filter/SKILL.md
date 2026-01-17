# User Isolation Filter Skill

## Name
user-isolation-filter

## Description
Enforces user_id filtering in all SQLModel queries and raises 403 on violation

## Allowed Tools
- code_read
- code_edit

## Instructions
1. Ensure every SQLModel query includes `.where(Model.user_id == current_user.user_id)` to filter by authenticated user
2. Add ownership checks before update/delete operations by retrieving the record and comparing user IDs
3. Raise HTTPException with status code 403 if user IDs don't match (access forbidden)
4. Implement ownership validation in all CRUD operations
5. Verify that all database queries properly filter by the authenticated user's ID

## Implementation Example

### Correct Query Patterns

```python
from fastapi import Depends, HTTPException
from sqlmodel import Session, select
from .models import Task, UserToken
from .database import get_session

def get_user_tasks(
    current_user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # CORRECT: Query filtered by current user's ID
    statement = select(Task).where(Task.user_id == current_user.user_id)
    tasks = session.exec(statement).all()
    return tasks

def get_task_by_id(
    task_id: int,
    current_user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # CORRECT: Query filtered by current user's ID
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task
```

### Ownership Validation for Updates and Deletes

```python
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Retrieve the task to check ownership
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        # Task doesn't exist OR doesn't belong to the current user
        raise HTTPException(status_code=403, detail="Access forbidden: You don't own this task")
    
    # Update the task with new data
    for field, value in task_data.dict(exclude_unset=True).items():
        setattr(task, field, value)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def delete_task(
    task_id: int,
    current_user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Retrieve the task to check ownership
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        # Task doesn't exist OR doesn't belong to the current user
        raise HTTPException(status_code=403, detail="Access forbidden: You don't own this task")
    
    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}
```

### Incorrect Query Patterns (TO AVOID)

```python
# INCORRECT: Missing user_id filter - creates a security vulnerability
def get_user_tasks_insecure(
    current_user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # This allows users to access all tasks in the system!
    statement = select(Task)  # Missing .where(Task.user_id == current_user.user_id)
    tasks = session.exec(statement).all()
    return tasks

# INCORRECT: No ownership check before update
def update_task_insecure(
    task_id: int,
    task_data: TaskUpdate,
    current_user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # This retrieves any task regardless of ownership
    statement = select(Task).where(Task.id == task_id)
    task = session.exec(statement).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # This allows users to update tasks they don't own!
    for field, value in task_data.dict(exclude_unset=True).items():
        setattr(task, field, value)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

## Best Practices

1. **Always filter queries by user_id**: Every SELECT query should include `.where(Model.user_id == current_user.user_id)`

2. **Validate ownership before modifications**: For UPDATE and DELETE operations, always verify that the record belongs to the current user before performing the operation

3. **Use consistent error handling**: Raise HTTPException with status code 403 when access is attempted to resources owned by other users

4. **Check all endpoints**: Ensure every endpoint that accesses user-specific data implements proper isolation

5. **Test isolation**: Create tests that verify users cannot access each other's data

## Common Pitfalls to Avoid

- Forgetting to add user_id filters to queries
- Performing updates/deletes without checking ownership first
- Using raw SQL queries without proper user_id filtering
- Assuming that authentication alone provides authorization
- Not testing cross-user access scenarios