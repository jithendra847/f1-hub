from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.providers.manager import provider_manager


router = APIRouter()

@router.get("/weather/{race_id}", tags=["Weather"])
async def get_race_weather(race_id: str):
    parts = race_id.split("_")
    season = parts[0] if len(parts) >= 1 else "current"
    round_num = int(parts[1]) if len(parts) >= 2 else 1

    weather_data = await provider_manager.get_weather(season, round_num, "Race")
    if weather_data:
        return {"race_id": race_id, "weather": weather_data, "source": "provider"}

    # Fallback to circuit weather via Open-Meteo
    schedule = await provider_manager.get_schedule(season)
    for item in schedule:
        if str(item.get("round")) == str(round_num):
            lat = item.get("circuit", {}).get("lat")
            lon = item.get("circuit", {}).get("long")
            if lat and lon:
                circuit_weather = await provider_manager.weather_provider.get_circuit_weather(lat, lon)
                if circuit_weather:
                    return {"race_id": race_id, "weather": [circuit_weather], "source": "open_meteo_fallback"}

    return {"race_id": race_id, "weather": [], "message": "Weather data unavailable.", "source": "unavailable"}
