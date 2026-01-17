# FastAPI CRUD Skill

## Name
fastapi-crud

## Description
Generates standard REST CRUD endpoints in FastAPI with /api/{user_id}/tasks prefix and strict user isolation

## Allowed Tools
- code_write

## Instructions
1. Use APIRouter with prefix="/api/{user_id}/tasks" for endpoint routing
2. Implement the following endpoints:
   - GET / - List all tasks for the authenticated user
   - POST / - Create a new task for the authenticated user
   - GET /{id} - Get a specific task by ID for the authenticated user
   - PUT /{id} - Update a specific task by ID for the authenticated user
   - DELETE /{id} - Delete a specific task by ID for the authenticated user
   - PATCH /{id}/complete - Mark a specific task as complete/incomplete for the authenticated user
3. Apply Depends(get_current_user) to all endpoints for user isolation
4. Use SQLModel for database operations
5. Ensure strict user isolation by filtering all queries by the authenticated user's ID

## Implementation Example

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from uuid import UUID

from .models import Task, UserToken
from .database import get_session

router = APIRouter(prefix="/api/{user_id}/tasks")

@router.get("/", response_model=List[Task])
def list_tasks(
    user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Ensure user can only access their own tasks
    if user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    tasks = session.exec(select(Task).where(Task.user_id == user.user_id)).all()
    return tasks


@router.post("/", response_model=Task)
def create_task(
    task: Task,
    user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Ensure user can only create tasks for themselves
    if task.user_id != user.user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/{id}", response_model=Task)
def get_task(
    id: UUID,
    user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Ensure user can only access their own tasks
    statement = select(Task).where(Task.id == id).where(Task.user_id == user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task


@router.put("/{id}", response_model=Task)
def update_task(
    id: UUID,
    task_update: Task,
    user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Ensure user can only update their own tasks
    statement = select(Task).where(Task.id == id).where(Task.user_id == user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update task properties
    for var in vars(task_update):
        if getattr(task_update, var) is not None:
            setattr(task, var, getattr(task_update, var))
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{id}")
def delete_task(
    id: UUID,
    user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Ensure user can only delete their own tasks
    statement = select(Task).where(Task.id == id).where(Task.user_id == user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}


@router.patch("/{id}/complete")
def update_task_completion(
    id: UUID,
    is_completed: bool,
    user: UserToken = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Ensure user can only update their own tasks
    statement = select(Task).where(Task.id == id).where(Task.user_id == user.user_id)
    task = session.exec(statement).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = is_completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

## Important Notes
- All endpoints must use Depends(get_current_user) to ensure authentication
- User isolation is critical - always filter queries by user.user_id
- The router prefix includes {user_id} which should match the authenticated user
- Use SQLModel for all database operations to maintain consistency
- Handle errors appropriately with HTTPException
- The PATCH endpoint specifically handles task completion updates