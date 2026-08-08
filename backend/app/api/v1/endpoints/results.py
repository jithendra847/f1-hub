from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/sessions/{session_id}/results", tags=["Results"])
async def get_session_results(session_id: str):
    parts = session_id.split("_")
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    season = parts[0]
    round_num = int(parts[1])
    session_type = parts[2] if len(parts) > 2 else "Race"

    results = await provider_manager.get_session_results(season, round_num, session_type)
    return {"session_id": session_id, "results": results, "source": "provider"}
