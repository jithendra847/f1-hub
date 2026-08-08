from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Union
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.providers.manager import provider_manager

from app.services.ingestion_service import IngestionService

router = APIRouter()

@router.get("/calendar", tags=["Calendar"])
async def get_calendar(
    season: str = Query("current", description="Season year or 'current'"),
    db: AsyncSession = Depends(get_db)
):
    races = await provider_manager.get_schedule(season)
    if races:
        return {"season": season, "races": races, "source": "provider"}

    # Database Fallback
    service = IngestionService(db)
    synced = await service.sync_calendar(season)
    return {"season": season, "races": [], "synced": synced, "source": "database_fallback"}

@router.get("/races/{race_id}", tags=["Calendar"])
async def get_race_details(race_id: str):
    parts = race_id.split("_")
    if len(parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid race_id format. Expected {season}_{round}")
    season, round_num = parts[0], int(parts[1])
    
    race = await provider_manager.jolpica.get_race(season, round_num)
    if not race:
        raise HTTPException(status_code=404, detail="Race not found")

    return {"data": race, "source": "provider"}
