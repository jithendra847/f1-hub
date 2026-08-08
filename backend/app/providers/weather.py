import httpx
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("f1_providers.weather")

class WeatherProvider:
    """
    Open-Meteo Weather Provider Fallback Adapter.
    Used when live session telemetry weather is unavailable.
    """
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1/forecast"

    async def get_circuit_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,rain"
        }
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                res = await client.get(self.base_url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    return {
                        "timestamp": datetime.utcnow().isoformat(),
                        "air_temp": current.get("temperature_2m"),
                        "track_temp": current.get("temperature_2m") + 10.0 if current.get("temperature_2m") else None,
                        "humidity": current.get("relative_humidity_2m"),
                        "pressure": current.get("surface_pressure"),
                        "wind_speed": current.get("wind_speed_10m"),
                        "wind_direction": current.get("wind_direction_10m"),
                        "rainfall": bool(current.get("rain", 0) > 0)
                    }
            except Exception as e:
                logger.error(f"Open-Meteo weather fetch error: {e}")
        return None
