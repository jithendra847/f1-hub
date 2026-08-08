import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base

class Lap(Base):
    __tablename__ = "laps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    driver_id = Column(String(100), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    lap_number = Column(Integer, nullable=False, index=True)
    lap_time_seconds = Column(Float, nullable=True)
    is_personal_best = Column(Boolean, default=False, nullable=False)
    compound = Column(String(50), nullable=True) # SOFT, MEDIUM, HARD, INTERMEDIATE, WET
    tyre_age = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("Session", back_populates="laps")
    driver = relationship("Driver", back_populates="laps")
    sectors = relationship("Sector", back_populates="lap", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("session_id", "driver_id", "lap_number", name="uq_session_driver_lap"),
        Index("idx_laps_session_driver", "session_id", "driver_id"),
    )

class Sector(Base):
    __tablename__ = "sectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lap_id = Column(UUID(as_uuid=True), ForeignKey("laps.id", ondelete="CASCADE"), nullable=False, index=True)
    sector_number = Column(Integer, nullable=False) # 1, 2, 3
    sector_time_seconds = Column(Float, nullable=True)
    is_personal_best = Column(Boolean, default=False, nullable=False)

    lap = relationship("Lap", back_populates="sectors")

    __table_args__ = (
        UniqueConstraint("lap_id", "sector_number", name="uq_lap_sector"),
    )

class PitStop(Base):
    __tablename__ = "pit_stops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    driver_id = Column(String(100), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    lap_number = Column(Integer, nullable=False)
    stop_number = Column(Integer, nullable=False)
    duration_seconds = Column(Float, nullable=True)
    total_pit_duration = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("session_id", "driver_id", "stop_number", name="uq_pit_stop_session_driver_stop"),
    )

class Weather(Base):
    __tablename__ = "weather"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    air_temp = Column(Float, nullable=True)
    track_temp = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(Integer, nullable=True)
    rainfall = Column(Boolean, default=False, nullable=False)

    session = relationship("Session", back_populates="weather")

class TrackStatus(Base):
    __tablename__ = "track_status"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False)
    status_code = Column(String(20), nullable=False) # 1: Track Clear, 2: Yellow Flag, 4: Safety Car, 5: Red Flag, 6: VSC
    description = Column(String(255), nullable=True)

    session = relationship("Session", back_populates="track_status")

class RaceControlMessage(Base):
    __tablename__ = "race_control_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False)
    flag = Column(String(50), nullable=True) # GREEN, YELLOW, RED, CHEQUERED, BLACK
    message = Column(String(512), nullable=False)
    category = Column(String(50), nullable=True)
    scope = Column(String(50), nullable=True)

    session = relationship("Session", back_populates="race_control_messages")
