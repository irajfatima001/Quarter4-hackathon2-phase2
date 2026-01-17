import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.src.models.task import Task, TaskCreate
from backend.src.models.user import User
from backend.src.database.session import get_async_session, engine
from backend.src.services.task_service import TaskService
from sqlmodel import SQLModel


@pytest.mark.asyncio
async def test_task_persistence():
    """
    Test that tasks persist across application restarts.
    This test simulates creating tasks and then accessing them again after a simulated restart.
    """
    
    # Create a new database engine for testing
    test_engine = create_async_engine("sqlite+aiosqlite:///./test_todo_app.db")
    
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    # Create session maker
    async_session_maker = sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    
    # Create a user first
    async with async_session_maker() as session:
        user = User(email="test@example.com")
        session.add(user)
        await session.commit()
        await session.refresh(user)
        user_id = user.id
    
    # Create a task for the user
    async with async_session_maker() as session:
        task_service = TaskService(session)
        task_create = TaskCreate(
            title="Test Task",
            description="A task to test persistence",
            user_id=user_id
        )
        created_task = await task_service.create_task(task_create, user_id)
        assert created_task.title == "Test Task"
        task_id = created_task.id
    
    # Simulate application restart by creating a new session
    # and verify the task still exists
    async with async_session_maker() as session:
        task_service = TaskService(session)
        retrieved_task = await task_service.get_task_by_id(task_id, user_id)
        assert retrieved_task is not None
        assert retrieved_task.title == "Test Task"
        assert retrieved_task.description == "A task to test persistence"
    
    # Cleanup - drop the test database
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


if __name__ == "__main__":
    asyncio.run(test_task_persistence())