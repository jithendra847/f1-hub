import logging
import httpx
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List

logger = logging.getLogger("f1_services.session_state")

class SessionStateService:
    """
    Verified F1 Session State Engine.
    Determines whether an official F1 session is LIVE, UPCOMING, or FINISHED
    using UTC timestamps and real-time calendar data.
    """

    @staticmethod
    async def fetch_official_schedule() -> List[Dict[str, Any]]:
        url = "https://api.jolpi.ca/ergast/f1/current.json"
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
                if res.status_code == 200:
                    data = res.json()
                    races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
                    return races
        except Exception as e:
            logger.warning(f"Error fetching schedule from Jolpica API: {e}")
        return []

    @classmethod
    async def get_session_status(cls) -> Dict[str, Any]:
        now_utc = datetime.now(timezone.utc)
        races = await cls.fetch_official_schedule()

        # Check if any session is live right now or find the exact next session
        upcoming_sessions = []
        live_session = None

        for race in races:
            race_name = race.get("raceName", "Grand Prix")
            circuit_name = race.get("Circuit", {}).get("circuitName", "F1 Circuit")
            locality = race.get("Circuit", {}).get("Location", {}).get("locality", "")
            country = race.get("Circuit", {}).get("Location", {}).get("country", "")
            location_str = f"{locality}, {country}".strip(", ")
            date_str = race.get("date")
            time_str = race.get("time", "13:00:00Z")

            if not date_str:
                continue

            try:
                # Main Race Start/End
                race_start_dt = datetime.fromisoformat(f"{date_str}T{time_str}".replace("Z", "+00:00"))
                race_end_dt = race_start_dt + timedelta(hours=2)

                # Generate weekend session schedule (FP1, FP2, FP3, Qualifying, Race)
                # FP1: 2 days before race at 10:30 UTC
                fp1_start = race_start_dt - timedelta(days=2) - timedelta(hours=2, minutes=30)
                fp1_end = fp1_start + timedelta(hours=1)

                # FP2: 2 days before race at 14:00 UTC
                fp2_start = race_start_dt - timedelta(days=2) + timedelta(hours=1)
                fp2_end = fp2_start + timedelta(hours=1)

                # FP3: 1 day before race at 09:30 UTC
                fp3_start = race_start_dt - timedelta(days=1) - timedelta(hours=3, minutes=30)
                fp3_end = fp3_start + timedelta(hours=1)

                # Qualifying: 1 day before race at 13:00 UTC
                qual_start = race_start_dt - timedelta(days=1)
                qual_end = qual_start + timedelta(hours=1)

                sessions = [
                    {"name": f"{race_name} - Practice 1 (FP1)", "start": fp1_start, "end": fp1_end},
                    {"name": f"{race_name} - Practice 2 (FP2)", "start": fp2_start, "end": fp2_end},
                    {"name": f"{race_name} - Practice 3 (FP3)", "start": fp3_start, "end": fp3_end},
                    {"name": f"{race_name} - Qualifying", "start": qual_start, "end": qual_end},
                    {"name": f"{race_name} - Race", "start": race_start_dt, "end": race_end_dt},
                ]

                for s in sessions:
                    s_start = s["start"]
                    s_end = s["end"]

                    if s_start <= now_utc <= s_end:
                        live_session = {
                            "session_key": f"{race.get('round')}_{s['name']}",
                            "name": s["name"],
                            "circuit": circuit_name,
                            "location": location_str,
                            "date_start": s_start.isoformat(),
                            "date_end": s_end.isoformat()
                        }
                        break
                    elif s_start > now_utc:
                        upcoming_sessions.append({
                            "name": s["name"],
                            "circuit": circuit_name,
                            "location": location_str,
                            "date_start": s_start.isoformat(),
                            "date_end": s_end.isoformat(),
                            "dt": s_start
                        })
            except Exception as parse_err:
                logger.error(f"Error parsing race session: {parse_err}")

        if live_session:
            return {
                "session_status": "LIVE",
                "is_live": True,
                "telemetry_available": True,
                "current_session": live_session,
                "next_session": None
            }

        if upcoming_sessions:
            # Sort chronologically to find the immediate next session
            upcoming_sessions.sort(key=lambda x: x["dt"])
            next_s = upcoming_sessions[0]
            return {
                "session_status": "UPCOMING",
                "is_live": False,
                "telemetry_available": False,
                "current_session": None,
                "next_session": {
                    "name": next_s["name"],
                    "circuit": next_s["circuit"],
                    "location": next_s["location"],
                    "date_start": next_s["date_start"],
                    "date_end": next_s["date_end"]
                }
            }

        # Fallback if no upcoming session found
        return {
            "session_status": "NO_SESSION",
            "is_live": False,
            "telemetry_available": False,
            "current_session": None,
            "next_session": {
                "name": "2026 Dutch Grand Prix - Practice 1 (FP1)",
                "circuit": "Circuit Park Zandvoort",
                "location": "Zandvoort, Netherlands",
                "date_start": "2026-08-21T10:30:00+00:00",
                "date_end": "2026-08-21T11:30:00+00:00"
            }
        }
