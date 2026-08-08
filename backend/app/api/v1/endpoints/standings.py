from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/standings/drivers", tags=["Standings"])
async def get_driver_standings(season: str = Query("current")):
    standings = await provider_manager.get_driver_standings(season)
    return {"season": season, "standings": standings, "source": "provider"}

@router.get("/standings/constructors", tags=["Standings"])
async def get_constructor_standings(season: str = Query("current")):
    standings = await provider_manager.get_constructor_standings(season)
    return {"season": season, "standings": standings, "source": "provider"}
