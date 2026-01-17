from typing import List, Optional
from sqlmodel import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.task import Task, TaskCreate, TaskUpdate, TaskStatus
from src.models.user import User
from sqlmodel import and_


class TaskService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_task(self, task_data: TaskCreate, user_id: int) -> Task:
        task = Task(**task_data.model_dump())
        task.user_id = user_id
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def get_tasks_by_user(self, user_id: int) -> List[Task]:
        statement = select(Task).where(Task.user_id == user_id)
        result = await self.session.execute(statement)
        tasks = result.scalars().all()
        return tasks

    async def get_task_by_id(self, task_id: int, user_id: int) -> Optional[Task]:
        statement = select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
        result = await self.session.execute(statement)
        task = result.scalar_one_or_none()
        return task

    async def update_task(self, task_id: int, task_data: TaskUpdate, user_id: int) -> Optional[Task]:
        # First get the task to ensure it belongs to the user
        task = await self.get_task_by_id(task_id, user_id)
        if not task:
            return None
        
        # Update the task with new data
        update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def delete_task(self, task_id: int, user_id: int) -> bool:
        task = await self.get_task_by_id(task_id, user_id)
        if not task:
            return False
        
        await self.session.delete(task)
        await self.session.commit()
        return True

    async def mark_task_complete(self, task_id: int, user_id: int) -> Optional[Task]:
        task = await self.get_task_by_id(task_id, user_id)
        if not task:
            return None
        
        task.status = TaskStatus.COMPLETED
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task