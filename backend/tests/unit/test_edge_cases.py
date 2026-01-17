import pytest
from backend.src.models.task import TaskStatus, TaskPriority, TaskCreate


def test_edge_cases():
    """Test edge cases identified in the specification."""
    
    # Test creating a task with minimum required fields
    task_min = TaskCreate(title="Minimal Task")
    assert task_min.title == "Minimal Task"
    assert task_min.description is None
    assert task_min.priority == TaskPriority.MEDIUM  # Default value
    
    # Test creating a task with all fields
    task_full = TaskCreate(
        title="Full Task",
        description="A task with all fields populated",
        priority=TaskPriority.HIGH
    )
    assert task_full.title == "Full Task"
    assert task_full.description == "A task with all fields populated"
    assert task_full.priority == TaskPriority.HIGH
    
    # Test enum values are correctly defined
    statuses = [s.value for s in TaskStatus]
    assert "pending" in statuses
    assert "in_progress" in statuses
    assert "completed" in statuses
    
    priorities = [p.value for p in TaskPriority]
    assert "low" in priorities
    assert "medium" in priorities  # Note: medium is the enum name, but value might be "medium"
    assert "high" in priorities
    
    # Test that enum values are as expected
    assert TaskStatus.PENDING.value == "pending"
    assert TaskStatus.IN_PROGRESS.value == "in_progress"
    assert TaskStatus.COMPLETED.value == "completed"
    
    assert TaskPriority.LOW.value == "low"
    assert TaskPriority.MEDIUM.value == "medium"
    assert TaskPriority.HIGH.value == "high"


def test_error_conditions():
    """Test error conditions and edge cases."""
    # Test that TaskCreate requires a title (this would be caught by Pydantic validation in real usage)
    try:
        # This would raise a validation error in real usage, but since we're just testing
        # the model structure, we'll verify the validation annotation exists
        from pydantic import BaseModel, ValidationError
        
        # TaskCreate should require title field
        assert hasattr(TaskCreate, '__fields__') or hasattr(TaskCreate, 'model_fields')
        
        # If using Pydantic v2
        if hasattr(TaskCreate, 'model_fields'):
            assert 'title' in TaskCreate.model_fields
            # Check that title is required
            title_field = TaskCreate.model_fields['title']
            assert title_field.is_required()
        
    except ImportError:
        # If Pydantic v1
        if hasattr(TaskCreate, '__fields__'):
            assert 'title' in TaskCreate.__fields__
            title_field = TaskCreate.__fields__['title']
            assert title_field.required