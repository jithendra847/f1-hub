from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "F1 2026 Analytics Platform Backend",
        "environment": settings.ENVIRONMENT,
        "current_season": settings.CURRENT_F1_SEASON
    }

@router.get("/health/db", tags=["Health"])
async def health_check_db(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        val = result.scalar()
        if val == 1:
            return {"status": "healthy", "database": "postgresql", "connected": True}
        return {"status": "unhealthy", "database": "postgresql", "connected": False}
    except Exception as e:
        return {"status": "unhealthy", "database": "postgresql", "error": str(e)}

