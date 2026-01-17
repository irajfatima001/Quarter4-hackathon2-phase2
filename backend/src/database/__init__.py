from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

load_dotenv()

from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/dbname")

# Ensure asyncpg driver is used for async operations
if DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Remove sslmode and channel_binding from URL query if exists
parsed = urlparse(DATABASE_URL)
query = parse_qs(parsed.query)
query.pop("sslmode", None)  # remove sslmode param
query.pop("channel_binding", None)  # remove channel_binding param
parsed = parsed._replace(query=urlencode(query, doseq=True))
DATABASE_URL = urlunparse(parsed)

engine = create_async_engine(DATABASE_URL)


async def init_db():
    """Initialize the database and create tables"""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)