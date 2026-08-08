from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/news", tags=["News"])
async def get_news(
    category: Optional[str] = Query(None, description="Category filter (RACE, FIA, TEAMS, TECHNICAL)"),
    limit: int = Query(20, ge=1, le=100)
):
    articles = await provider_manager.get_news(limit=50)
    filtered = [a for a in articles if category is None or a.get("category") == category]
    return {"articles": filtered[:limit], "total": len(filtered), "source": "provider"}
