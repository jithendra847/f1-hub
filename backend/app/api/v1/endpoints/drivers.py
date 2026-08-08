from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/drivers", tags=["Drivers"])
async def get_drivers(season: str = Query("current")):
    drivers = await provider_manager.jolpica.get_drivers(season)
    return {"season": season, "drivers": drivers, "source": "provider"}

@router.get("/drivers/{driver_id}", tags=["Drivers"])
async def get_driver_profile(driver_id: str):
    drivers = await provider_manager.jolpica.get_drivers("current")
    for d in drivers:
        if d["id"] == driver_id or d.get("driver_code") == driver_id.upper():
            return {"driver": d, "source": "provider"}
    raise HTTPException(status_code=404, detail=f"Driver '{driver_id}' not found")
