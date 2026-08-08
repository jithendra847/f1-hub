import asyncio
import logging
from typing import List, Dict, Any, Optional, Union
from app.providers.base import F1DataProvider

logger = logging.getLogger("f1_providers.fastf1")

class FastF1Provider(F1DataProvider):
    """
    FastF1 Python Library Engine Adapter.
    Specialized for lap timing, sector times, tyre compound information, and car telemetry.
    Runs FastF1 data extraction in async thread executors to prevent main loop blocking.
    """
    def __init__(self):
        self._enabled = True
        try:
            import fastf1
            # Enable cache if cache dir is configured
            fastf1.Cache.enable_cache('/tmp/fastf1_cache')
        except Exception as e:
            logger.warning(f"FastF1 cache initialization warning: {e}")

    @property
    def provider_name(self) -> str:
        return "FastF1Provider"

    async def get_seasons(self) -> List[Dict[str, Any]]:
        return []

    async def get_schedule(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        def _fetch_schedule():
            import fastf1
            year = 2026 if season == "current" else int(season)
            event_schedule = fastf1.get_event_schedule(year)
            races = []
            for _, row in event_schedule.iterrows():
                races.append({
                    "season": year,
                    "round": int(row["RoundNumber"]),
                    "name": str(row["EventName"]),
                    "circuit": {
                        "id": str(row["Location"]).lower().replace(" ", "_"),
                        "name": str(row["Location"]),
                        "country": str(row["Country"]),
                    },
                    "date": str(row["EventDate"]) if hasattr(row, "EventDate") else None
                })
            return races

        try:
            return await asyncio.to_thread(_fetch_schedule)
        except Exception as e:
            logger.error(f"FastF1 get_schedule failed: {e}")
            return []

    async def get_race(self, season: Union[int, str], round_number: int) -> Optional[Dict[str, Any]]:
        schedule = await self.get_schedule(season)
        for r in schedule:
            if r["round"] == round_number:
                return r
        return None

    async def get_session_results(self, season: Union[int, str], round_number: int, session_type: str = "Race") -> List[Dict[str, Any]]:
        def _fetch_results():
            import fastf1
            year = 2026 if season == "current" else int(season)
            session = fastf1.get_session(year, round_number, session_type)
            session.load(laps=False, telemetry=False, weather=False, messages=False)
            res = []
            if hasattr(session, "results") and session.results is not None:
                for _, row in session.results.iterrows():
                    res.append({
                        "driver_id": str(row.get("DriverId", row.get("Abbreviation", ""))).lower(),
                        "driver_code": str(row.get("Abbreviation", "")),
                        "first_name": str(row.get("FirstName", "")),
                        "last_name": str(row.get("LastName", "")),
                        "permanent_number": int(row.get("DriverNumber", 0)) if row.get("DriverNumber") else None,
                        "constructor_id": str(row.get("TeamName", "")).lower().replace(" ", "_"),
                        "constructor_name": str(row.get("TeamName", "")),
                        "grid": int(row.get("GridPosition", 0)),
                        "position": int(row.get("Position", 0)),
                        "points": float(row.get("Points", 0.0)),
                        "status": str(row.get("Status", "Finished"))
                    })
            return res

        try:
            return await asyncio.to_thread(_fetch_results)
        except Exception as e:
            logger.error(f"FastF1 session results failed: {e}")
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
        def _fetch_laps():
            import fastf1
            year = 2026 if season == "current" else int(season)
            session = fastf1.get_session(year, round_number, session_type)
            session.load(laps=True, telemetry=False, weather=False, messages=False)
            laps_df = session.laps
            if driver_code:
                laps_df = laps_df.pick_driver(driver_code)
            
            res = []
            for _, row in laps_df.iterrows():
                lap_time = row.get("LapTime")
                seconds = lap_time.total_seconds() if lap_time is not None and hasattr(lap_time, "total_seconds") else None
                res.append({
                    "driver_code": str(row.get("Driver", "")),
                    "lap_number": int(row.get("LapNumber", 0)),
                    "lap_time_seconds": seconds,
                    "compound": str(row.get("Compound", "")),
                    "tyre_age": int(row.get("TyreLife", 0)) if row.get("TyreLife") else None,
                    "is_personal_best": bool(row.get("IsPersonalBest", False))
                })
            return res

        try:
            return await asyncio.to_thread(_fetch_laps)
        except Exception as e:
            logger.error(f"FastF1 get_laps failed: {e}")
            return []

    async def get_telemetry(self, season: Union[int, str], round_number: int, session_type: str, driver_code: str) -> List[Dict[str, Any]]:
        def _fetch_telemetry():
            import fastf1
            year = 2026 if season == "current" else int(season)
            session = fastf1.get_session(year, round_number, session_type)
            session.load(laps=True, telemetry=True, weather=False, messages=False)
            driver_laps = session.laps.pick_driver(driver_code)
            fastest_lap = driver_laps.pick_fastest()
            if fastest_lap is None:
                return []
            telemetry = fastest_lap.get_telemetry()
            res = []
            for _, row in telemetry.iterrows():
                res.append({
                    "distance": float(row.get("Distance", 0.0)),
                    "speed": float(row.get("Speed", 0.0)),
                    "rpm": int(row.get("RPM", 0)),
                    "gear": int(row.get("nGear", 0)),
                    "throttle": float(row.get("Throttle", 0.0)),
                    "brake": float(row.get("Brake", 0.0))
                })
            return res

        try:
            return await asyncio.to_thread(_fetch_telemetry)
        except Exception as e:
            logger.error(f"FastF1 telemetry failed: {e}")
            return []

    async def get_weather(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        return []

    async def get_race_control(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        return []
