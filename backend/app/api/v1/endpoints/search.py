from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any, List
from app.providers.manager import provider_manager

router = APIRouter()

@router.get("/search", tags=["Search"])
async def global_search(q: str = Query(..., min_length=2, description="Search query term")):
    term = q.lower().strip()
    
    # Fetch current drivers, constructors, circuits, news
    drivers = await provider_manager.jolpica.get_drivers("current")
    constructors = await provider_manager.jolpica.get_constructors("current")
    schedule = await provider_manager.get_schedule("current")
    news = await provider_manager.get_news(limit=20)

    matched_drivers = [
        d for d in drivers 
        if term in d["first_name"].lower() or term in d["last_name"].lower() or term in (d.get("driver_code") or "").lower()
    ]
    
    matched_constructors = [
        c for c in constructors 
        if term in c["name"].lower() or term in (c.get("id") or "").lower()
    ]

    matched_races = [
        r for r in schedule 
        if term in r["name"].lower() or term in r["circuit"]["name"].lower() or term in (r["circuit"].get("country") or "").lower()
    ]

    matched_news = [
        n for n in news 
        if term in n["title"].lower() or term in n["summary"].lower()
    ]

    return {
        "query": q,
        "results": {
            "drivers": matched_drivers,
            "constructors": matched_constructors,
            "races": matched_races,
            "news": matched_news
        },
        "total_matches": len(matched_drivers) + len(matched_constructors) + len(matched_races) + len(matched_news)
    }
