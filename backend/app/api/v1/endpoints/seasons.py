from fastapi import APIRouter, Depends, Query
from typing import List, Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/seasons", tags=["Seasons"])
async def get_seasons(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    seasons = await provider_manager.jolpica.get_seasons()
    if not seasons:
        seasons = [{"year": y} for y in range(2026, 1949, -1)]

    return {"data": seasons[offset:offset+limit], "total": len(seasons), "source": "provider"}
