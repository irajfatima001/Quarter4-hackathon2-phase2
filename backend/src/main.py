from fastapi import FastAPI
from src.api.routes import tasks
from src.database import init_db
from src.utils.security import add_security_features
import asyncio

app = FastAPI(title="Todo API", version="1.0.0")

# Add security features including rate limiting and logging
add_security_features(app)


@app.on_event("startup")
async def startup_event():
    await init_db()


# Include API routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}