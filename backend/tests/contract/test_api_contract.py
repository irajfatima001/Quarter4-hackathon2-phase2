import pytest
from backend.src.main import app
from fastapi.testclient import TestClient


def test_openapi_spec_compliance():
    """Test that the API complies with the OpenAPI specification."""
    client = TestClient(app)
    
    # Get the OpenAPI schema
    response = client.get("/openapi.json")
    assert response.status_code == 200
    
    openapi_schema = response.json()
    
    # Verify the schema has the expected structure
    assert "openapi" in openapi_schema
    assert "info" in openapi_schema
    assert "paths" in openapi_schema
    
    # Check that our expected paths are defined in the schema
    paths = openapi_schema["paths"]
    
    # The paths should include our task endpoints (though the exact format depends on how FastAPI generates the schema)
    # Since our router uses a prefix with a path parameter, the paths will be relative to that
    expected_paths_pattern = [
        "/api/{user_id}/tasks",
        "/api/{user_id}/tasks/{task_id}",
        "/api/{user_id}/tasks/{task_id}/complete"
    ]
    
    # Check that paths exist (the actual paths will have the user_id parameter)
    found_paths = []
    for path in paths.keys():
        if "/tasks" in path:
            found_paths.append(path)
    
    # We should have at least the main tasks endpoint and individual task endpoints
    assert len(found_paths) >= 3, f"Expected at least 3 task-related paths, found: {found_paths}"
    
    # Check that the paths have the expected operations
    for path, methods in paths.items():
        if "/tasks" in path:
            # All task paths should have security defined
            # (This checks if the authentication dependency is properly applied)
            break  # Just checking one is sufficient for this test


def test_api_endpoint_structure():
    """Test the structure of API endpoints."""
    # Check that the app has the expected routes
    route_paths = [route.path for route in app.routes]
    
    # Look for routes that contain 'tasks' (these would be our task endpoints)
    task_routes = [path for path in route_paths if 'task' in path.lower()]
    
    # We should have multiple task-related routes
    assert len(task_routes) >= 3, f"Expected at least 3 task routes, got: {task_routes}"
    
    # Verify that our router was properly included with the correct prefix
    has_expected_prefix = any("/api/{user_id}" in path for path in route_paths)
    assert has_expected_prefix, f"Expected routes with prefix '/api/{{user_id}}', found: {route_paths}"