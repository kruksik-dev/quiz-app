import os
from typing import Any, AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///quiz.db")
engine = create_async_engine(DATABASE_URL, connect_args={"check_same_thread": False})


async def init_db() -> None:
    """Inicjalizacja bazy danych."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_db() -> AsyncGenerator[AsyncSession, Any]:
    """Generator sesji bazy danych."""
    async with AsyncSession(engine) as session:
        yield session
