import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, ForeignKey, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base

class Season(Base):
    __tablename__ = "seasons"

    year = Column(Integer, primary_key=True, autoincrement=False)
    wikipedia_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    races = relationship("Race", back_populates="season_rel", cascade="all, delete-orphan")
    driver_standings = relationship("DriverStanding", back_populates="season_rel", cascade="all, delete-orphan")
    constructor_standings = relationship("ConstructorStanding", back_populates="season_rel", cascade="all, delete-orphan")

class Circuit(Base):
    __tablename__ = "circuits"

    id = Column(String(100), primary_key=True) # e.g. monaco, silverstone
    name = Column(String(255), nullable=False)
    locality = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    length_km = Column(Float, nullable=True)
    turns = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    races = relationship("Race", back_populates="circuit")

class Constructor(Base):
    __tablename__ = "constructors"

    id = Column(String(100), primary_key=True) # e.g. ferrari, red_bull
    name = Column(String(255), nullable=False)
    nationality = Column(String(100), nullable=True)
    color_hex = Column(String(10), nullable=True)
    logo_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    history = relationship("DriverConstructorHistory", back_populates="constructor")
    results = relationship("SessionResult", back_populates="constructor")
    standings = relationship("ConstructorStanding", back_populates="constructor")

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String(100), primary_key=True) # e.g. verstappen, hamilton
    driver_code = Column(String(10), nullable=True, index=True) # e.g. VER, HAM
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    nationality = Column(String(100), nullable=True)
    permanent_number = Column(Integer, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    image_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    history = relationship("DriverConstructorHistory", back_populates="driver")
    results = relationship("SessionResult", back_populates="driver")
    laps = relationship("Lap", back_populates="driver")
    standings = relationship("DriverStanding", back_populates="driver")

class DriverConstructorHistory(Base):
    __tablename__ = "driver_constructor_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(String(100), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    constructor_id = Column(String(100), ForeignKey("constructors.id", ondelete="CASCADE"), nullable=False, index=True)
    season = Column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), nullable=False, index=True)
    round_start = Column(Integer, default=1, nullable=False)
    round_end = Column(Integer, nullable=True)

    driver = relationship("Driver", back_populates="history")
    constructor = relationship("Constructor", back_populates="history")

    __table_args__ = (
        UniqueConstraint("driver_id", "constructor_id", "season", "round_start", name="uq_driver_constructor_season"),
    )

class Race(Base):
    __tablename__ = "races"

    id = Column(String(100), primary_key=True) # e.g. 2026_1
    season = Column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), nullable=False, index=True)
    round = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    official_name = Column(String(255), nullable=True)
    circuit_id = Column(String(100), ForeignKey("circuits.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    status = Column(String(50), default="UPCOMING", nullable=False) # UPCOMING, COMPLETED, LIVE, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    season_rel = relationship("Season", back_populates="races")
    circuit = relationship("Circuit", back_populates="races")
    sessions = relationship("Session", back_populates="race", cascade="all, delete-orphan")
    technical_updates = relationship("TechnicalUpdate", back_populates="race", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("season", "round", name="uq_race_season_round"),
    )

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(100), primary_key=True) # e.g. 2026_1_fp1, 2026_1_race
    race_id = Column(String(100), ForeignKey("races.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True) # FP1, FP2, FP3, SPRINT_QUALIFYING, SPRINT, QUALIFYING, RACE
    name = Column(String(100), nullable=False)
    scheduled_start = Column(DateTime, nullable=True)
    actual_start = Column(DateTime, nullable=True)
    status = Column(String(50), default="SCHEDULED", nullable=False) # SCHEDULED, LIVE, COMPLETED
    results_available = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    race = relationship("Race", back_populates="sessions")
    results = relationship("SessionResult", back_populates="session", cascade="all, delete-orphan")
    laps = relationship("Lap", back_populates="session", cascade="all, delete-orphan")
    weather = relationship("Weather", back_populates="session", cascade="all, delete-orphan")
    track_status = relationship("TrackStatus", back_populates="session", cascade="all, delete-orphan")
    race_control_messages = relationship("RaceControlMessage", back_populates="session", cascade="all, delete-orphan")

class SessionResult(Base):
    __tablename__ = "session_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    driver_id = Column(String(100), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    constructor_id = Column(String(100), ForeignKey("constructors.id", ondelete="CASCADE"), nullable=False, index=True)
    grid_position = Column(Integer, nullable=True)
    finishing_position = Column(Integer, nullable=True)
    points = Column(Float, default=0.0, nullable=False)
    laps_completed = Column(Integer, nullable=True)
    status = Column(String(50), default="FINISHED", nullable=False) # FINISHED, DNF, DSQ, DNS
    fastest_lap = Column(Boolean, default=False, nullable=False)
    fastest_lap_time = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("Session", back_populates="results")
    driver = relationship("Driver", back_populates="results")
    constructor = relationship("Constructor", back_populates="results")

    __table_args__ = (
        UniqueConstraint("session_id", "driver_id", name="uq_session_driver_result"),
        Index("idx_session_result_position", "session_id", "finishing_position"),
    )

class DriverStanding(Base):
    __tablename__ = "driver_standings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    season = Column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), nullable=False, index=True)
    round = Column(Integer, nullable=False, index=True)
    driver_id = Column(String(100), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    constructor_id = Column(String(100), ForeignKey("constructors.id", ondelete="CASCADE"), nullable=True)
    position = Column(Integer, nullable=False)
    points = Column(Float, nullable=False, default=0.0)
    wins = Column(Integer, nullable=False, default=0)
    podiums = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    season_rel = relationship("Season", back_populates="driver_standings")
    driver = relationship("Driver", back_populates="standings")

    __table_args__ = (
        UniqueConstraint("season", "round", "driver_id", name="uq_driver_standing_season_round"),
        Index("idx_driver_standings_rank", "season", "round", "position"),
    )

class ConstructorStanding(Base):
    __tablename__ = "constructor_standings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    season = Column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), nullable=False, index=True)
    round = Column(Integer, nullable=False, index=True)
    constructor_id = Column(String(100), ForeignKey("constructors.id", ondelete="CASCADE"), nullable=False, index=True)
    position = Column(Integer, nullable=False)
    points = Column(Float, nullable=False, default=0.0)
    wins = Column(Integer, nullable=False, default=0)
    podiums = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    season_rel = relationship("Season", back_populates="constructor_standings")
    constructor = relationship("Constructor", back_populates="standings")

    __table_args__ = (
        UniqueConstraint("season", "round", "constructor_id", name="uq_constructor_standing_season_round"),
        Index("idx_constructor_standings_rank", "season", "round", "position"),
    )
