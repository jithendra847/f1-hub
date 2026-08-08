#!/bin/bash
set -e

echo "=================================================="
echo "🏎️ Formula 1 Analytics Platform Startup Engine"
echo "=================================================="

echo "Waiting for PostgreSQL database connection..."
until python -c "
import asyncio, asyncpg, os
async def check():
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL').replace('postgresql+asyncpg://', 'postgresql://'))
        await conn.close()
        return True
    except Exception:
        return False
exit(0 if asyncio.run(check()) else 1)
"; do
  echo "PostgreSQL is unavailable - sleeping 2s..."
  sleep 2
done

echo "PostgreSQL is healthy and reachable."

echo "Executing Alembic database migrations..."
alembic upgrade head
echo "Database migrations applied successfully."

echo "Starting Uvicorn production ASGI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
