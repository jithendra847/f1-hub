from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
from app.providers.manager import provider_manager


router = APIRouter()

ERAS = [
    {"id": "2026_ground_effect", "name": "2026 Regulations (Active)", "years": "2026-Present"},
    {"id": "2022_ground_effect", "name": "Ground Effect Era", "years": "2022-2025"},
    {"id": "turbo_hybrid", "name": "1.6L V6 Turbo-Hybrid Era", "years": "2014-2021"},
    {"id": "v8_engine", "name": "2.4L V8 Engine Era", "years": "2006-2013"},
    {"id": "v10_engine", "name": "3.0L V10 Engine Era", "years": "1995-2005"},
    {"id": "classic_era", "name": "Classic Championship Era", "years": "1950-1994"}
]

@router.get("/historical/eras", tags=["Historical & Ergast Archival"])
async def get_historical_eras():
    return {"eras": ERAS}

@router.get("/historical/seasons", tags=["Historical & Ergast Archival"])
async def get_historical_seasons(
    decade: Optional[str] = Query(None, description="Decade filter e.g. 2020s, 2010s, 2000s"),
    era: Optional[str] = Query(None, description="Era ID filter")
):
    all_years = list(range(2026, 1949, -1))
    filtered_years = all_years

    if decade:
        start_year = int(decade.replace("s", ""))
        filtered_years = [y for y in all_years if start_year <= y <= start_year + 9]

    if era:
        if era == "2026_ground_effect":
            filtered_years = [y for y in filtered_years if y >= 2026]
        elif era == "2022_ground_effect":
            filtered_years = [y for y in filtered_years if 2022 <= y <= 2025]
        elif era == "turbo_hybrid":
            filtered_years = [y for y in filtered_years if 2014 <= y <= 2021]
        elif era == "v8_engine":
            filtered_years = [y for y in filtered_years if 2006 <= y <= 2013]
        elif era == "v10_engine":
            filtered_years = [y for y in filtered_years if 1995 <= y <= 2005]
        elif era == "classic_era":
            filtered_years = [y for y in filtered_years if 1950 <= y <= 1994]

    seasons_data = [{"year": y, "races_count": 24 if y >= 2024 else 21} for y in filtered_years]
    return {"seasons": seasons_data, "source": "provider"}

@router.get("/ergast/f1/{year}/results", tags=["Ergast API Compatibility"])
async def get_ergast_season_results(year: str):
    schedule = await provider_manager.get_schedule(year)
    ergast_format = {
        "MRData": {
            "xmlns": "http://ergast.com/mrd/1.5",
            "series": "f1",
            "url": f"http://ergast.com/api/f1/{year}/results.json",
            "limit": "30",
            "offset": "0",
            "total": str(len(schedule)),
            "RaceTable": {
                "season": year,
                "Races": schedule
            }
        }
    }
    return ergast_format

@router.get("/ergast/f1/{year}/driverStandings", tags=["Ergast API Compatibility"])
async def get_ergast_driver_standings(year: str):
    standings = await provider_manager.get_driver_standings(year)
    ergast_format = {
        "MRData": {
            "series": "f1",
            "StandingsTable": {
                "season": year,
                "StandingsLists": [{"season": year, "DriverStandings": standings}]
            }
        }
    }
    return ergast_format
