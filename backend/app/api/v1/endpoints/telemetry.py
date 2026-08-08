from fastapi import APIRouter

router = APIRouter()

@router.get("/telemetry/session-status", tags=["Telemetry Disabled"])
async def get_session_status():
    """
    Live telemetry feature is temporarily disabled.
    """
    return {
        "session_status": "DISABLED",
        "is_live": False,
        "telemetry_available": False,
        "current_session": None,
        "next_session": None,
        "telemetry": []
    }

@router.get("/telemetry/live/{session_id}", tags=["Telemetry Disabled"])
async def poll_live_telemetry(session_id: str):
    """
    Live telemetry feature is temporarily disabled.
    """
    return {
        "status": "DISABLED",
        "is_live": False,
        "telemetry_available": False,
        "telemetry": []
    }
