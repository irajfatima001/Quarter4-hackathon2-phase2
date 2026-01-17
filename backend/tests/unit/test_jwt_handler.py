import pytest
from backend.src.auth.jwt_handler import create_access_token, verify_token
from datetime import timedelta


def test_valid_jwt_token():
    """Test that a valid JWT token can be created and verified."""
    # Create a token with user data
    user_data = {"sub": "123", "email": "test@example.com"}
    token = create_access_token(data=user_data)
    
    # Verify the token
    user_id = verify_token(token)
    
    # Check that the user ID matches
    assert user_id == "123"


def test_invalid_jwt_token():
    """Test that an invalid JWT token returns None."""
    # Try to verify an invalid token
    user_id = verify_token("invalid.token.string")
    
    # Should return None for invalid token
    assert user_id is None


def test_expired_jwt_token():
    """Test that an expired JWT token returns None."""
    # Create a token that expires immediately
    user_data = {"sub": "123", "email": "test@example.com"}
    token = create_access_token(
        data=user_data,
        expires_delta=timedelta(seconds=-1)  # Expired 1 second ago
    )
    
    # Verify the expired token
    user_id = verify_token(token)
    
    # Should return None for expired token
    assert user_id is None


def test_token_without_sub_claim():
    """Test that a token without the 'sub' claim returns None."""
    # Create a token without the 'sub' claim
    user_data = {"email": "test@example.com"}  # Missing 'sub' claim
    token = create_access_token(data=user_data)
    
    # Verify the token
    user_id = verify_token(token)
    
    # Should return None since 'sub' claim is missing
    assert user_id is None