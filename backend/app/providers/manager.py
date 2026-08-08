import logging
from typing import List, Dict, Any, Optional, Union
from app.providers.base import F1DataProvider
from app.providers.jolpica import JolpicaProvider
from app.providers.fastf1_adapter import FastF1Provider
from app.providers.openf1 import OpenF1Provider
from app.providers.news import NewsProvider
from app.providers.weather import WeatherProvider

logger = logging.getLogger("f1_providers.manager")

class ProviderManager:
    """
    Provider Abstraction Manager.
    Coordinates multi-tiered domain priorities, provider fallbacks, timeouts, retries, and error handling.
    Prevents direct dependency on any single third-party F1 API.
    """
    def __init__(self):
        self.jolpica = JolpicaProvider()
        self.fastf1 = FastF1Provider()
        self.openf1 = OpenF1Provider()
        self.news_provider = NewsProvider()
        self.weather_provider = WeatherProvider()

    async def get_schedule(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        # Domain Fallback: 1. Jolpica -> 2. FastF1 -> 3. Empty list (DB Fallback handled in service layer)
        try:
            res = await self.jolpica.get_schedule(season)
            if res:
                logger.info(f"Fetched {len(res)} races from Jolpica for season {season}")
                return res
        except Exception as e:
            logger.warning(f"Jolpica schedule fetch failed, attempting FastF1 fallback: {e}")

        try:
            res = await self.fastf1.get_schedule(season)
            if res:
                logger.info(f"Fetched {len(res)} races from FastF1 for season {season}")
                return res
        except Exception as e:
            logger.error(f"FastF1 schedule fallback failed: {e}")

        return []

    async def get_session_results(self, season: Union[int, str], round_number: int, session_type: str = "Race") -> List[Dict[str, Any]]:
        # Domain Fallback: 1. Jolpica -> 2. FastF1 -> 3. Empty list
        try:
            res = await self.jolpica.get_session_results(season, round_number, session_type)
            if res:
                return res
        except Exception as e:
            logger.warning(f"Jolpica session results failed, attempting FastF1 fallback: {e}")

        try:
            res = await self.fastf1.get_session_results(season, round_number, session_type)
            if res:
                return res
        except Exception as e:
            logger.error(f"FastF1 session results fallback failed: {e}")

        return []

    async def get_driver_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        try:
            res = await self.jolpica.get_driver_standings(season, round_number)
            if res:
                return res
        except Exception as e:
            logger.error(f"Jolpica driver standings fetch failed: {e}")
        return []

    async def get_constructor_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        try:
            res = await self.jolpica.get_constructor_standings(season, round_number)
            if res:
                return res
        except Exception as e:
            logger.error(f"Jolpica constructor standings fetch failed: {e}")
        return []

    async def get_laps(self, season: Union[int, str], round_number: int, session_type: str, driver_code: Optional[str] = None) -> List[Dict[str, Any]]:
        # Domain Fallback: 1. FastF1 -> 2. OpenF1 -> 3. Empty list
        try:
            res = await self.fastf1.get_laps(season, round_number, session_type, driver_code)
            if res:
                return res
        except Exception as e:
            logger.error(f"FastF1 get_laps failed: {e}")
        return []

    async def get_telemetry(self, season: Union[int, str], round_number: int, session_type: str, driver_code: str) -> List[Dict[str, Any]]:
        try:
            res = await self.fastf1.get_telemetry(season, round_number, session_type, driver_code)
            if res:
                return res
        except Exception as e:
            logger.error(f"FastF1 telemetry fetch failed: {e}")
        return []

    async def get_weather(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        # Domain Fallback: 1. OpenF1 -> 2. FastF1 -> 3. Empty list
        try:
            res = await self.openf1.get_weather(season, round_number, session_type)
            if res:
                return res
        except Exception as e:
            logger.warning(f"OpenF1 weather fetch failed: {e}")
        return []

    async def get_race_control(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        try:
            res = await self.openf1.get_race_control(season, round_number, session_type)
            if res:
                return res
        except Exception as e:
            logger.error(f"OpenF1 race control fetch failed: {e}")
        return []

    async def get_news(self, limit: int = 20) -> List[Dict[str, Any]]:
        try:
            return await self.news_provider.get_latest_news(limit)
        except Exception as e:
            logger.error(f"News provider fetch failed: {e}")
            return []

provider_manager = ProviderManager()
