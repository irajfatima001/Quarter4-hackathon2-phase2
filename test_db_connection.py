import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
from dotenv import load_dotenv

# Load .env file
load_dotenv(dotenv_path="/mnt/d/Hackathon 2/phase II/backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL missing in .env")

# Convert to asyncpg if needed
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Remove sslmode from URL
parsed = urlparse(DATABASE_URL)
query = parse_qs(parsed.query)
query.pop("sslmode", None)
parsed = parsed._replace(query=urlencode(query, doseq=True))
DATABASE_URL = urlunparse(parsed)

print(f"Using database URL: {DATABASE_URL}")

# Create async engine with SSL
engine = create_async_engine(DATABASE_URL, connect_args={"ssl": True})

# Test database connection
async def test_db():
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        print("\n✅ Database connection successful!\n")
    except Exception as e:
        print("\n❌ Database connection failed:", e, "\n")
        raise e

asyncio.run(test_db())