import pytest
from backend.src.models.user import User
from backend.src.models.task import Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority


def test_user_model():
    """Test the User model creation."""
    user = User(email="test@example.com")
    assert user.email == "test@example.com"
    assert user.id is None  # ID will be set by the database


def test_task_model():
    """Test the Task model creation."""
    task = Task(
        title="Test Task",
        description="A test task",
        status=TaskStatus.PENDING,
        priority=TaskPriority.MEDIUM,
        user_id=1
    )
    assert task.title == "Test Task"
    assert task.description == "A test task"
    assert task.status == TaskStatus.PENDING
    assert task.priority == TaskPriority.MEDIUM
    assert task.user_id == 1
    assert task.id is None  # ID will be set by the database


def test_task_create_model():
    """Test the TaskCreate model."""
    task_create = TaskCreate(
        title="New Task",
        description="A new task",
        priority=TaskPriority.HIGH
    )
    assert task_create.title == "New Task"
    assert task_create.description == "A new task"
    assert task_create.priority == TaskPriority.HIGH


def test_task_update_model():
    """Test the TaskUpdate model."""
    task_update = TaskUpdate(
        title="Updated Task",
        status=TaskStatus.IN_PROGRESS
    )
    assert task_update.title == "Updated Task"
    assert task_update.status == TaskStatus.IN_PROGRESS
    assert task_update.description is None
    assert task_update.priority is None


def test_task_status_enum():
    """Test the TaskStatus enum values."""
    assert TaskStatus.PENDING.value == "pending"
    assert TaskStatus.IN_PROGRESS.value == "in_progress"
    assert TaskStatus.COMPLETED.value == "completed"


def test_task_priority_enum():
    """Test the TaskPriority enum values."""
    assert TaskPriority.LOW.value == "low"
    assert TaskPriority.MEDIUM.value == "medium"
    assert TaskPriority.HIGH.value == "high"