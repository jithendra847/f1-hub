import httpx
import logging
from typing import List, Dict, Any, Optional, Union
from app.providers.base import F1DataProvider
from app.core.config import settings

logger = logging.getLogger("f1_providers.jolpica")

class JolpicaProvider(F1DataProvider):
    """
    Jolpica-F1 REST API Adapter (Ergast compatible replacement).
    Handles schedules, race results, driver/constructor listings, and standings.
    """
    def __init__(self):
        self.base_url = settings.JOLPICA_BASE_URL.rstrip('/')
        self.headers = {"User-Agent": "F12026AnalyticsPlatform/1.0.0"}
        self.timeout = 10.0

    @property
    def provider_name(self) -> str:
        return "JolpicaProvider"

    async def _make_request(self, endpoint: str) -> Optional[Dict[str, Any]]:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        async with httpx.AsyncClient(timeout=self.timeout, headers=self.headers) as client:
            try:
                response = await client.get(url)
                if response.status_code == 200:
                    return response.json()
                logger.warning(f"Jolpica API returned status {response.status_code} for URL: {url}")
            except Exception as e:
                logger.error(f"Jolpica request failed for URL {url}: {e}")
        return None

    async def get_seasons(self) -> List[Dict[str, Any]]:
        data = await self._make_request("seasons.json?limit=100")
        if not data:
            return []
        try:
            seasons_list = data["MRData"]["SeasonTable"]["Seasons"]
            return [{"year": int(s["season"]), "url": s.get("url")} for s in seasons_list]
        except KeyError:
            return []

    async def get_schedule(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        data = await self._make_request(f"{target_season}.json")
        if not data:
            return []
        try:
            races = data["MRData"]["RaceTable"]["Races"]
            result = []
            for r in races:
                result.append({
                    "season": int(r["season"]),
                    "round": int(r["round"]),
                    "name": r["raceName"],
                    "circuit": {
                        "id": r["Circuit"]["circuitId"],
                        "name": r["Circuit"]["circuitName"],
                        "locality": r["Circuit"]["Location"].get("locality"),
                        "country": r["Circuit"]["Location"].get("country"),
                        "lat": float(r["Circuit"]["Location"]["lat"]) if "lat" in r["Circuit"]["Location"] else None,
                        "long": float(r["Circuit"]["Location"]["long"]) if "long" in r["Circuit"]["Location"] else None,
                    },
                    "date": r["date"],
                    "url": r.get("url")
                })
            return result
        except (KeyError, ValueError) as e:
            logger.error(f"Error parsing Jolpica schedule response: {e}")
            return []

    async def get_race(self, season: Union[int, str], round_number: int) -> Optional[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        data = await self._make_request(f"{target_season}/{round_number}.json")
        if not data:
            return None
        try:
            races = data["MRData"]["RaceTable"]["Races"]
            if races:
                r = races[0]
                return {
                    "season": int(r["season"]),
                    "round": int(r["round"]),
                    "name": r["raceName"],
                    "circuit_id": r["Circuit"]["circuitId"],
                    "date": r["date"]
                }
        except KeyError:
            pass
        return None

    async def get_session_results(self, season: Union[int, str], round_number: int, session_type: str = "Race") -> List[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        endpoint = f"{target_season}/{round_number}/results.json"
        data = await self._make_request(endpoint)
        if not data:
            return []
        try:
            races = data["MRData"]["RaceTable"]["Races"]
            if not races:
                return []
            results = races[0]["Results"]
            res = []
            for item in results:
                res.append({
                    "driver_id": item["Driver"]["driverId"],
                    "driver_code": item["Driver"].get("code"),
                    "first_name": item["Driver"]["givenName"],
                    "last_name": item["Driver"]["familyName"],
                    "permanent_number": int(item["Driver"]["permanentNumber"]) if "permanentNumber" in item["Driver"] else None,
                    "constructor_id": item["Constructor"]["constructorId"],
                    "constructor_name": item["Constructor"]["name"],
                    "grid": int(item["grid"]),
                    "position": int(item["position"]),
                    "points": float(item["points"]),
                    "laps": int(item["laps"]),
                    "status": item["status"],
                    "fastest_lap": item.get("FastestLap", {}).get("rank") == "1",
                    "fastest_lap_time": item.get("FastestLap", {}).get("Time", {}).get("time")
                })
            return res
        except (KeyError, ValueError) as e:
            logger.error(f"Error parsing Jolpica results: {e}")
            return []

    async def get_drivers(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        data = await self._make_request(f"{target_season}/drivers.json")
        if not data:
            return []
        try:
            drivers = data["MRData"]["DriverTable"]["Drivers"]
            return [{
                "id": d["driverId"],
                "driver_code": d.get("code"),
                "first_name": d["givenName"],
                "last_name": d["familyName"],
                "nationality": d.get("nationality"),
                "permanent_number": int(d["permanentNumber"]) if "permanentNumber" in d else None,
                "date_of_birth": d.get("dateOfBirth")
            } for d in drivers]
        except KeyError:
            return []

    async def get_constructors(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        data = await self._make_request(f"{target_season}/constructors.json")
        if not data:
            return []
        try:
            constructors = data["MRData"]["ConstructorTable"]["Constructors"]
            return [{
                "id": c["constructorId"],
                "name": c["name"],
                "nationality": c.get("nationality")
            } for c in constructors]
        except KeyError:
            return []

    async def get_driver_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        endpoint = f"{target_season}/{round_number}/driverstandings.json" if round_number else f"{target_season}/driverstandings.json"
        data = await self._make_request(endpoint)
        if not data:
            return []
        try:
            lists = data["MRData"]["StandingsTable"]["StandingsLists"]
            if not lists:
                return []
            standings = lists[0]["DriverStandings"]
            return [{
                "position": int(item["position"]),
                "points": float(item["points"]),
                "wins": int(item["wins"]),
                "driver_id": item["Driver"]["driverId"],
                "driver_code": item["Driver"].get("code"),
                "first_name": item["Driver"]["givenName"],
                "last_name": item["Driver"]["familyName"],
                "constructor_id": item["Constructors"][0]["constructorId"] if item.get("Constructors") else None,
                "constructor_name": item["Constructors"][0]["name"] if item.get("Constructors") else None,
            } for item in standings]
        except (KeyError, ValueError) as e:
            logger.error(f"Error parsing Jolpica driver standings: {e}")
            return []

    async def get_constructor_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        target_season = "current" if season == "current" else str(season)
        endpoint = f"{target_season}/{round_number}/constructorstandings.json" if round_number else f"{target_season}/constructorstandings.json"
        data = await self._make_request(endpoint)
        if not data:
            return []
        try:
            lists = data["MRData"]["StandingsTable"]["StandingsLists"]
            if not lists:
                return []
            standings = lists[0]["ConstructorStandings"]
            return [{
                "position": int(item["position"]),
                "points": float(item["points"]),
                "wins": int(item["wins"]),
                "constructor_id": item["Constructor"]["constructorId"],
                "constructor_name": item["Constructor"]["name"]
            } for item in standings]
        except (KeyError, ValueError) as e:
            logger.error(f"Error parsing Jolpica constructor standings: {e}")
            return []

    async def get_laps(self, season: Union[int, str], round_number: int, session_type: str, driver_code: Optional[str] = None) -> List[Dict[str, Any]]:
        return [] # Jolpica does not provide high-resolution lap telemetry

    async def get_telemetry(self, season: Union[int, str], round_number: int, session_type: str, driver_code: str) -> List[Dict[str, Any]]:
        return []

    async def get_weather(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        return []

    async def get_race_control(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        return []
