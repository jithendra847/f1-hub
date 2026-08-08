import httpx
import logging
from typing import List, Dict, Any, Optional, Union
from app.providers.base import F1DataProvider
from app.core.config import settings

logger = logging.getLogger("f1_providers.openf1")

class OpenF1Provider(F1DataProvider):
    """
    OpenF1 REST API Adapter.
    Specialized for session weather observations, race control flags/messages, and track status.
    Base URL: https://api.openf1.org/v1
    """
    def __init__(self):
        self.base_url = settings.OPENF1_BASE_URL.rstrip('/')
        self.timeout = 8.0

    @property
    def provider_name(self) -> str:
        return "OpenF1Provider"

    async def _make_request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Optional[List[Dict[str, Any]]]:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    return response.json()
                logger.warning(f"OpenF1 API returned status {response.status_code} for URL: {url}")
            except Exception as e:
                logger.error(f"OpenF1 request failed for URL {url}: {e}")
        return None

    async def get_seasons(self) -> List[Dict[str, Any]]:
        return []

    async def get_schedule(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        return []

    async def get_race(self, season: Union[int, str], round_number: int) -> Optional[Dict[str, Any]]:
        return None

    async def get_session_results(self, season: Union[int, str], round_number: int, session_type: str = "Race") -> List[Dict[str, Any]]:
        return []

    async def get_drivers(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        return []

    async def get_constructors(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        return []

    async def get_driver_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        return []

    async def get_constructor_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        return []

    async def get_laps(self, season: Union[int, str], round_number: int, session_type: str, driver_code: Optional[str] = None) -> List[Dict[str, Any]]:
        return []

    async def get_telemetry(self, season: Union[int, str], round_number: int, session_type: str, driver_code: str) -> List[Dict[str, Any]]:
        return []

    async def get_weather(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        data = await self._make_request("weather", params={"session_key": "latest"})
        if not data:
            return []
        res = []
        for item in data:
            res.append({
                "timestamp": item.get("date"),
                "air_temp": item.get("air_temperature"),
                "track_temp": item.get("track_temperature"),
                "humidity": item.get("humidity"),
                "pressure": item.get("pressure"),
                "wind_speed": item.get("wind_speed"),
                "wind_direction": item.get("wind_direction"),
                "rainfall": bool(item.get("rainfall", 0))
            })
        return res

    async def get_race_control(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        data = await self._make_request("race_control", params={"session_key": "latest"})
        if not data:
            return []
        res = []
        for item in data:
            res.append({
                "timestamp": item.get("date"),
                "flag": item.get("flag"),
                "message": item.get("message", ""),
                "category": item.get("category"),
                "scope": item.get("scope")
            })
        return res
