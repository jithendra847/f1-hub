from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime, date

class SeasonSchema(BaseModel):
    year: int = Field(..., ge=1950, le=2030)
    wikipedia_url: Optional[str] = None

class CircuitSchema(BaseModel):
    id: str
    name: str
    locality: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    length_km: Optional[float] = None
    turns: Optional[int] = None

class ConstructorSchema(BaseModel):
    id: str
    name: str
    nationality: Optional[str] = None
    color_hex: Optional[str] = None
    logo_url: Optional[str] = None

class DriverSchema(BaseModel):
    id: str
    driver_code: Optional[str] = None
    first_name: str
    last_name: str
    nationality: Optional[str] = None
    permanent_number: Optional[int] = None
    date_of_birth: Optional[date] = None
    image_url: Optional[str] = None

class RaceSchema(BaseModel):
    id: str
    season: int
    round: int
    name: str
    official_name: Optional[str] = None
    circuit_id: str
    date: date
    status: str = "UPCOMING"

class SessionSchema(BaseModel):
    id: str
    race_id: str
    type: str # FP1, FP2, FP3, SPRINT_QUALIFYING, SPRINT, QUALIFYING, RACE
    name: str
    scheduled_start: Optional[datetime] = None
    actual_start: Optional[datetime] = None
    status: str = "SCHEDULED"
    results_available: bool = False

class SessionResultSchema(BaseModel):
    session_id: str
    driver_id: str
    constructor_id: str
    grid_position: Optional[int] = None
    finishing_position: Optional[int] = None
    points: float = 0.0
    laps_completed: Optional[int] = None
    status: str = "FINISHED"
    fastest_lap: bool = False
    fastest_lap_time: Optional[str] = None

class DriverStandingSchema(BaseModel):
    season: int
    round: int
    driver_id: str
    constructor_id: Optional[str] = None
    position: int
    points: float = 0.0
    wins: int = 0
    podiums: int = 0

class ConstructorStandingSchema(BaseModel):
    season: int
    round: int
    constructor_id: str
    position: int
    points: float = 0.0
    wins: int = 0
    podiums: int = 0
