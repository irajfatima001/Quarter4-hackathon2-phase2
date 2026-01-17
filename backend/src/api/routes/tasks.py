from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from src.models.task import Task, TaskCreate, TaskUpdate
from src.services.task_service import TaskService
from src.database.session import get_async_session
from src.api.deps import get_current_user_id
from sqlmodel import and_

router = APIRouter()


@router.get("/tasks", response_model=List[Task])
async def get_tasks(
    user_id: int,
    current_user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    # Verify that the user_id in the path matches the authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )
    
    task_service = TaskService(session)
    tasks = await task_service.get_tasks_by_user(user_id)
    return tasks


@router.post("/tasks", response_model=Task)
async def create_task(
    user_id: int,
    task_data: TaskCreate,
    current_user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    # Verify that the user_id in the path matches the authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )
    
    task_service = TaskService(session)
    task = await task_service.create_task(task_data, user_id)
    return task


@router.get("/tasks/{task_id}", response_model=Task)
async def get_task(
    user_id: int,
    task_id: int,
    current_user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    # Verify that the user_id in the path matches the authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )
    
    task_service = TaskService(session)
    task = await task_service.get_task_by_id(task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    user_id: int,
    task_id: int,
    task_data: TaskUpdate,
    current_user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    # Verify that the user_id in the path matches the authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update these tasks"
        )
    
    task_service = TaskService(session)
    task = await task_service.update_task(task_id, task_data, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.delete("/tasks/{task_id}")
async def delete_task(
    user_id: int,
    task_id: int,
    current_user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    # Verify that the user_id in the path matches the authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete these tasks"
        )
    
    task_service = TaskService(session)
    success = await task_service.delete_task(task_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=Task)
async def mark_task_complete(
    user_id: int,
    task_id: int,
    current_user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    # Verify that the user_id in the path matches the authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update these tasks"
        )
    
    task_service = TaskService(session)
    task = await task_service.mark_task_complete(task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task