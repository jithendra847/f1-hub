from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/circuits", tags=["Circuits"])
async def get_circuits():
    schedule = await provider_manager.get_schedule("current")
    circuits = [item["circuit"] for item in schedule if "circuit" in item]
    return {"circuits": circuits, "source": "provider"}

@router.get("/circuits/{circuit_id}", tags=["Circuits"])
async def get_circuit_details(circuit_id: str):
    schedule = await provider_manager.get_schedule("current")
    for item in schedule:
        if item.get("circuit", {}).get("id") == circuit_id:
            return {"circuit": item["circuit"], "source": "provider"}
    raise HTTPException(status_code=404, detail=f"Circuit '{circuit_id}' not found")
