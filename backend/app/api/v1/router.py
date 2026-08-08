from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    seasons,
    calendar,
    results,
    standings,
    drivers,
    constructors,
    circuits,
    news,
    technical,
    weather,
    search,
    analytics,
    telemetry,
    historical,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(seasons.router)
api_router.include_router(calendar.router)
api_router.include_router(results.router)
api_router.include_router(standings.router)
api_router.include_router(drivers.router)
api_router.include_router(constructors.router)
api_router.include_router(circuits.router)
api_router.include_router(news.router)
api_router.include_router(technical.router)
api_router.include_router(weather.router)
api_router.include_router(search.router)
api_router.include_router(analytics.router)
api_router.include_router(telemetry.router)
api_router.include_router(historical.router)
