from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/constructors", tags=["Constructors"])
async def get_constructors(season: str = Query("current")):
    constructors = await provider_manager.jolpica.get_constructors(season)
    return {"season": season, "constructors": constructors, "source": "provider"}

@router.get("/constructors/{constructor_id}", tags=["Constructors"])
async def get_constructor_profile(constructor_id: str):
    constructors = await provider_manager.jolpica.get_constructors("current")
    for c in constructors:
        if c["id"] == constructor_id:
            return {"constructor": c, "source": "provider"}
    raise HTTPException(status_code=404, detail=f"Constructor '{constructor_id}' not found")
