# JWT Middleware Skill

## Name
jwt-middleware

## Description
Creates secure FastAPI dependency to verify JWT token from Better Auth, extract user_id, raise 401 on invalid token

## Allowed Tools
- code_write
- file_edit

## Instructions
1. Use python-jose library for JWT verification
2. Retrieve the secret key from environment variable `os.getenv("BETTER_AUTH_SECRET")`
3. Use algorithm `ALGORITHM="HS256"` for token verification
4. Extract user_id from payload using `payload["sub"]`
5. Raise `HTTPException(401, "Invalid token")` on verification errors
6. Return `UserToken(user_id)` object with the extracted user ID
7. Use in endpoints with `Depends(get_current_user)`
8. Ensure all database queries are filtered by `user.user_id` to maintain user isolation

## Implementation Example

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from jose import JWTError, jwt
from pydantic import BaseModel

ALGORITHM = "HS256"

class UserToken(BaseModel):
    user_id: str

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserToken:
    """
    Verifies JWT token from Better Auth, extracts user_id, and raises 401 on invalid token.
    """
    token = credentials.credentials
    
    try:
        # Decode the JWT token using the secret from environment variables
        payload = jwt.decode(
            token,
            os.getenv("BETTER_AUTH_SECRET"),
            algorithms=[ALGORITHM]
        )
        
        # Extract user_id from the subject claim
        user_id = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: No user ID found")
            
        return UserToken(user_id=user_id)
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Usage Example

```python
from fastapi import FastAPI, Depends
from .middleware import get_current_user, UserToken

app = FastAPI()

@app.get("/protected-endpoint")
async def protected_route(current_user: UserToken = Depends(get_current_user)):
    # Access the user_id with current_user.user_id
    # Remember to filter all queries by current_user.user_id
    return {"message": f"Hello user {current_user.user_id}"}
```

## Important Notes
- Always ensure that database queries are filtered by the authenticated user's ID to maintain proper user isolation
- Store the Better Auth secret securely in environment variables
- The JWT token should be sent in the Authorization header as a Bearer token
- This middleware should be applied to all endpoints that require authentication