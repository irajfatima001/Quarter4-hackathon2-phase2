from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env")

# Make sure asyncpg is used
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Remove sslmode and channel_binding from URL query if exists
parsed = urlparse(DATABASE_URL)
query = parse_qs(parsed.query)
query.pop("sslmode", None)  # remove sslmode param
query.pop("channel_binding", None)  # remove channel_binding param
parsed = parsed._replace(query=urlencode(query, doseq=True))
DATABASE_URL = urlunparse(parsed)

# Create async engine with SSL for Neon
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": True}  # required by Neon
)

# Async session maker
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

# Optional DB init
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
